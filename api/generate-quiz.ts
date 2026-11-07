import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const PRESET_QUIZZES = [
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { category = 'all', difficulty = 'medium' } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({ quizzes: PRESET_QUIZZES });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });

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
      "answerIndex": 0,
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
    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error('Quiz generation error:', error);
    return res.status(200).json({ quizzes: PRESET_QUIZZES });
  }
}
