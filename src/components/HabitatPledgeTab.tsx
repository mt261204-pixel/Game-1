import React from 'react';
import { UserStats, EcoBadge, DexCard } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  TreePine, CheckCircle2, Circle, Award, Sparkles, 
  Droplets, Sun, Wind, Heart, Leaf, Shield
} from 'lucide-react';

interface HabitatPledgeTabProps {
  stats: UserStats;
  badges: EcoBadge[];
  unlockedCards: DexCard[];
  onTogglePledge: (pledgeId: string, earnedXP: number, earnedCoins: number) => void;
}

const PLEDGE_ITEMS = [
  { id: 'tumbler', text: '일회용 컵 대신 개인 텀블러/머그잔 사용하기', icon: '☕', xp: 30, coins: 15, impact: '연간 플라스틱 컵 250개 절약 및 해양 쓰레기 방지' },
  { id: 'stairs', text: '3층 이하는 엘리베이터 대신 계단 걷기', icon: '🚶', xp: 30, coins: 15, impact: '전력 소비 절감 및 건강 증진 (1회 4.5g CO2 감축)' },
  { id: 'plogging', text: '산책이나 등산 시 작은 쓰레기 1개 이상 줍기 (플로깅)', icon: '🗑️', xp: 50, coins: 25, impact: '야생동물 이물질 섭취 및 미세플라스틱 유입 차단' },
  { id: 'plug', text: '사용하지 않는 가전제품 플러그 뽑아 대기전력 차단', icon: '🔌', xp: 25, coins: 10, impact: '가정 전력 소모의 10%를 차지하는 낭비 전력 차단' },
  { id: 'food', text: '오늘 하루 식사 잔반 남기지 않기 (빈 그릇 운동)', icon: '🍱', xp: 35, coins: 15, impact: '음식물 쓰레기 분해 시 발생하는 강력한 메탄가스 억제' },
  { id: 'temp', text: '실내 적정온도 준수 (여름 26℃, 겨울 20℃ 유지)', icon: '🌡️', xp: 30, coins: 15, impact: '냉난방 에너지 7% 절감으로 극지방 빙하 해빙 둔화' }
];

export const HabitatPledgeTab: React.FC<HabitatPledgeTabProps> = ({
  stats,
  badges,
  unlockedCards,
  onTogglePledge
}) => {
  const getStageTitle = (health: number) => {
    if (health >= 85) return '생명의 울창한 원시림 낙원';
    if (health >= 60) return '생태 복원 완료! 푸른 숲과 맑은 하천';
    if (health >= 35) return '회복의 묘목과 꽃밭';
    return '초기 정화 중인 아기 새싹';
  };

  const handlePledgeClick = (item: typeof PLEDGE_ITEMS[0]) => {
    const isAlreadyPledged = stats.pledgedActions.includes(item.id);
    if (!isAlreadyPledged) {
      sound.playSuccess();
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 }
      });
    } else {
      sound.playTap();
    }
    onTogglePledge(item.id, item.xp, item.coins);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Sanctuary Visual Showcase */}
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-teal-950/40 to-slate-900 border border-emerald-800/60 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <TreePine className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-black text-white">나의 에코 성소 (My Eco Sanctuary)</h2>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              퀴즈 정답과 환경 실천 서약으로 황폐해진 땅을 울창한 생명의 숲으로 복원하세요.
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-emerald-500/40 text-xs font-bold text-emerald-300 flex items-center gap-2 self-start sm:self-auto">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>상태: {getStageTitle(stats.sanctuaryHealth)} ({stats.sanctuaryHealth}%)</span>
          </div>
        </div>

        {/* Dynamic Landscape Display */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-sky-950 via-teal-950 to-emerald-950 h-56 sm:h-64 border border-emerald-900/50 flex flex-col justify-end p-4 shadow-inner">
          {/* Sky & Sun/Moon */}
          <div className="absolute top-4 left-6 flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-amber-400/90 shadow-lg shadow-amber-400/50 flex items-center justify-center animate-pulse">
              <Sun className="w-6 h-6 text-amber-950" />
            </div>
            <div className="text-[11px] text-teal-200/80 font-medium">
              청정 대기 환경 복원 중
            </div>
          </div>

          {/* Floating Climate Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/3 text-lg animate-bounce duration-1000">🌸</div>
            <div className="absolute top-1/3 right-1/4 text-lg animate-pulse">🐝</div>
            <div className="absolute top-1/2 left-1/5 text-base animate-ping">✨</div>
          </div>

          {/* Habitat Animals Visiting (from unlocked cards) */}
          <div className="absolute bottom-12 inset-x-4 flex items-end justify-around gap-2 z-10 pointer-events-none">
            {unlockedCards.slice(0, 5).map((card, i) => (
              <div
                key={card.id}
                className="flex flex-col items-center animate-in fade-in zoom-in duration-700"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-emerald-400/80 shadow-lg bg-slate-900 hover:scale-110 transition-transform">
                  <img src={card.imageUrl} alt={card.nameKo} className="w-full h-full object-cover" />
                </div>
                <span className="text-[9px] font-bold text-white bg-slate-900/80 px-1.5 py-0.2 rounded mt-1 border border-slate-700">
                  {card.nameKo.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>

          {/* Ground Terrain */}
          <div className="relative z-0 w-full h-10 rounded-xl bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 border-t-2 border-emerald-500/60 flex items-center justify-between px-4">
            <span className="text-[11px] font-bold text-emerald-200">
              🌱 서식지 건강도: {stats.sanctuaryHealth}%
            </span>
            <div className="w-48 h-2.5 bg-slate-950/60 rounded-full overflow-hidden border border-emerald-500/30">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-1000 rounded-full"
                style={{ width: `${stats.sanctuaryHealth}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Daily Eco Action Checklist */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              오늘의 생태 보호 1인 1실천 서약 (Eco Pledge)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              실천할 때마다 성소 건강도와 경험치, 코인이 즉시 지급됩니다!
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            {stats.pledgedActions.length} / {PLEDGE_ITEMS.length} 완료
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PLEDGE_ITEMS.map(item => {
            const isChecked = stats.pledgedActions.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => handlePledgeClick(item)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isChecked
                    ? 'bg-emerald-950/40 border-emerald-500/70 shadow-md'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-2xl shrink-0 pt-0.5">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs font-bold ${isChecked ? 'text-emerald-300 line-through' : 'text-slate-200'}`}>
                      {item.text}
                    </p>
                    <div className="shrink-0 text-emerald-400">
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-slate-950" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                      )}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                    {item.impact}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-emerald-400/90 font-semibold">
                    <span>+{item.xp} XP</span>
                    <span>🪙 +{item.coins} 코인</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges / Achievements Showcase */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">가디언 업적 & 명예 배지</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {badges.filter(b => b.unlocked).length} / {badges.length} 달성
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {badges.map(b => (
            <div
              key={b.id}
              className={`p-3.5 rounded-xl border text-center transition-all ${
                b.unlocked
                  ? 'bg-slate-950 border-amber-500/50 shadow-md shadow-amber-500/10'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-50'
              }`}
            >
              <div className="text-3xl mb-1.5">{b.icon}</div>
              <h4 className={`text-xs font-bold ${b.unlocked ? 'text-amber-300' : 'text-slate-400'}`}>
                {b.title}
              </h4>
              <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                {b.description}
              </p>
              <div className="mt-2 text-[9px] font-semibold">
                {b.unlocked ? (
                  <span className="text-emerald-400">✅ 획득 완료</span>
                ) : (
                  <span className="text-slate-500">🔒 미획득</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
