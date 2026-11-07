export interface SamplePhoto {
  id: string;
  title: string;
  type: 'pet' | 'wild';
  desc: string;
  expectedMatch: string;
  imageUrl: string;
}

export const SAMPLE_PHOTOS: SamplePhoto[] = [
  {
    id: 'sample-cat',
    title: '치즈태비 고양이',
    type: 'pet',
    desc: '반려묘와 멸종위기 고양잇과 맹수의 닮은꼴 찾기',
    expectedMatch: '삵 (살쾡이) / 스라소니',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sample-dog',
    title: '갈색 시바견 / 진돗개',
    type: 'pet',
    desc: '반려견의 뾰족한 귀와 풍성한 꼬리로 도플갱어 탐지',
    expectedMatch: '토종 붉은여우',
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sample-hamster',
    title: '볼빵빵 햄스터',
    type: 'pet',
    desc: '작은 설치류 반려동물의 야생 친척 탐지',
    expectedMatch: '하늘다람쥐 / 초원비단털쥐',
    imageUrl: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sample-otter',
    title: '강변의 수달',
    type: 'wild',
    desc: '자연 속 수생태계 천연기념물 직접 탐지',
    expectedMatch: '유라시아 수달 (I급)',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sample-bee',
    title: '꽃과 꿀벌',
    type: 'wild',
    desc: '수분 매개자 곤충과 지구 식량위기 분석',
    expectedMatch: '토종 꿀벌 (군집붕괴위기)',
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sample-polar-bear',
    title: '빙하의 북극곰',
    type: 'wild',
    desc: '지구온난화 기후위기 대표 지표종 식별',
    expectedMatch: '북극곰 (취약 VU)',
    imageUrl: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=600&q=80'
  }
];
