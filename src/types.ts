export type IucnStatusCode = 'CR' | 'EN' | 'VU' | 'NT' | 'LC';

export interface EndangeredSpecies {
  nameKo: string;
  nameEn: string;
  similarityReason: string;
  iucnStatus: string;
  iucnStatusKo: string;
  koreaStatus: string;
  population: string;
  habitat: string;
  ecologicalRole: string;
  threats: string[];
  climateImpact: string;
  conservationEffort: string;
  actionTip: string;
  funFact: string;
  imageUrl?: string;
}

export interface AnalysisResult {
  subjectType: 'pet' | 'wild' | 'plant' | 'unknown';
  detectedName: string;
  targetEndangeredSpecies: EndangeredSpecies;
  dexCardId: string;
  rewardXP: number;
  rewardCoins: number;
  isSimulated?: boolean;
  uploadedImageUrl?: string;
  note?: string;
}

export interface DexCard {
  id: string;
  nameKo: string;
  nameEn: string;
  scientificName: string;
  category: 'korea' | 'polar' | 'marine' | 'forest' | 'pollinator';
  categoryKo: string;
  iucnCode: IucnStatusCode;
  iucnKo: string;
  koreaGrade: string;
  imageUrl: string;
  shortDesc: string;
  fullDesc: string;
  habitat: string;
  threats: string[];
  climateRisk: string;
  funFact: string;
  actionGuide: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  ecoTip: string;
  points: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  persona?: string;
}

export interface UserStats {
  level: number;
  xp: number;
  nextLevelXp: number;
  coins: number;
  unlockedCount: number;
  quizzesSolved: number;
  correctAnswers: number;
  streak: number;
  sanctuaryHealth: number; // 0 - 100
  pledgedActions: string[];
  unlockedBadges: string[];
}

export interface EcoBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}
