import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const FALLBACK_SPECIES = [
  {
    subjectType: 'pet',
    detectedName: '호기심 많은 코리안 숏헤어 고양이',
    targetEndangeredSpecies: {
      nameKo: '삵 (살쾡이)',
      nameEn: 'Prionailurus bengalensis (Leopard Cat)',
      similarityReason: '날렵한 몸짓과 매서운 동공, 턱 밑의 줄무늬 패턴이 고양이와 매우 흡사하지만, 이마의 뚜렷한 흰색 세로줄과 귀 뒤쪽의 하얀 반점이 야생 맹수 삵의 대표 특징입니다.',
      iucnStatus: 'LC (관심대상 - 전세계) / 국내 멸종위기 야생생물 II급',
      iucnStatusKo: '국내 멸종위기 II급',
      koreaStatus: '멸종위기 야생생물 II급',
      population: '한국 대형 맹수(호랑이, 표범) 멸종 이후 남한 유일의 최고 포식 고양잇과 동물, 서식지 파편화로 급감',
      habitat: '산림 하단부, 개울가, 농경지 주변 습지',
      ecologicalRole: '들쥐와 설치류, 해충의 개체수를 조절하여 농작물 피해를 막고 생태계 균형을 유지하는 최상위 포식자',
      threats: ['도로 횡단 중 로드킬 (가장 큰 사인)', '쥐약 등 2차 독극물 중독', '하천 정비 사업으로 인한 습지 파괴', '농지 개발에 따른 은신처 축소'],
      climateImpact: '기상이변으로 인한 홍수와 극단적 가뭄이 서식 하천을 파괴하고, 주요 먹이원인 양서류와 소형 포유류 개체수를 급변시킴',
      conservationEffort: '야생동물 유도 울타리 및 생태통로 확대 설치, 국립공원공단 야생동물 구조치료센터 구조 및 증식',
      actionTip: '시골길이나 야생동물 주의 표지판 구간에서는 40km 이하로 서행 운전하기, 야생 고양이 방생 금지',
      funFact: '삵은 물을 싫어하는 일반 집고양이와 달리 수영을 아주 잘하며 물고기나 개구리도 능숙하게 사냥합니다!'
    },
    dexCardId: 'leopard-cat',
    rewardXP: 180,
    rewardCoins: 60
  },
  {
    subjectType: 'pet',
    detectedName: '충직한 시바견 / 진돗개',
    targetEndangeredSpecies: {
      nameKo: '붉은여우 (토종 여우)',
      nameEn: 'Vulpes vulpes peculiosa (Korean Red Fox)',
      similarityReason: '쫑긋 솟은 삼각형 귀, 뾰족한 주둥이와 풍성한 꼬리가 시바견이나 진돗개와 무척 닮았으나, 다리 아래쪽의 검은 장화 무늬와 턱 밑의 순백색 털이 토종 붉은여우의 상징입니다.',
      iucnStatus: 'LC (전세계) / 국내 멸종위기 야생생물 I급',
      iucnStatusKo: '국내 멸종위기 I급',
      koreaStatus: '멸종위기 야생생물 I급',
      population: '1970년대 쥐잡기 운동 등으로 국내 야생에서 멸종 위기에 처했으나 소백산 복원사업으로 현재 80여 마리 야생 적응 중',
      habitat: '낮은 야산의 덤불, 숲 가장자리, 농경지 인근',
      ecologicalRole: '설치류 조절 및 씨앗을 먹고 배설하여 숲속 관목 종자를 널리 퍼뜨리는 생태계의 정원사',
      threats: ['과거 무분별한 쥐약 살포로 인한 2차 폐사', '밀렵용 올무와 덫', '차량 로드킬', '야생화된 유기견의 영역 다툼'],
      climateImpact: '온난화로 인한 식생대 북상과 계절성 번식 주기 교란, 겨울철 적설량 감소로 위장 능력 약화',
      conservationEffort: '소백산 국립공원 중심 토종 붉은여우 복원 및 방사 모니터링 추적 사업 진행',
      actionTip: '등산 시 샛길 출입 금지, 야생동물 올무나 불법 포획 도구 발견 시 환경신문고(128) 신고하기',
      funFact: '붉은여우의 꼬리는 단순히 예쁜 게 아니라, 달릴 때 급방향 전환을 돕는 키 역할을 하고 겨울엔 몸을 감싸는 담요가 됩니다!'
    },
    dexCardId: 'red-fox',
    rewardXP: 200,
    rewardCoins: 70
  },
  {
    subjectType: 'wild',
    detectedName: '하천의 귀여운 수달',
    targetEndangeredSpecies: {
      nameKo: '유라시아 수달',
      nameEn: 'Lutra lutra (Eurasian Otter)',
      similarityReason: '물속을 유영하는 유선형 몸매와 동그란 눈망울, 물갈퀴 달린 발이 특징적인 천연기념물 제330호 수달입니다.',
      iucnStatus: 'NT (준위협) / 국내 멸종위기 야생생물 I급',
      iucnStatusKo: '국내 멸종위기 I급 (천연기념물)',
      koreaStatus: '멸종위기 야생생물 I급',
      population: '과거 모피 채취와 하천 오염으로 격감했으나, 최근 도심 생태하천 복원으로 한강, 중랑천 등에도 복귀 중',
      habitat: '맑고 깨끗한 강, 하천, 호수, 바닷가 연안',
      ecologicalRole: '수생태계 먹이사슬 정점에 위치하여 병들거나 개체수가 많은 어류를 조절하는 하천 건강성의 핵심 지표종',
      threats: ['하천 콘크리트화 및 직강화 공사', '폐그물과 통발에 걸리는 익사 사고', '수질 오염 및 플라스틱 쓰레기', '도심 하천 로드킬'],
      climateImpact: '기후위기로 인한 극심한 가뭄으로 하천 건천화 및 수온 상승으로 냉수성 어류 먹이 급감',
      conservationEffort: '인공 수달 서식지 모래톱 조성, 폐그물 수거 및 친환경 생태하천 복원 사업',
      actionTip: '강변 쓰레기 플로깅(줍깅), 합성세제 줄이기, 하천 낚시 금지 구역 지키기',
      funFact: '수달은 좋아하는 반질반질한 조약돌을 겨드랑이 피부 주머니에 넣고 다니며 조개를 깰 때 사용합니다!'
    },
    dexCardId: 'otter',
    rewardXP: 190,
    rewardCoins: 65
  }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { imageBase64, mimeType = 'image/jpeg', userPrompt } = req.body || {};

    if (!imageBase64) {
      return res.status(400).json({ error: '이미지 데이터가 필요합니다.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const pick = FALLBACK_SPECIES[Math.floor(Math.random() * FALLBACK_SPECIES.length)];
      return res.status(200).json({
        ...pick,
        isSimulated: true,
        note: 'GEMINI_API_KEY 환경변수가 설정되지 않아 사전 등록된 생태 도감 데이터로 매칭되었습니다. Vercel 환경변수에 GEMINI_API_KEY를 추가하면 실시간 AI 분석이 활성화됩니다.'
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });

    const base64Data = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

    const promptText = `당신은 전 세계 멸종위기 야생생물(IUCN Red List) 및 환경부 멸종위기 야생생물 전문 생태학자입니다.
업로드된 사진을 분석하세요.
1. 만약 사진이 개, 고양이, 햄스터, 토끼, 앵무새, 물고기 등 흔한 반려동물이거나 가축인 경우:
   - "이 반려동물과 가장 닮은 야생의 멸종위기 도플갱어 종"을 찾아 매칭하세요!
   (예: 고양이 -> 삵/스라소니/눈표범/오셀롯, 개/강아지 -> 한국 붉은여우/늑대/승냥이/아프리카들개, 새 -> 카카포/두루미/저어새/붉은바다매, 햄스터/설치류 -> 하늘다람쥐/아마미토끼 등)
2. 만약 사진이 실제 야생 동물, 조류, 해양생물, 곤충, 식물 등 자연 생물인 경우:
   - 해당 생물 종을 직접 정확히 판별하고, 멸종위기 등급과 생태적 가치를 분석하세요.
3. 기후변화(지구온난화, 서식지 축소, 가뭄/산불 등)가 이 종에게 미치는 영향과 인간의 생태 보전 가치를 반드시 깊이 있게 분석하세요.

반드시 다음 JSON 형식으로만 응답하세요:
{
  "subjectType": "pet" | "wild" | "plant",
  "detectedName": "사진에서 감지된 원래 대상의 이름 (예: 치즈태비 고양이, 흰색 포메라니안, 들꽃 등)",
  "targetEndangeredSpecies": {
    "nameKo": "멸종위기 종의 한국어 이름 (예: 삵, 붉은여우, 저어새, 북극곰, 바다거북 등)",
    "nameEn": "영문 학명 및 일반명 (예: Leopard Cat (Prionailurus bengalensis))",
    "similarityReason": "반려동물과 닮은 신체적/행동적 특징 묘사 (도플갱어인 경우) 또는 야생종 식별 포인트 (2~3문장)",
    "iucnStatus": "CR | EN | VU | NT | LC 중 택1",
    "iucnStatusKo": "위급(CR) | 위기(EN) | 취약(VU) | 준위협(NT) | 관심대상(LC) 중 한국어 표기",
    "koreaStatus": "환경부 멸종위기 야생생물 I급 | II급 | 해당없음(해외 서식종)",
    "population": "현재 야생 개체수 현황 및 위기 경고 문구",
    "habitat": "주요 서식지 및 생태권역",
    "ecologicalRole": "생태계 먹이사슬 및 환경 순환에서 이 종이 맡은 핵심적 가치 (1~2문장)",
    "threats": ["기후변화로 인한 서식지 파괴", "로드킬", "밀렵", "기타 원인 등 3~4가지"],
    "climateImpact": "지구온난화와 기후변화가 이 종의 번식, 먹이, 서식지에 미치는 구체적 영향 (2~3문장)",
    "conservationEffort": "현재 인류와 보호단체가 기울이고 있는 보전 노력",
    "actionTip": "우리가 일상에서 실천할 수 있는 생태계 보호 행동 1가지 (예: 텀블러 사용, 서행 운전, 플로깅 등)",
    "funFact": "사람들이 잘 모르는 이 동물에 대한 신비롭고 재미있는 생태 상식"
  },
  "dexCardId": "영문소문자-슬러그 (예: leopard-cat, red-fox, polar-bear, sea-turtle, honeybee 등)",
  "rewardXP": 180,
  "rewardCoins": 60
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        },
        {
          text: userPrompt ? `${promptText}\n\n사용자 메모: ${userPrompt}` : promptText,
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error('Error in analyze-species handler:', error);
    const fallback = FALLBACK_SPECIES[Math.floor(Math.random() * FALLBACK_SPECIES.length)];
    return res.status(200).json({
      ...fallback,
      isSimulated: true,
      errorNotice: 'AI 분석 일시적 지연으로 생태 도감 데이터로 매칭되었습니다.'
    });
  }
}
