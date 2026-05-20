'use client';

import { useState, useEffect } from 'react';

const SUPABASE_URL = 'https://nrkhfkxzfaycehaxfdek.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ya2hma3h6ZmF5Y2VoYXhmZGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNjY0MTEsImV4cCI6MjA5NDg0MjQxMX0.-GC_51aIDQGleMaWqa4Q7Y6qSynZiVZcSWnSYOMHfZw';

const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
};

async function api(path: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers });
  if (!res.ok) return null;
  return res.json();
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
  'grammar-drill': 'グラマードリル',
  'grammar-app': 'グラマーアプリ',
  'eiken-grammar-game': '英検文法',
  'aredo-game': 'Are/Doクイズ',
  'verbform-battle': '動詞変化バトル',
  'phonics': 'ジョリーフォニックス',
  'phonics-battle': 'フォニックスバトル',
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

export default function ParentDashboard() {
  const [code, setCode] = useState('');
  const [player, setPlayer] = useState<Player | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState<'code' | 'dashboard'>('code');

  const handleSubmit = async () => {
    if (code.length !== 6) { setError('6桁のコードを入力してください'); return; }
    setLoading(true);
    setError('');

    const access = await api(`parent_access?access_code=eq.${code}&select=player_id`);
    if (!access || access.length === 0) {
      setError('コードが見つかりません');
      setLoading(false);
      return;
    }

    const playerId = access[0].player_id;
    const [playerData, sessionData, wrongData] = await Promise.all([
      api(`players?id=eq.${playerId}&select=*`),
      api(`game_sessions?player_id=eq.${playerId}&order=played_at.desc&limit=50&select=*`),
      api(`wrong_answers?player_id=eq.${playerId}&mastered=eq.false&order=wrong_count.desc&limit=30&select=*`),
    ]);

    if (playerData && playerData[0]) {
      setPlayer(playerData[0]);
      setSessions(sessionData || []);
      setWrongAnswers(wrongData || []);
      setView('dashboard');
    } else {
      setError('プレイヤーデータが見つかりません');
    }
    setLoading(false);
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
            <h1 className="text-3xl font-black text-white mb-2">保護者ダッシュボード</h1>
            <p className="text-gray-400">お子様のアクセスコードを入力してください</p>
          </div>

          <div className="mb-6">
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full text-center text-4xl font-mono tracking-[0.5em] bg-white/5 border-2 border-white/20 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:border-purple-400 focus:outline-none transition-all"
            />
          </div>

          {error && <p className="text-red-400 text-center mb-4">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading || code.length !== 6}
            className="w-full py-4 rounded-2xl font-bold text-lg text-white transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
          >
            {loading ? '読み込み中...' : '確認する'}
          </button>

          <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-sm text-gray-400 text-center">
              アクセスコードは、お子様のゲーム画面の<br/>
              プロフィール設定から確認できます
            </p>
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
          <span className="text-sm text-gray-500">保護者ダッシュボード</span>
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
                <div className="text-xs text-gray-400 mt-1">ゲーム数</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-green-400">
                  {todaySessions.reduce((a, s) => a + s.correct_count, 0)}
                </div>
                <div className="text-xs text-gray-400 mt-1">正解数</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-yellow-400">
                  {todaySessions.reduce((a, s) => a + (s.score || 0), 0).toLocaleString()}
                </div>
                <div className="text-xs text-gray-400 mt-1">合計スコア</div>
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
            <div className="text-xs text-gray-400">プレイしたゲーム種類</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/10">
            <div className="text-2xl font-black text-white">{wrongAnswers.length}</div>
            <div className="text-xs text-gray-400">復習が必要な問題</div>
          </div>
        </div>

        {/* Game Breakdown */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
          <h3 className="text-lg font-bold text-white mb-4">🎮 ゲーム別成績</h3>
          <div className="space-y-3">
            {Object.entries(gameStats).sort((a, b) => b[1].count - a[1].count).map(([slug, stats]) => {
              const accuracy = stats.totalQuestions > 0 ? Math.round(stats.totalCorrect / stats.totalQuestions * 100) : 0;
              return (
                <div key={slug} className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                  <div>
                    <div className="text-white font-bold text-sm">{GAME_NAMES[slug] || slug}</div>
                    <div className="text-xs text-gray-500">{stats.count}回プレイ</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-bold" style={{ color: accuracy >= 80 ? '#6bff8e' : accuracy >= 60 ? '#ffd93d' : '#ff6b6b' }}>
                        {accuracy}%
                      </div>
                      <div className="text-xs text-gray-500">正解率</div>
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
            <h3 className="text-lg font-bold text-white mb-4">📝 苦手な問題 TOP10</h3>
            <div className="space-y-2">
              {wrongAnswers.slice(0, 10).map((w, i) => (
                <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                  <div className="flex-1">
                    <div className="text-white text-sm">{w.question_text}</div>
                    <div className="text-xs text-gray-500">{GAME_NAMES[w.game_slug] || w.game_slug}</div>
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
          <h3 className="text-lg font-bold text-white mb-4">📊 最近のプレイ履歴</h3>
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

        <div className="text-center text-gray-600 text-xs py-4">
          WISE English Portal - Parent Dashboard
        </div>
      </div>
    </div>
  );
}
