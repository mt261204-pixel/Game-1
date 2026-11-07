import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sound } from '../utils/audio';
import { 
  Send, Bot, Sparkles, MessageCircle, HelpCircle, 
  RotateCcw, Compass, Heart, ShieldCheck 
} from 'lucide-react';

interface ChatTabProps {
  initialAnimal?: any | null;
}

const AVAILABLE_ANIMALS = [
  { id: 'leopard-cat', nameKo: '삵 (살쾡이)', habitat: '한반도 숲과 강변 습지', emoji: '🐆', greeting: '안녕! 나는 한반도 육상 최상위 맹수 삵이야! 🐾 겉모습은 집고양이와 비슷하지만 귀 뒤에 흰 반점이 있지!' },
  { id: 'red-fox', nameKo: '토종 붉은여우', habitat: '소백산 국립공원 덤불 숲', emoji: '🦊', greeting: '반가워! 소백산에서 맑은 공기를 마시며 뛰노는 붉은여우야! 내 풍성한 꼬리 멋지지?' },
  { id: 'otter', nameKo: '유라시아 수달', habitat: '맑은 하천과 호수', emoji: '🦦', greeting: '안녕! 물속을 쌩쌩 헤엄치는 수달이야! 🐟 하천에 물고기가 많고 물이 맑아야 내가 살 수 있어.' },
  { id: 'polar-bear', nameKo: '북극곰', habitat: '북극해 빙하', emoji: '🐻‍❄️', greeting: '안녕... 북극의 차가운 바다 얼음 위에서 살고 있는 북극곰이야. 요즘 얼음이 너무 빨리 녹아 걱정이야.' },
  { id: 'sea-turtle', nameKo: '푸른바다거북', habitat: '따뜻한 바다 산호초', emoji: '🐢', greeting: '안녕! 깊고 푸른 바다를 여행하는 바다거북이야. 비닐봉지를 해파리로 착각할 때가 많아...' },
  { id: 'honeybee', nameKo: '토종 꿀벌', habitat: '야생화 들판과 숲', emoji: '🐝', greeting: '위잉~! 나는 꽃가루를 옮겨주는 부지런한 꿀벌이야! 우리가 사라지면 맛있는 사과와 딸기도 열리지 않아.' }
];

