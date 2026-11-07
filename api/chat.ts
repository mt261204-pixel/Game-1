import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages, mode = 'ranger', animalContext } = req.body || {};

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: '대화 메시지 배열이 필요합니다.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const lastMsg = messages[messages.length - 1]?.content || '';
      let reply = '';
      if (mode === 'animal' && animalContext) {
        reply = `안녕! 나는 너의 친구 ${animalContext.nameKo}야! 🐾\n내가 살고 있는 ${animalContext.habitat}은 요즘 기후변화 때문에 조금 힘들어. 하지만 네가 이렇게 나에게 관심을 가져줘서 정말 힘이 나! 혹시 내가 가장 좋아하는 먹이나 습성에 대해 퀴즈 한번 풀어볼래?`;
      } else {
        reply = `반가워요, 생태 탐험대원님! 🌿 저는 AI 생태 탐험대장 '에코'입니다.\n기후변화와 생물 다양성 위기는 우리가 일상에서 작은 습관(일회용품 줄이기, 에너지 절약 등)을 바꾸는 것부터 시작할 수 있어요! "${lastMsg}"에 대해 궁금한 점이 있다면 언제든 물어보세요.`;
      }
      return res.status(200).json({ reply, quizChallenge: null });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });

    let systemInstruction = '';
    if (mode === 'animal' && animalContext) {
      systemInstruction = `당신은 멸종위기 동물인 '${animalContext.nameKo}'(${animalContext.nameEn}) 본인입니다!
- 성격: 친근하고 다정하며 생태적 특징(발소리, 울음소리, 습성)을 귀엽고 생생하게 표현합니다.
- 배경: 기후변화와 서식지 파괴로 위기에 처해 있지만, 인간 친구들에게 자연의 소중함과 희망을 전하고 싶어 합니다.
- 말투: "~했어!", "~단다!", 동물 특유의 이모지와 감탄사 사용 (🐾, 🌿, ❄️, 🌊 등).
- 미션: 질문에 친절히 답하고, 기회가 되면 기후변화로 겪는 고충과 인간이 도와줄 수 있는 행동을 감동적으로 알려주세요.`;
    } else {
      systemInstruction = `당신은 대한민국 최고의 생태 탐험대장이자 기후변화 교육 전문가인 '에코 대장'입니다.
- 성격: 활기차고 박학다식하며 친절한 생태 멘토.
- 목적: 청소년과 시민들이 기후위기와 생물 다양성 감소의 심각성을 쉽고 재미있게 이해하도록 돕습니다.
- 답변 스타일: 명쾌하고 따뜻한 어조, 시각적인 비유, 실천 가능한 환경 팁(탄소발자국 줄이기, 생태계 보전) 제공.
- 답변은 2~4문장으로 간결하고 흥미진진하게 전달하세요.`;
    }

    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: { systemInstruction },
    });

    const reply = response.text || '생태계의 신비로운 신호를 수신 중입니다. 잠시 후 다시 말을 걸어주세요!';
    return res.status(200).json({ reply });
  } catch (error: any) {
    console.error('Chat error:', error);
    return res.status(200).json({
      reply: '생태 탐험 통신망에 미세한 전파 간섭이 생겼습니다. 자연을 사랑하는 당신의 마음은 잘 전달되었어요! 🌿'
    });
  }
}
