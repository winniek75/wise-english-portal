-- 保護者ページのアクセス制御（段階1）
-- ---------------------------------------------------------------------------
-- 目的: いまは誰でも（anonキーで）parent_access / players / game_sessions /
--       wrong_answers を直接読める前提で保護者ページが動いている。
--       6桁コードの照合を「画面」ではなく「データベース」で行い、
--       コードに合う子の記録だけを返す関数に置きかえる。
--
-- ⚠ 実行前に必ず確認すること（このファイルは本番DBを見ずに書いた案です）
--   1. テーブル・列名が本番と一致しているか
--      （parent_access.access_code / player_id、players.id、
--        game_sessions.player_id / played_at、wrong_answers.player_id / mastered / wrong_count）
--   2. 共通SDK（wise-xp.js）が anon キーで各テーブルをどう読んでいるか。
--      手順Bの「直接読み取りの停止」は、SDKが同じテーブルを読んでいると
--      ゲーム側の表示（ランキング・アクセスコード表示など）を壊します。
--      SDKを関数経由に直してから実行してください。
--   3. まずステージング（または本番のコピー）で試すこと。
--
-- 手順A だけなら、既存の動作は何も壊れません（関数が増えるだけ）。
-- ポータルは関数があれば関数を使い、無ければ従来の読み方で動きます。
-- ---------------------------------------------------------------------------

-- 手順A: コードを照合して、その子の記録だけを返す関数 -------------------------

create table if not exists public.parent_access_attempts (
  id bigint generated always as identity primary key,
  ip text,
  tried_at timestamptz not null default now(),
  ok boolean not null
);
alter table public.parent_access_attempts enable row level security;
-- ポリシーを作らない = anon / authenticated からは読めも書けもしない

create or replace function public.get_parent_dashboard(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_player_id players.id%type;
  v_ip text := coalesce(
    nullif(split_part(current_setting('request.headers', true)::json ->> 'x-forwarded-for', ',', 1), ''),
    'unknown');
  v_recent_fail int;
begin
  if p_code is null or p_code !~ '^[0-9]{6}$' then
    return null;
  end if;

  -- 総当たり対策: 同じ接続元から15分に10回まちがえたら、しばらく受け付けない
  select count(*) into v_recent_fail
    from parent_access_attempts
   where ip = v_ip and ok = false and tried_at > now() - interval '15 minutes';
  if v_recent_fail >= 10 then
    raise exception 'too many attempts' using errcode = 'P0001';
  end if;

  select player_id into v_player_id
    from parent_access
   where access_code = p_code
   limit 1;

  insert into parent_access_attempts (ip, ok) values (v_ip, v_player_id is not null);

  if v_player_id is null then
    return null;
  end if;

  return jsonb_build_object(
    'player', (select to_jsonb(p) from players p where p.id = v_player_id),
    'sessions', coalesce((
      select jsonb_agg(to_jsonb(s) order by s.played_at desc)
        from (select game_slug, grade, score, correct_count, total_questions, played_at
                from game_sessions
               where player_id = v_player_id
                 and played_at > now() - interval '90 days'
               order by played_at desc
               limit 1000) s), '[]'::jsonb),
    'wrong_answers', coalesce((
      select jsonb_agg(to_jsonb(w) order by w.wrong_count desc)
        from (select game_slug, question_text, correct_answer, wrong_count
                from wrong_answers
               where player_id = v_player_id and mastered = false
               order by wrong_count desc
               limit 100) w), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.get_parent_dashboard(text) from public;
grant execute on function public.get_parent_dashboard(text) to anon, authenticated;

-- 手順B: 直接読み取りの停止（SDKの確認・改修が済んでから） ---------------------
-- 6桁コードの一覧を誰でも読める状態をやめる。
--
--   alter table public.parent_access enable row level security;
--   drop policy if exists "anon can read parent_access" on public.parent_access;  -- 実際のポリシー名に合わせる
--   revoke select on public.parent_access from anon;
--
-- players / game_sessions / wrong_answers も同様に、anon の select を
-- 「関数経由のみ」にしていく。SDK が書き込みに使う insert / update のポリシーは、
-- 「自分の player_id の行だけ」に絞る（players.id を端末だけが知る秘密として扱うか、
--  Supabase Auth の匿名サインインに切りかえる）。
--
-- 手順C: 確認（別の子の記録が読めないこと）
--   1) anon キーで  GET /rest/v1/parent_access?select=*          → 0件 or 401/403
--   2) anon キーで  POST /rest/v1/rpc/get_parent_dashboard {"p_code":"000000"} → null
--   3) 正しいコードで 2) を呼ぶと、その子の記録だけが返る
--
-- 外部の教室に提供する前に（段階2）
--   - players に classroom_id を持たせ、先生は自分の教室の行だけ読めるRLSにする
--   - 保護者は6桁コードではなく、保護者本人のログイン＋子どもの紐付けにする