export const ChatTab: React.FC<ChatTabProps> = ({ initialAnimal }) => {
  const [chatMode, setChatMode] = useState<'ranger' | 'animal'>('ranger');
  const [selectedAnimal, setSelectedAnimal] = useState<any>(initialAnimal || AVAILABLE_ANIMALS[0]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '반가워요! 🌿 저는 생태 탐험대장 "에코"입니다. 기후변화 위기와 멸종위기 동식물에 대해 무엇이든 물어보세요! 상단에서 멸종위기 동물 친구를 선택해 1:1 대화를 나눌 수도 있습니다.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      persona: '에코 탐험대장'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // If initialAnimal prop changes, select animal mode
  useEffect(() => {
    if (initialAnimal) {
      setChatMode('animal');
      setSelectedAnimal(initialAnimal);
      setMessages([
        {
          id: 'animal-intro',
          role: 'assistant',
          content: `안녕! 나는 ${initialAnimal.nameKo}야! 🐾\n나와 내 서식지에 대해 궁금한 게 있니? 기후변화가 나에게 미치는 영향이나, 네가 날 어떻게 도울 수 있는지 이야기해줄게!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          persona: initialAnimal.nameKo
        }
      ]);
    }
  }, [initialAnimal]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    sound.playTap();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          mode: chatMode,
          animalContext: chatMode === 'animal' ? selectedAnimal : null
        })
      });

      if (!res.ok) throw new Error('채팅 응답 실패');

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || '생태계의 신호를 정리 중입니다.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        persona: chatMode === 'animal' ? selectedAnimal.nameKo : '에코 탐험대장'
      };

      setMessages(prev => [...prev, botMsg]);
      sound.playTap();
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: '통신망이 불안정하지만, 자연을 향한 당신의 따뜻한 관심은 언제나 소중해요! 다시 물어봐 주시겠어요? 🌿',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnimalPersona = (animal: any) => {
    sound.playTap();
    setChatMode('animal');
    setSelectedAnimal(animal);
    setMessages([
      {
        id: `switch-${Date.now()}`,
        role: 'assistant',
        content: animal.greeting || `안녕! 나는 ${animal.nameKo}야! 반가워! 🐾`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        persona: animal.nameKo
      }
    ]);
  };

  const handleSwitchToRanger = () => {
    sound.playTap();
    setChatMode('ranger');
    setMessages([
      {
        id: `ranger-${Date.now()}`,
        role: 'assistant',
        content: '생태 탐험대장 "에코"입니다! 🌿 기후위기와 생물다양성 보전에 대한 정보, 혹은 일상 속 실천 행동에 대해 무엇이든 편하게 물어보세요!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        persona: '에코 탐험대장'
      }
    ]);
  };

  // Quick Prompt Recommendations
  const quickPrompts = chatMode === 'ranger' ? [
    '지구온난화가 생물 다양성에 왜 그렇게 치명적인가요?',
    '탄소발자국을 줄이는 가장 쉬운 3가지 행동은?',
    '재미있는 기후 생태 퀴즈 하나 내주세요!',
    '한국에서 가장 시급한 멸종위기 동물은 누구인가요?'
  ] : [
    `기후변화 때문에 요즘 사는 게 어때?`,
    `너를 위해 우리가 지금 당장 실천할 수 있는 건 뭐야?`,
    `너의 하루 일과나 특별한 생태 습관을 알려줘!`,
    `나한테 너에 관한 퀴즈 하나만 내줘!`
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Top Selector Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                생태 대화 & 페르소나 챗봇
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                  AI 1:1 교감
                </span>
              </h2>
              <p className="text-xs text-slate-400">대화 상대를 선택해 살아있는 생태계 이야기를 들어보세요</p>
            </div>
          </div>

          {/* Switch Main Role */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={handleSwitchToRanger}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                chatMode === 'ranger' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              🌿 에코 대장
            </button>
            <button
              onClick={() => {
                if (chatMode !== 'animal') handleSelectAnimalPersona(AVAILABLE_ANIMALS[0]);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                chatMode === 'animal' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              🐾 멸종위기 동물
            </button>
          </div>
        </div>

        {/* Animal Persona Chips (shown when in animal mode or accessible anytime) */}
        {chatMode === 'animal' && (
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 block mb-2">
              대화할 멸종위기 동물 친구 선택:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {AVAILABLE_ANIMALS.map(anim => {
                const isCurrent = selectedAnimal?.nameKo?.includes(anim.nameKo.split(' ')[0]);
                return (
                  <button
                    key={anim.id}
                    onClick={() => handleSelectAnimalPersona(anim)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      isCurrent
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <span>{anim.emoji}</span>
                    <span>{anim.nameKo}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Chat Messages Container */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-6 shadow-xl flex flex-col h-[520px]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2">
          {messages.map(msg => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center text-sm font-bold shadow-md shrink-0">
                    {chatMode === 'animal' ? (selectedAnimal?.emoji || '🐾') : '🌿'}
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] space-y-1`}>
                  {!isUser && (
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold px-1">
                      <span>{msg.persona || (chatMode === 'animal' ? selectedAnimal?.nameKo : '에코 탐험대장')}</span>
                      <span className="text-slate-500 text-[10px]">{msg.timestamp}</span>
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      isUser
                        ? 'bg-emerald-600 text-white rounded-tr-none shadow-md'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none shadow-inner'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {isUser && (
                    <div className="text-right text-[10px] text-slate-500 px-1">
                      {msg.timestamp}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-1.5">
                <span className="animate-pulse">답변을 작성하고 있습니다...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="py-2 overflow-x-auto no-scrollbar flex items-center gap-1.5 border-t border-slate-800/80 mt-2">
          <span className="text-[10px] text-slate-500 shrink-0 font-medium">추천 질문:</span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-300 transition-colors shrink-0 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 pt-2 border-t border-slate-800"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder={
              chatMode === 'animal'
                ? `${selectedAnimal?.nameKo || '동물'}에게 하고 싶은 말을 적어보세요...`
                : '에코 대장에게 기후위기나 생태계 궁금증을 물어보세요...'
            }
            className="flex-1 bg-slate-950 text-slate-200 text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-800 focus:border-emerald-500 outline-none placeholder-slate-500"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className={`p-3 rounded-xl font-bold transition-all cursor-pointer ${
              !inputMessage.trim() || isLoading
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
