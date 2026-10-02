'use client';

import { useState } from 'react';

const SUPABASE_URL = 'https://nrkhfkxzfaycehaxfdek.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ya2hma3h6ZmF5Y2VoYXhmZGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNjY0MTEsImV4cCI6MjA5NDg0MjQxMX0.-GC_51aIDQGleMaWqa4Q7Y6qSynZiVZcSWnSYOMHfZw';

const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
};

class LoadError extends Error {}

async function request(path: string, init?: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    return await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers, signal: controller.signal, ...init });
  } catch {
    throw new LoadError('network');
  } finally {
    clearTimeout(timer);
  }
}

async function api(path: string) {
  const res = await request(path);
  if (!res.ok) throw new LoadError(`http ${res.status}`);
  return res.json();
}

interface Dashboard {
  player: Player;
  sessions: Session[];
  wrongAnswers: WrongAnswer[];
  /** 集計の範囲（画面に明記する） */
  scope: string;
}

/**
 * 推奨経路: DB側の関数 get_parent_dashboard(p_code) がコードを照合し、その子の記録だけを返す
 * （docs/supabase-parent-access.sql）。関数がまだ無い環境では従来のテーブル直接参照で動かす。
 */
async function loadDashboard(code: string): Promise<Dashboard | null> {
  const rpc = await request('rpc/get_parent_dashboard', {
    method: 'POST',
    body: JSON.stringify({ p_code: code }),
  });
  if (rpc.ok) {
    const data = await rpc.json();
    if (!data || !data.player) return null;
    return {
      player: data.player,
      sessions: data.sessions || [],
      wrongAnswers: data.wrong_answers || [],
      scope: '直近90日',
    };
  }
  if (rpc.status !== 404) throw new LoadError(`http ${rpc.status}`);

  const access = await api(`parent_access?access_code=eq.${code}&select=player_id`);
  if (!access || access.length === 0) return null;
  const playerId = access[0].player_id;
  const [playerData, sessionData, wrongData] = await Promise.all([
    api(`players?id=eq.${playerId}&select=*`),
    api(`game_sessions?player_id=eq.${playerId}&order=played_at.desc&limit=50&select=*`),
    api(`wrong_answers?player_id=eq.${playerId}&mastered=eq.false&order=wrong_count.desc&limit=30&select=*`),
  ]);
  if (!playerData || !playerData[0]) return null;
  return {
    player: playerData[0],
    sessions: sessionData || [],
    wrongAnswers: wrongData || [],
    scope: '直近50回のプレイ',
  };
}

interface Player {
  id: string;
  display_name: string;
  avatar_emoji: string;
  total_xp: number;
  level: number;
  streak_current: number;
  streak_best: number;
  games_played: number;
  created_at: string;
}

interface Session {
  game_slug: string;
  grade: string;
  score: number;
  correct_count: number;
  total_questions: number;
  played_at: string;
}

interface WrongAnswer {
  game_slug: string;
  question_text: string;
  correct_answer: string;
  wrong_count: number;
}

const GAME_NAMES: Record<string, string> = {
  'eiken-game': '英検クエスト',
  'fallingwordbattle': 'フォーリングワード',
  'flashinput': 'フラッシュインプット',
  'grammar-drill': 'to / ing 使い分けドリル',
  'grammar-app': '先生と英文法レッスン',
  'eiken-grammar-game': '英検3級 文法マスター',
  'aredo-game': 'Am・Is・Are・Do・Does クイズ',
  'verbform-battle': '関係詞＆分詞ドリル',
  'phonics': 'ジョリーフォニックス',
  'phonics-battle': 'はじめての英単語バトル',
  'phonics-sounds': 'フォニックスサウンド',
  'sight-words-memory': 'サイトワーズメモリー',
  'instant-english-app': '瞬間英作文',
  'sentence-dash': 'リーディングダッシュ',
  'wh-questiongame': 'WH質問ゲーム',
  'wise-english-floor': 'THE FLOOR',
  'eiken-sns-app': '英検SNS',
  'beat-word-crush': 'ビートワードクラッシュ',
  'eiken-challenge': '英検チャレンジ',
};

const GAME_URLS: Record<string, string> = Object.fromEntries(
  Object.keys(GAME_NAMES).map((slug) => [slug, `https://${slug}-winniek75s-projects.vercel.app`])
);

