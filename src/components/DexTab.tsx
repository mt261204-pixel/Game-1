import React, { useState } from 'react';
import { DexCard } from '../types';
import { sound } from '../utils/audio';
import { 
  BookOpen, Lock, Sparkles, Filter, Search, 
  X, MessageSquare, AlertCircle, Shield, Globe 
} from 'lucide-react';

interface DexTabProps {
  cards: DexCard[];
  onOpenChatWithAnimal: (animal: any) => void;
}

export const DexTab: React.FC<DexTabProps> = ({ cards, onOpenChatWithAnimal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalCard, setActiveModalCard] = useState<DexCard | null>(null);

  const unlockedCount = cards.filter(c => c.isUnlocked).length;
  const progressPercent = Math.round((unlockedCount / cards.length) * 100);

  const filteredCards = cards.filter(card => {
    const matchesCategory = selectedCategory === 'all' || card.category === selectedCategory;
    const matchesQuery = card.nameKo.includes(searchQuery) || card.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const getStatusColor = (code: string) => {
    switch (code) {
      case 'CR': return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'EN': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'VU': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'NT': return 'bg-lime-500/20 text-lime-300 border-lime-500/40';
      default: return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner & Collection Progress */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">생태 도감 (Wild Dex)</h2>
          </div>
          <p className="text-xs text-slate-400">
            AI 생태 렌즈 스캔과 퀴즈 챌린지를 통해 위기에 처한 생명들을 도감에 등록하세요.
          </p>
        </div>

        {/* Collection Bar */}
        <div className="flex flex-col min-w-[200px] sm:min-w-[240px] p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex justify-between items-center text-xs font-bold mb-1">
            <span className="text-emerald-400">도감 수집률</span>
            <span className="text-white">{unlockedCount} / {cards.length} ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: '전체 생물' },
            { id: 'korea', label: '🇰🇷 한반도 야생' },
            { id: 'marine', label: '🌊 수생태계' },
            { id: 'polar', label: '❄️ 극지 & 고산' },
            { id: 'pollinator', label: '🌸 수분 매개자' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playTap();
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[180px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="동물 이름 검색..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 outline-none focus:border-emerald-500 placeholder-slate-500"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {filteredCards.map(card => {
          return (
            <div
              key={card.id}
              onClick={() => {
                if (card.isUnlocked) {
                  sound.playTap();
                  setActiveModalCard(card);
                } else {
                  sound.playError();
                }
              }}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col cursor-pointer group ${
                card.isUnlocked
                  ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/80 hover:shadow-xl hover:shadow-emerald-950/30 hover:-translate-y-1'
                  : 'bg-slate-950/70 border-slate-800/60 opacity-60'
              }`}
            >
              {/* Image Container */}
              <div className="relative aspect-square w-full overflow-hidden bg-slate-950">
                {card.isUnlocked ? (
                  <>
                    <img
                      src={card.imageUrl}
                      alt={card.nameKo}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-md ${getStatusColor(card.iucnCode)}`}>
                        {card.iucnCode}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-950">
                    <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500 mb-2">
                      <Lock className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] text-slate-500 font-semibold">미발견 생물</span>
                    <span className="text-[9px] text-slate-600 mt-0.5">스캔 또는 퀴즈로 해금</span>
                  </div>
                )}
              </div>

              {/* Text info */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-semibold text-emerald-400/80">
                    {card.categoryKo}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                    {card.isUnlocked ? card.nameKo : '???'}
                  </h3>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {card.isUnlocked ? card.shortDesc : '신호 감지 대기 중'}
                  </p>
                </div>

                {card.isUnlocked && (
                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{card.koreaGrade.includes('I급') ? 'I급' : card.koreaGrade.includes('II급') ? 'II급' : '국제보호종'}</span>
                    <span className="text-emerald-400 font-semibold group-hover:underline">상세보기 ➔</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Species Detail Modal */}
      {activeModalCard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-emerald-800/80 p-6 shadow-2xl space-y-5">
            {/* Close Button */}
            <button
              onClick={() => setActiveModalCard(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Hero */}
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-full sm:w-44 aspect-square rounded-2xl overflow-hidden shrink-0 bg-slate-950 border border-slate-700">
                <img
                  src={activeModalCard.imageUrl}
                  alt={activeModalCard.nameKo}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${getStatusColor(activeModalCard.iucnCode)}`}>
                    IUCN: {activeModalCard.iucnKo}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold">
                    {activeModalCard.koreaGrade}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-white">{activeModalCard.nameKo}</h3>
                <p className="text-xs text-slate-400 font-mono">
                  {activeModalCard.scientificName} ({activeModalCard.nameEn})
                </p>
                <p className="text-xs text-slate-300 font-medium pt-1">
                  📍 주요 서식지: {activeModalCard.habitat}
                </p>
              </div>
            </div>

            {/* Full Story Description */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Globe className="w-4 h-4" /> 생태적 지위와 역할
              </span>
              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                {activeModalCard.fullDesc}
              </p>
            </div>

            {/* Climate Risk & Threats */}
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-900/50 space-y-2">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> 기후변화 위협 & 멸종 위험
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {activeModalCard.climateRisk}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeModalCard.threats.map((t, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    ⚠️ {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Fun Fact & Action Guide */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-teal-400 block mb-1">
                  💡 신비로운 생태 상식
                </span>
                <p className="text-xs text-slate-300 leading-snug">
                  {activeModalCard.funFact}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-emerald-400 block mb-1">
                  🌱 지구를 위한 1인 실천 행동
                </span>
                <p className="text-xs text-slate-300 leading-snug">
                  {activeModalCard.actionGuide}
                </p>
              </div>
            </div>

            {/* Actions in Modal */}
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  sound.playTap();
                  setActiveModalCard(null);
                  onOpenChatWithAnimal(activeModalCard);
                }}
                className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                이 동물과 1:1 대화하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
