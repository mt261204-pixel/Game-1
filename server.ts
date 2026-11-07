import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize Google Gen AI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback species catalog for fallback or mock scenarios
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

// Endpoint: Analyze Animal / Plant or Pet Lookalike
app.post('/api/analyze-species', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', userPrompt } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: '이미지 데이터가 필요합니다.' });
    }

    if (!ai) {
      // Return a randomized rich species from database when no key is set
      const pick = FALLBACK_SPECIES[Math.floor(Math.random() * FALLBACK_SPECIES.length)];
      return res.json({
        ...pick,
        isSimulated: true,
        note: 'AI 키가 설정되지 않아 사전 등록된 생태 도감 데이터로 매칭되었습니다.'
      });
    }

    // Strip data url prefix if present
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

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error analyzing species:', error);
    // Graceful fallback to rich preset data
    const fallback = FALLBACK_SPECIES[Math.floor(Math.random() * FALLBACK_SPECIES.length)];
    return res.json({
      ...fallback,
      isSimulated: true,
      errorNotice: 'AI 분석 서버 통신 중 일시적 오류가 발생하여 생태 도감 데이터로 대체되었습니다.'
    });
  }
});

// Endpoint: Eco Chatbot (Ranger Eco or Animal Persona)
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, mode = 'ranger', animalContext } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: '대화 메시지 배열이 필요합니다.' });
    }

    if (!ai) {
      // Simulating friendly eco response
      const lastMsg = messages[messages.length - 1]?.content || '';
      let reply = '';
      if (mode === 'animal' && animalContext) {
        reply = `안녕! 나는 너의 친구 ${animalContext.nameKo}야! 🐾\n내가 살고 있는 ${animalContext.habitat}은 요즘 기후변화 때문에 조금 힘들어. 하지만 네가 이렇게 나에게 관심을 가져줘서 정말 힘이 나! 혹시 내가 가장 좋아하는 먹이나 습성에 대해 퀴즈 한번 풀어볼래?`;
      } else {
        reply = `반가워요, 생태 탐험대원님! 🌿 저는 AI 생태 탐험대장 '에코'입니다.\n기후변화와 생물 다양성 위기는 우리가 일상에서 작은 습관(일회용품 줄이기, 에너지 절약 등)을 바꾸는 것부터 시작할 수 있어요! "${lastMsg}"에 대해 궁금한 점이 있다면 언제든 물어보세요.`;
      }
      return res.json({ reply, quizChallenge: null });
    }

    let systemInstruction = '';
    if (mode === 'animal' && animalContext) {
      systemInstruction = `당신은 멸종위기 동물인 '${animalContext.nameKo}'(${animalContext.nameEn}) 본인입니다!
- 성격: 친근하고 다정하며 생태적 특징(발소리, 울음소리, 습성)을 귀엽고 생생하게 표현합니다.
- 배경: 기후변화와 서식지 파괴로 위기에 처해 있지만, 인간 친구들에게 자연의 소중함과 희망을 전하고 싶어 합니다.
- 말투: "~했어!", "~단다!", 동물 특유의 이모지와 감탄사 사용 (🐾, 🌿, ❄️, 🌊 등).
- 미션: 질문에 친절히 답하고, 기회가 되면 기후변화로 겪는 고충과 인간이 도와줄 수 있는 행동을 감동적으로 알려주세요.
- 만약 대화 맥락에 적절하다면 답변 끝에 1개의 깜짝 생태 퀴즈를 자연스럽게 낼 수도 있습니다.`;
    } else {
      systemInstruction = `당신은 대한민국 최고의 생태 탐험대장이자 기후변화 교육 전문가인 '에코 대장'입니다.
- 성격: 활기차고 박학다식하며 친절한 생태 멘토.
- 목적: 청소년과 시민들이 기후위기와 생물 다양성 감소의 심각성을 쉽고 재미있게 이해하도록 돕습니다.
- 답변 스타일: 명쾌하고 따뜻한 어조, 시각적인 비유, 실천 가능한 환경 팁(탄소발자국 줄이기, 생태계 보전) 제공.
- 답변은 2~4문장으로 간결하고 흥미진진하게 전달하세요.`;
    }

    // Format chat contents for gemini
    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || '생태계의 신비로운 신호를 수신 중입니다. 잠시 후 다시 말을 걸어주세요!';
    return res.json({ reply });
  } catch (error: any) {
    console.error('Chat error:', error);
    return res.json({
      reply: '생태 탐험 통신망에 미세한 전파 간섭이 생겼습니다. 자연을 사랑하는 당신의 마음은 잘 전달되었어요! 🌿'
    });
  }
});

