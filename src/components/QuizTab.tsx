import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';
import { PRESET_QUIZZES } from '../data/presetQuizzes';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Zap, Brain, HelpCircle, Trophy, CheckCircle2, 
  XCircle, ArrowRight, RotateCcw, Sparkles, Clock, 
  Flame, Leaf, Award
} from 'lucide-react';

interface QuizTabProps {
  onQuizCompleted: (earnedXP: number, earnedCoins: number, isPerfect: boolean) => void;
  targetCategory?: string | null;
}

export const QuizTab: React.FC<QuizTabProps> = ({
  onQuizCompleted,
  targetCategory
}) => {
  const [gameMode, setGameMode] = useState<'speed' | 'ai' | 'practice'>('speed');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(25);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);

  // Initialize questions on mode or category change
  const startQuiz = (mode: 'speed' | 'ai' | 'practice') => {
    setGameMode(mode);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setIsGameOver(false);
    setTimeLeft(25);

    if (mode === 'ai') {
      fetchAiQuizzes();
    } else {
      // Shuffle preset quizzes and take 5
      const shuffled = [...PRESET_QUIZZES].sort(() => 0.5 - Math.random());
      setQuestions(shuffled.slice(0, 5));
    }
  };

  const fetchAiQuizzes = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: targetCategory || '기후변화와 멸종위기 야생생물' })
      });
      const data = await res.json();
      if (data.quizzes && data.quizzes.length > 0) {
        setQuestions(data.quizzes);
      } else {
        setQuestions([...PRESET_QUIZZES].slice(0, 4));
      }
    } catch (err) {
      console.error('Failed to load AI quizzes:', err);
      setQuestions([...PRESET_QUIZZES].slice(0, 4));
    } finally {
      setIsLoadingAi(false);
    }
  };

  useEffect(() => {
    startQuiz('speed');
  }, []);

  // Timer countdown for speed mode
  useEffect(() => {
    if (isGameOver || isAnswered || isLoadingAi || questions.length === 0) return;

    if (timeLeft <= 0) {
      handleTimeOut();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isGameOver, isAnswered, isLoadingAi, questions]);

  const handleTimeOut = () => {
    sound.playError();
    setIsAnswered(true);
    setSelectedOption(-1); // Timed out
    setStreak(0);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const currentQ = questions[currentIndex];
    const isCorrect = idx === currentQ.answerIndex;

    if (isCorrect) {
      sound.playSuccess();
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      // Streak multiplier: 1x, 1.2x, 1.5x, 2.0x
      const multiplier = newStreak >= 4 ? 2.0 : newStreak >= 3 ? 1.5 : newStreak >= 2 ? 1.2 : 1.0;
      const pointsEarned = Math.round(currentQ.points * multiplier);
      setScore(prev => prev + pointsEarned);
      setCorrectCount(prev => prev + 1);
    } else {
      sound.playError();
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    sound.playTap();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(25);
    } else {
      // Quiz finished
      setIsGameOver(true);
      const isPerfect = correctCount === questions.length;
      const earnedXP = score;
      const earnedCoins = Math.round(score / 3);

      if (isPerfect || correctCount >= 3) {
        sound.playFanfare();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.5 }
        });
      }
      onQuizCompleted(earnedXP, earnedCoins, isPerfect);
    }
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Quiz Game Mode Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">생태 퀴즈 아레나</h2>
            <p className="text-xs text-slate-400">생태 상식을 겨루고 서식지 복원 포인트를 획득하세요</p>
          </div>
        </div>

        {/* Mode Selector Buttons */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              sound.playTap();
              startQuiz('speed');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              gameMode === 'speed' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ 5라운드 스피드
          </button>
          <button
            onClick={() => {
              sound.playTap();
              startQuiz('ai');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              gameMode === 'ai' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            AI 무한 출제
          </button>
        </div>
      </div>

      {isLoadingAi ? (
        <div className="min-h-[360px] rounded-2xl bg-slate-900/80 border border-slate-800 p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin mb-4" />
          <h3 className="text-base font-bold text-white">Gemini AI가 최신 생태 퀴즈를 출제 중입니다...</h3>
          <p className="text-xs text-slate-400 mt-1">지구온난화, 한반도 멸종위기종, 해양 보호 데이터를 구성하고 있습니다.</p>
        </div>
      ) : isGameOver ? (
        /* Game Over Screen */
        <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-800/60 p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-300 text-3xl shadow-lg border border-amber-500/30">
              🏆
            </div>

            <h3 className="text-2xl font-black text-white">퀴즈 챌린지 완료!</h3>
            <p className="text-sm text-slate-300">
              {correctCount === questions.length
                ? '🎉 완벽합니다! 당신은 진정한 지구 생태 수호자!'
                : correctCount >= 3
                ? '훌륭해요! 생태계에 대한 깊은 관심이 느껴집니다.'
                : '수고하셨어요! 퀴즈를 통해 지구의 소중함을 한 걸음 더 배웠습니다.'}
            </p>

            {/* Score Grid */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto my-6">
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] text-slate-400 font-medium">최종 점수</span>
                <p className="text-xl font-black text-amber-400 mt-0.5">{score}점</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] text-slate-400 font-medium">정답률</span>
                <p className="text-xl font-black text-emerald-400 mt-0.5">
                  {correctCount}/{questions.length}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] text-slate-400 font-medium">최고 콤보</span>
                <p className="text-xl font-black text-orange-400 mt-0.5">🔥 x{maxStreak}</p>
              </div>
            </div>

            {/* Earned Rewards */}
            <div className="inline-flex items-center gap-4 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-sm">
              <span>획득 보상:</span>
              <span>+{score} XP</span>
              <span>🪙 +{Math.round(score / 3)} 코인</span>
            </div>

            {/* Action buttons */}
            <div className="flex justify-center gap-3 pt-4">
              <button
                onClick={() => {
                  sound.playTap();
                  startQuiz('speed');
                }}
                className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> 다시 도전하기
              </button>
              <button
                onClick={() => {
                  sound.playTap();
                  startQuiz('ai');
                }}
                className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" /> AI 퀴즈 풀기
              </button>
            </div>
          </div>
        </div>
      ) : currentQ ? (
        /* Active Quiz Screen */
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6">
          {/* Top Info Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                Q {currentIndex + 1} / {questions.length}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {currentQ.category}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Streak */}
              {streak > 1 && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold animate-pulse">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{streak} 콤보! (x{streak >= 4 ? 2.0 : streak >= 3 ? 1.5 : 1.2})</span>
                </div>
              )}

              {/* Countdown Timer */}
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                timeLeft <= 5
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-ping'
                  : 'bg-slate-800 text-slate-300'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{timeLeft}s</span>
              </div>
            </div>
          </div>

          {/* Time Progress Bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft <= 5 ? 'bg-red-500' : timeLeft <= 10 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${(timeLeft / 25) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="py-2">
            <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === currentQ.answerIndex;

              let btnStyle = 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 text-slate-200';
              if (isAnswered) {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50';
                } else if (isSelected) {
                  btnStyle = 'bg-red-950/80 border-red-500 text-red-200';
                } else {
                  btnStyle = 'bg-slate-950/50 border-slate-800/50 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl border text-left font-medium text-sm flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswered && (
                    <div className="shrink-0 ml-2">
                      {isCorrectAnswer ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-red-400" />
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner (when answered) */}
          {isAnswered && (
            <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                {selectedOption === currentQ.answerIndex ? (
                  <span className="text-emerald-400 font-bold text-sm flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> 정답입니다!
                  </span>
                ) : (
                  <span className="text-red-400 font-bold text-sm flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> 아쉬워요!
                  </span>
                )}
                <span className="text-xs text-slate-400 font-medium">
                  (정답: {currentQ.answerIndex + 1}번 {currentQ.options[currentQ.answerIndex]})
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>

              {/* Eco tip */}
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                <Leaf className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <div>
                  <strong className="font-bold">기후 실천 팁: </strong>
                  {currentQ.ecoTip}
                </div>
              </div>

              {/* Next Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextQuestion}
                  className="py-2 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span>{currentIndex + 1 < questions.length ? '다음 문제로' : '결과 확인하기'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
