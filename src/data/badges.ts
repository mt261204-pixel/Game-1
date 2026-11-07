import { EcoBadge } from '../types';

export const INITIAL_BADGES: EcoBadge[] = [
  {
    id: 'first-scan',
    title: '생태 렌즈 가동',
    description: '동식물 또는 반려동물 사진을 처음으로 AI 분석했어요.',
    icon: '📸',
    unlocked: false
  },
  {
    id: 'lookalike-finder',
    title: '야생의 도플갱어',
    description: '반려동물과 닮은 멸종위기 야생 사촌을 발견했어요.',
    icon: '🐾',
    unlocked: false
  },
  {
    id: 'quiz-rookie',
    title: '퀴즈 탐험가',
    description: '생태 보호 퀴즈 3문제를 맞혔어요.',
    icon: '🌱',
    unlocked: false
  },
  {
    id: 'quiz-master',
    title: '기후 생태 박사',
    description: '생태 퀴즈 10문제를 완벽히 정복했어요.',
    icon: '🎓',
    unlocked: false
  },
  {
    id: 'streak-fire',
    title: '콤보 불꽃',
    description: '연속 3문제 이상 정답을 맞혀 콤보 보너스를 획득했어요.',
    icon: '🔥',
    unlocked: false
  },
  {
    id: 'pledge-hero',
    title: '지구 수호 서약자',
    description: '일상 속 생태 실천 약속을 3가지 이상 완료했어요.',
    icon: '💚',
    unlocked: false
  },
  {
    id: 'dex-collector',
    title: '야생 생태 수호대',
    description: '생태 도감에 5종 이상의 멸종위기 동물을 등록했어요.',
    icon: '🏆',
    unlocked: false
  }
];