// Endpoint: Dynamic Climate & Ecosystem Quiz Generation
app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { category = 'all', difficulty = 'medium' } = req.body;

    if (!ai) {
      // Fallback curated questions
      const presets = [
        {
          id: 'q-preset-1',
          category: '기후변화와 북극',
          question: '지구온난화로 인해 북극의 빙하가 녹으면서 북극곰이 겪는 가장 큰 문제는 무엇일까요?',
          options: [
            '물 온도가 너무 따뜻해져 수영을 못한다',
            '얼음 발판이 줄어들어 주 먹이인 바다표범을 사냥하기 힘들어진다',
            '털 색깔이 갈색으로 변해 위장이 안 된다',
            '북극에 나무가 너무 많이 자라 시야가 가려진다'
          ],
          answerIndex: 1,
          explanation: '북극곰은 얼음 구멍 사이로 숨을 쉬러 나오는 바다표범을 사냥하는데, 빙하가 일찍 녹고 늦게 얼면서 굶주림과 장거리 수영으로 인한 익사 위험에 처하고 있습니다.',
          ecoTip: '에어컨 희망온도 1℃ 높이기와 대중교통 이용은 빙하가 녹는 속도를 늦춥니다!',
          points: 100
        },
        {
          id: 'q-preset-2',
          category: '꿀벌과 생태계',
          question: '아인슈타인이 "이 생물이 지구상에서 사라지면 인류도 4년 안에 멸종할 것"이라고 경고했던 핵심 생물은?',
          options: ['호랑이', '지렁이', '꿀벌', '고래'],
          answerIndex: 2,
          explanation: '꿀벌은 전 세계 주요 식량 작물의 70% 이상을 수분(가루받이)시키는 핵심 수분 매개자입니다. 기후변화와 농약으로 인한 군집붕괴현상(CCD)은 세계 식량 위기와 직결됩니다.',
          ecoTip: '베란다나 화단에 꿀벌이 좋아하는 토종 야생화를 심어보세요!',
          points: 100
        },
        {
          id: 'q-preset-3',
          category: '한국의 멸종위기종',
          question: '남한 숲에서 호랑이와 표범이 사라진 후, 유일하게 남은 최상위 고양잇과 포식자로 천연기념물/멸종위기 II급인 동물은?',
          options: ['스라소니', '삵 (살쾡이)', '담비', '오소리'],
          answerIndex: 1,
          explanation: '삵은 집고양이와 비슷하지만 귓바퀴 뒤에 흰 반점이 있고 이마에 흰 줄무늬가 뚜렷합니다. 쥐와 설치류를 잡아 농작물 피해를 막아주는 소중한 파수꾼입니다.',
          ecoTip: '시골 야산 도로에서는 로드킬 방지를 위해 야간 서행 운전을 실천해 주세요!',
          points: 100
        }
      ];
      return res.json({ quizzes: presets });
    }

    const prompt = `당신은 전 세계 생태계 및 기후변화 퀴즈 마스터입니다.
카테고리: ${category}, 난이도: ${difficulty}에 맞춰, 초·중·고등학생 및 일반 대중이 재미있게 배우고 생태 감수성을 높일 수 있는 인터랙티브 4지선다 퀴즈 3문제를 생성해 주세요.
주제는 멸종위기 동물(한국 토종 삵/수달/붉은여우/반달가슴곰/저어새, 전세계 북극곰/바다거북/고래/판다), 꿀벌과 식물 생태계, 해양 플라스틱, 지구온난화 탄소중립 등 다양하게 구성하세요.

반드시 다음 JSON 형식으로만 응답하세요:
{
  "quizzes": [
    {
      "id": "quiz-1",
      "category": "분야명 (예: 기후위기, 한국의 야생, 바다 생태계)",
      "question": "흥미롭고 명확한 질문",
      "options": ["보기 1", "보기 2", "보기 3", "보기 4"],
      "answerIndex": 0, // 0, 1, 2, 3 중 정답 인덱스
      "explanation": "왜 이것이 정답인지와 관련된 생태학적 심층 해설 (2~3문장)",
      "ecoTip": "우리가 일상에서 바로 실천할 수 있는 생태 행동 팁 1가지",
      "points": 100
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{"quizzes": []}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Quiz generation error:', error);
    return res.status(500).json({ error: '퀴즈 생성 중 오류가 발생했습니다.' });
  }
});

// Configure Vite middleware or production static serving
const isProd = process.env.NODE_ENV === 'production';
if (!isProd) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`EcoGuardians Server running on http://0.0.0.0:${port}`);
});
