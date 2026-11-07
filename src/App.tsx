/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserStats, DexCard, EcoBadge, AnalysisResult } from './types';
import { INITIAL_DEX_CARDS } from './data/initialDex';
import { INITIAL_BADGES } from './data/badges';
import { Header } from './components/Header';
import { ScannerTab } from './components/ScannerTab';
import { QuizTab } from './components/QuizTab';
import { ChatTab } from './components/ChatTab';
import { DexTab } from './components/DexTab';
import { HabitatPledgeTab } from './components/HabitatPledgeTab';
import { sound } from './utils/audio';
import confetti from 'canvas-confetti';

const STORAGE_KEY_STATS = 'ecoguardians_stats_v1';
const STORAGE_KEY_DEX = 'ecoguardians_dex_v1';
const STORAGE_KEY_BADGES = 'ecoguardians_badges_v1';

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('scanner');
  const [selectedAnimalForChat, setSelectedAnimalForChat] = useState<any | null>(null);
  const [targetCategoryForQuiz, setTargetCategoryForQuiz] = useState<string | null>(null);

  // Load or Initialize State
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STATS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      level: 1,
      xp: 60,
      nextLevelXp: 300,
      coins: 120,
      unlockedCount: 2,
      quizzesSolved: 0,
      correctAnswers: 0,
      streak: 0,
      sanctuaryHealth: 45,
      pledgedActions: [],
      unlockedBadges: []
    };
  });

  const [dexCards, setDexCards] = useState<DexCard[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DEX);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_DEX_CARDS;
  });

  const [badges, setBadges] = useState<EcoBadge[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BADGES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_BADGES;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
      localStorage.setItem(STORAGE_KEY_DEX, JSON.stringify(dexCards));
      localStorage.setItem(STORAGE_KEY_BADGES, JSON.stringify(badges));
    } catch {}
  }, [stats, dexCards, badges]);

  // Audio mute toggle
  const handleToggleSound = () => {
    sound.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  // Add XP and Coins, check Level Up
  const grantRewards = (xpAmount: number, coinsAmount: number, healthBoost: number = 0) => {
    setStats(prev => {
      let newXp = prev.xp + xpAmount;
      let newLevel = prev.level;
      let newNextXp = prev.nextLevelXp;
      let leveledUp = false;

      while (newXp >= newNextXp) {
        newXp -= newNextXp;
        newLevel += 1;
        newNextXp = Math.round(newNextXp * 1.4);
        leveledUp = true;
      }

      if (leveledUp) {
        sound.playFanfare();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.4 }
        });
      }

      const newHealth = Math.min(100, prev.sanctuaryHealth + healthBoost);

      return {
        ...prev,
        level: newLevel,
        xp: newXp,
        nextLevelXp: newNextXp,
        coins: prev.coins + coinsAmount,
        sanctuaryHealth: newHealth
      };
    });
  };

  // Unlock Badge helper
  const unlockBadge = (badgeId: string) => {
    setBadges(prev =>
      prev.map(b => (b.id === badgeId ? { ...b, unlocked: true } : b))
    );
  };

  // Handle Species Discovery from Scanner
  const handleDiscoverSpecies = (result: AnalysisResult) => {
    grantRewards(result.rewardXP || 150, result.rewardCoins || 50, 10);
    unlockBadge('first-scan');

    if (result.subjectType === 'pet') {
      unlockBadge('lookalike-finder');
    }

    // Unlock or register in Dex Cards
    setDexCards(prev => {
      let matched = false;
      const updated = prev.map(card => {
        // match by slug or korean name
        const matchByName = card.nameKo.includes(result.targetEndangeredSpecies.nameKo.split(' ')[0]) ||
          result.targetEndangeredSpecies.nameKo.includes(card.nameKo.split(' ')[0]);
        const matchBySlug = card.id === result.dexCardId;

        if (matchByName || matchBySlug) {
          matched = true;
          return {
            ...card,
            isUnlocked: true,
            unlockedAt: new Date().toISOString()
          };
        }
        return card;
      });

      // If new unknown card, append
      if (!matched) {
        const newCard: DexCard = {
          id: result.dexCardId || `species-${Date.now()}`,
          nameKo: result.targetEndangeredSpecies.nameKo,
          nameEn: result.targetEndangeredSpecies.nameEn,
          scientificName: result.targetEndangeredSpecies.nameEn,
          category: 'korea',
          categoryKo: '탐지 생물',
          iucnCode: (result.targetEndangeredSpecies.iucnStatus?.slice(0, 2) as any) || 'VU',
          iucnKo: result.targetEndangeredSpecies.iucnStatusKo || '취약',
          koreaGrade: result.targetEndangeredSpecies.koreaStatus || '국가보호종',
          imageUrl: result.uploadedImageUrl || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
          shortDesc: result.targetEndangeredSpecies.ecologicalRole,
          fullDesc: `${result.targetEndangeredSpecies.similarityReason}\n\n${result.targetEndangeredSpecies.ecologicalRole}`,
          habitat: result.targetEndangeredSpecies.habitat,
          threats: result.targetEndangeredSpecies.threats || [],
          climateRisk: result.targetEndangeredSpecies.climateImpact,
          funFact: result.targetEndangeredSpecies.funFact,
          actionGuide: result.targetEndangeredSpecies.actionTip,
          isUnlocked: true,
          unlockedAt: new Date().toISOString()
        };
        updated.push(newCard);
      }

      const count = updated.filter(c => c.isUnlocked).length;
      setStats(s => ({ ...s, unlockedCount: count }));
      if (count >= 4) unlockBadge('dex-collector');

      return updated;
    });
  };

  // Handle Quiz Completed
  const handleQuizCompleted = (earnedXP: number, earnedCoins: number, isPerfect: boolean) => {
    grantRewards(earnedXP, earnedCoins, 12);
    setStats(prev => {
      const solved = prev.quizzesSolved + 5;
      const correct = prev.correctAnswers + Math.round(earnedXP / 100);
      return {
        ...prev,
        quizzesSolved: solved,
        correctAnswers: correct
      };
    });

    unlockBadge('quiz-rookie');
    if (isPerfect) {
      unlockBadge('streak-fire');
      unlockBadge('quiz-master');
    }
  };

  // Handle Daily Pledge Toggle
  const handleTogglePledge = (pledgeId: string, earnedXP: number, earnedCoins: number) => {
    setStats(prev => {
      const exists = prev.pledgedActions.includes(pledgeId);
      const updatedPledges = exists
        ? prev.pledgedActions.filter(p => p !== pledgeId)
        : [...prev.pledgedActions, pledgeId];

      if (!exists) {
        grantRewards(earnedXP, earnedCoins, 8);
      }

      if (updatedPledges.length >= 3) {
        unlockBadge('pledge-hero');
      }

      return {
        ...prev,
        pledgedActions: updatedPledges
      };
    });
  };

  // Inter-tab navigations
  const handleOpenChatWithAnimal = (animal: any) => {
    setSelectedAnimalForChat(animal);
    setActiveTab('chat');
  };

  const handleOpenQuizWithCategory = (category: string) => {
    setTargetCategoryForQuiz(category);
    setActiveTab('quiz');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Header with Stats & Navigation */}
      <Header
        stats={stats}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {activeTab === 'scanner' && (
          <ScannerTab
            onDiscoverSpecies={handleDiscoverSpecies}
            onOpenChatWithAnimal={handleOpenChatWithAnimal}
            onOpenQuizWithCategory={handleOpenQuizWithCategory}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizTab
            onQuizCompleted={handleQuizCompleted}
            targetCategory={targetCategoryForQuiz}
          />
        )}

        {activeTab === 'chat' && (
          <ChatTab initialAnimal={selectedAnimalForChat} />
        )}

        {activeTab === 'dex' && (
          <DexTab
            cards={dexCards}
            onOpenChatWithAnimal={handleOpenChatWithAnimal}
          />
        )}

        {activeTab === 'sanctuary' && (
          <HabitatPledgeTab
            stats={stats}
            badges={badges}
            unlockedCards={dexCards.filter(c => c.isUnlocked)}
            onTogglePledge={handleTogglePledge}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>🌿 에코가디언즈 · 멸종위기 야생생물 보호 및 기후위기 인식 제고 프로젝트</span>
          <span className="text-slate-400">IUCN 적색목록 & 대한민국 환경부 멸종위기종 데이터 기반</span>
        </div>
      </footer>
    </div>
  );
}
