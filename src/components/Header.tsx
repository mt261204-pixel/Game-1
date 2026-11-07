import React from 'react';
import { UserStats } from '../types';
import { sound } from '../utils/audio';
import { Volume2, VolumeX, Shield, Award, Sparkles, TreePine } from 'lucide-react';

interface HeaderProps {
  stats: UserStats;
  soundEnabled: boolean;
  onToggleSound: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenManual: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  soundEnabled,
  onToggleSound,
  activeTab,
  onSelectTab,
  onOpenManual,
}) => {
  const getRankTitle = (lvl: number) => {
    if (lvl >= 5) return '지구 가디언 마스터';
    if (lvl >= 4) return '수석 생태 수호자';
    if (lvl >= 3) return '야생 레인저';
    if (lvl >= 2) return '생태 탐험원';
    return '견습 탐사원';
  };

  const xpPercent = Math.min(100, Math.round((stats.xp / stats.nextLevelXp) * 100));

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-emerald-900/40 shadow-xl">
      <div className="max-w-6xl mx-auto px-4 py-3">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-500/20">
              <Shield className="w-6 h-6 text-emerald-100" />
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                  에코가디언즈
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    와일드 퀘스트
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                멸종위기 동물 알리기 & 기후 생태계 보호 인터랙티브 퀘스트
              </p>
            </div>
          </div>

          {/* User Status Pills */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Level & XP */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-inner">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/40">
                Lv.{stats.level}
              </div>
              <div className="flex flex-col min-w-[70px] sm:min-w-[100px]">
                <div className="flex justify-between items-center text-[10px] text-slate-300 font-medium">
                  <span className="text-emerald-400 truncate font-semibold">{getRankTitle(stats.level)}</span>
                  <span>{stats.xp}/{stats.nextLevelXp} XP</span>
                </div>
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden mt-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Eco Coins */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs">
              <span className="text-sm">🪙</span>
              <span>{stats.coins.toLocaleString()}</span>
            </div>

            {/* App Manual & Vercel Deploy Guide Button */}
            <button
              onClick={() => {
                sound.playTap();
                onOpenManual();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 hover:text-white transition-all text-xs font-bold cursor-pointer shadow-sm"
              title="앱 설명서 & Vercel 배포 가이드 열기"
            >
              <span>📖</span>
              <span className="hidden sm:inline">앱 설명서 & 배포</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="효과음 켜기/끄기"
              title={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 mt-3 overflow-x-auto no-scrollbar pb-0.5">
          {[
            { id: 'scanner', label: 'AI 생태 렌즈', icon: '📸', desc: '도플갱어 & 종 탐지' },
            { id: 'quiz', label: '생태 퀴즈 배틀', icon: '⚡', desc: '서바이벌 & 상식' },
            { id: 'chat', label: '에코 챗봇 & 대화', icon: '💬', desc: '동물과의 1:1 대화' },
            { id: 'dex', label: '생태 도감', icon: '📖', badge: `${stats.unlockedCount}/10` },
            { id: 'sanctuary', label: '서식지 숲 & 서약', icon: '🌱', badge: '실천 미션' }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playTap();
                  onSelectTab(tab.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/30 font-semibold'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800/80'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