export default function ParentDashboard() {
  const [code, setCode] = useState('');
  const [player, setPlayer] = useState<Player | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState<'code' | 'dashboard'>('code');

  const [scope, setScope] = useState('');

  const handleSubmit = async () => {
    if (code.length !== 6) { setError('6桁のコードを入力してください'); return; }
    setLoading(true);
    setError('');
    try {
      const data = await loadDashboard(code);
      if (!data) {
        setError('コードが見つかりません。数字をもう一度ご確認ください。');
        return;
      }
      setPlayer(data.player);
      setSessions(data.sessions);
      setWrongAnswers(data.wrongAnswers);
      setScope(data.scope);
      setView('dashboard');
    } catch {
      setError('読み込めませんでした。通信状況を確認して、もう一度「確認する」を押してください。');
    } finally {
      setLoading(false);
    }
  };

  // Group sessions by date
  const sessionsByDate = sessions.reduce((acc, s) => {
    const date = new Date(s.played_at).toLocaleDateString('ja-JP');
    if (!acc[date]) acc[date] = [];
    acc[date].push(s);
    return acc;
  }, {} as Record<string, Session[]>);

  // Game stats
  const gameStats = sessions.reduce((acc, s) => {
    if (!acc[s.game_slug]) acc[s.game_slug] = { count: 0, totalCorrect: 0, totalQuestions: 0, bestScore: 0 };
    acc[s.game_slug].count++;
    acc[s.game_slug].totalCorrect += s.correct_count;
    acc[s.game_slug].totalQuestions += s.total_questions;
    acc[s.game_slug].bestScore = Math.max(acc[s.game_slug].bestScore, s.score);
    return acc;
  }, {} as Record<string, { count: number; totalCorrect: number; totalQuestions: number; bestScore: number }>);

  // Today's sessions
  const today = new Date().toLocaleDateString('ja-JP');
  const todaySessions = sessions.filter(s => new Date(s.played_at).toLocaleDateString('ja-JP') === today);

  if (view === 'code') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
            <h1 className="text-3xl font-black text-white mb-2">保護者の方へ</h1>
            <p className="text-gray-300">お子さまの学習のようすを確認できます。<br/>6桁のアクセスコードを入力してください。</p>
          </div>

          <div className="mb-6">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              aria-label="6桁のアクセスコード"
              onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
              maxLength={6}
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full text-center text-4xl font-mono tracking-[0.5em] bg-white/5 border-2 border-white/20 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:border-purple-400 focus:outline-none transition-all"
            />
          </div>

          {error && <p role="alert" className="text-red-300 text-center mb-4">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading || code.length !== 6}
            className="w-full py-4 rounded-2xl font-bold text-lg text-white transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
          >
            {loading ? '読み込み中...' : '確認する'}
          </button>

          <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-sm text-gray-300 text-center">
              アクセスコードは、お子さまのゲーム画面の<br/>
              プロフィール設定から確認できます
            </p>
          </div>
          <div className="mt-4 flex justify-center gap-5 text-sm">
            <a href="/" className="text-purple-300 hover:text-white">← 学習ホーム</a>
            <a href="/about" className="text-purple-300 hover:text-white">使い方・データの扱い</a>
          </div>
        </div>
      </div>
    );
  }

  if (!player) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => setView('code')} className="text-gray-400 hover:text-white transition-all">
            ← 戻る
          </button>
          <span className="text-sm text-gray-400">保護者ページ</span>
        </div>

        {/* Player Profile */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{player.avatar_emoji}</div>
            <div>
              <h2 className="text-2xl font-black text-white">{player.display_name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ background: 'linear-gradient(135deg, #ffd93d, #ff8e53)', color: '#1a1a2e' }}>
                  Lv.{player.level}
                </span>
                <span className="text-yellow-400 font-bold">{player.total_xp.toLocaleString()} XP</span>
                {player.streak_current > 0 && (
                  <span className="text-pink-400">🔥 {player.streak_current}日連続</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Today's Summary */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
          <h3 className="text-lg font-bold text-white mb-4">📅 今日の学習</h3>
          {todaySessions.length === 0 ? (
            <p className="text-gray-400">今日はまだプレイしていません</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-cyan-400">{todaySessions.length}</div>
                <div className="text-xs text-gray-400 mt-1">取り組んだ回数</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-green-400">
                  {todaySessions.reduce((a, s) => a + s.correct_count, 0)}
                </div>
                <div className="text-xs text-gray-400 mt-1">正解数</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-yellow-400">
                  {(() => {
                    const t = todaySessions.reduce((a, s) => a + (s.total_questions || 0), 0);
                    const c = todaySessions.reduce((a, s) => a + (s.correct_count || 0), 0);
                    return t > 0 ? `${Math.round((c / t) * 100)}%` : '—';
                  })()}
                </div>
                <div className="text-xs text-gray-400 mt-1">正答率</div>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/10">
            <div className="text-2xl font-black text-white">{player.games_played}</div>
            <div className="text-xs text-gray-400">総プレイ回数</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/10">
            <div className="text-2xl font-black text-white">{player.streak_best}</div>
            <div className="text-xs text-gray-400">最長連続日数</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/10">
            <div className="text-2xl font-black text-white">{Object.keys(gameStats).length}</div>
            <div className="text-xs text-gray-400">取り組んだゲームの種類（{scope}）</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/10">
            <div className="text-2xl font-black text-white">{wrongAnswers.length}</div>
            <div className="text-xs text-gray-400">まだ定着していない問題{scope === '直近50回のプレイ' ? '（上位30件まで）' : ''}</div>
          </div>
        </div>

        {/* Game Breakdown */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
          <h3 className="text-lg font-bold text-white">🎮 ゲーム別の正答率</h3>
          <p className="text-xs text-gray-400 mb-4">{scope}の記録から集計しています</p>
          <div className="space-y-3">
            {Object.entries(gameStats).sort((a, b) => b[1].count - a[1].count).map(([slug, stats]) => {
              const accuracy = stats.totalQuestions > 0 ? Math.round(stats.totalCorrect / stats.totalQuestions * 100) : 0;
              return (
                <div key={slug} className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                  <div>
                    <div className="text-white font-bold text-sm">{GAME_NAMES[slug] || slug}</div>
                    <div className="text-xs text-gray-400">{stats.count}回</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-bold" style={{ color: accuracy >= 80 ? '#6bff8e' : accuracy >= 60 ? '#ffd93d' : '#ff6b6b' }}>
                        {accuracy}%
                      </div>
                      <div className="text-xs text-gray-400">正答率</div>
                    </div>
                    <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${accuracy}%`,
                          background: accuracy >= 80 ? '#6bff8e' : accuracy >= 60 ? '#ffd93d' : '#ff6b6b'
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wrong Answers */}
        {wrongAnswers.length > 0 && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
            <h3 className="text-lg font-bold text-white">📝 つぎに練習したい問題</h3>
            <p className="text-xs text-gray-400 mb-4">まちがえた回数が多い順に10件。ゲーム名を押すと、そのゲームを開けます。</p>
            <div className="space-y-2">
              {wrongAnswers.slice(0, 10).map((w, i) => (
                <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                  <div className="flex-1">
                    <div className="text-white text-sm">{w.question_text}</div>
                    <a href={GAME_URLS[w.game_slug] || '/'} className="text-xs text-purple-300 underline">{GAME_NAMES[w.game_slug] || w.game_slug} でもう一度</a>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className="text-green-400 text-xs font-bold">{w.correct_answer}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-red-500/20 text-red-400">{w.wrong_count}回</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
          <h3 className="text-lg font-bold text-white">📊 最近の取り組み</h3>
          <p className="text-xs text-gray-400 mb-4">正解数／問題数と、ゲーム内の得点</p>
          <div className="space-y-4">
            {Object.entries(sessionsByDate).slice(0, 7).map(([date, daySessions]) => (
              <div key={date}>
                <div className="text-sm text-gray-400 mb-2">{date}</div>
                <div className="space-y-1">
                  {daySessions.map((s, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                      <span className="text-sm text-white">{GAME_NAMES[s.game_slug] || s.game_slug}</span>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-gray-400">{s.correct_count}/{s.total_questions}</span>
                        <span className="text-yellow-400 font-bold">{s.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-gray-400 text-xs py-4 leading-relaxed">
          ゲームや端末がちがうと、記録が別々になる場合があります（ひとつにまとめる仕組みは準備中です）。
          <br/>WISE English Club
        </div>
      </div>
    </div>
  );
}
