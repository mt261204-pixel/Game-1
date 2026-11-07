import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { 
  X, BookOpen, Rocket, Shield, Sparkles, 
  HelpCircle, CheckCircle2, Copy, ExternalLink, 
  Terminal, Globe, Heart
} from 'lucide-react';

interface AppManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppManualModal: React.FC<AppManualModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'guide' | 'deploy' | 'features'>('guide');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    sound.playSuccess();
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-emerald-800/80 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                에코가디언즈 종합 앱 설명서
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  Vercel 배포 가이드 포함
                </span>
              </h2>
              <p className="text-xs text-slate-400">기획 배경, 게임 이용 가이드 및 1분 Vercel 무료 배포 방법</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-slate-800 px-5 pt-2 bg-slate-950/30 gap-2">
          {[
            { id: 'guide', label: '🌱 기획 배경 및 사용법', icon: '📖' },
            { id: 'features', label: '🎮 5대 핵심 시스템', icon: '⚡' },
            { id: 'deploy', label: '🚀 GitHub & Vercel 배포법', icon: '🌐' }
          ].map(sec => (
            <button
              key={sec.id}
              onClick={() => {
                sound.playTap();
                setActiveSection(sec.id as any);
              }}
              className={`px-3 py-2 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSection === sec.id
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-lg'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <span>{sec.icon}</span>
              <span>{sec.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
          {activeSection === 'guide' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-900/50 space-y-2">
                <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  문제 의식: 기후변화와 생물 다양성의 위기
                </h3>
                <p className="text-slate-200 leading-relaxed text-xs">
                  지구 평균 기온 상승과 극단적 기상이변으로 전 세계 수많은 야생 생물들이 삶의 터전을 잃어가고 있습니다.
                  특히 한반도에서도 호랑이와 표범이 이미 사라졌으며, 삵, 수달, 붉은여우, 저어새 등 토종 야생동물들이 서식지 파편화와 로드킬로 멸종 위기에 처해 있습니다.
                  하지만 전문적인 IUCN Red List나 생태 데이터는 대중에게 생소하고 거리감이 있습니다.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  AI 기반 해결 방안: "일상 속 생명체와 멸종위기종의 연결"
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  에코가디언즈는 <strong>멀티모달 Gemini 3.8 Flash AI</strong>를 활용하여, 이용자가 키우는 반려동물(반려묘, 반려견, 햄스터 등) 사진이나 산책길에서 만난 동식물 사진을 분석합니다.
                  <br /><br />
                  "내 고양이와 가장 닮은 멸종위기 야생 사촌은 <strong>삵(살쾡이)</strong>이구나!",
                  "내 시바견과 닮은 토종 동물은 소백산에서 복원 중인 <strong>붉은여우</strong>구나!"라는
                  흥미로운 감정적 유대감을 형성하고, 생태적 가치와 기후 위협, 1인 1실천 행동을 자연스럽게 체득하도록 설계되었습니다.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'features' && (
            <div className="space-y-3">
              {[
                {
                  title: '1. AI 생태 렌즈 & 도플갱어 탐지',
                  desc: '카메라 촬영 또는 갤러리 업로드로 즉시 분석. 반려동물 도플갱어 매칭 또는 야생 생물 직접 식별, IUCN 적색목록 및 환경부 등급, 기후변화 위협 지표 도출.'
                },
                {
                  title: '2. 생태 퀴즈 아레나 (Speed & AI Dynamic)',
                  desc: '25초 타임어택 5라운드 스피드 퀴즈와 콤보 연승 보너스! 또한 Gemini AI가 실시간으로 새로운 기후변화 퀴즈를 즉석 생성하여 무한 도전 가능.'
                },
                {
                  title: '3. 에코 챗봇 & 동물 페르소나 1:1 대화',
                  desc: '친절한 AI 생태 탐험대장 "에코"와의 Q&A 및 북극곰, 바다거북, 삵, 수달, 꿀벌 등 동물의 입장에서 직접 말하는 감동적인 1인칭 대화.'
                },
                {
                  title: '4. 생태 도감 (Wild Dex)',
                  desc: '한반도 야생, 수생태계, 극지, 수분 매개자별 카드 수집 및 지표종 생태 상식 프로필 잠금 해제.'
                },
                {
                  title: '5. 나의 에코 성소 (My Eco Sanctuary) & 실천 서약',
                  desc: '텀블러 사용, 플로깅, 대기전력 차단 등 일상 환경 실천을 체크하면 메마른 땅이 울창한 숲으로 복원되는 4단계 시뮬레이션 및 7대 명예 배지.'
                }
              ].map((f, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="text-xs font-bold text-emerald-400 mb-1">{f.title}</h4>
                  <p className="text-xs text-slate-300 leading-snug">{f.desc}</p>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'deploy' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-800/60 text-teal-200 text-xs flex items-start gap-2">
                <Globe className="w-4 h-4 shrink-0 text-teal-400 mt-0.5" />
                <div>
                  본 프로젝트는 <strong>Vercel Serverless Functions (`/api/*`)</strong>와 <strong>Vite SPA (`vercel.json`)</strong> 설정이 이미 완료되어 있어, 깃허브에 올리고 Vercel에 연결하기만 하면 1분 안에 배포됩니다.
                </div>
              </div>

              {/* Step 1 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">1</span>
                    GitHub에 코드 올리기 (Git 푸시)
                  </span>
                  <button
                    onClick={() => copyToClipboard(`git init\ngit add .\ngit commit -m "feat: 에코가디언즈 배포"\ngit branch -M main\ngit remote add origin https://github.com/내아이디/저장소이름.git\ngit push -u origin main`, 'git')}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedText === 'git' ? '복사됨!' : '명령어 복사'}
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-slate-900 text-[11px] font-mono text-slate-300 overflow-x-auto">
{`git init
git add .
git commit -m "feat: 에코가디언즈 배포"
git branch -M main
git remote add origin https://github.com/내아이디/저장소이름.git
git push -u origin main`}
                </pre>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">2</span>
                  Vercel에서 저장소 불러오기 (Import)
                </span>
                <p className="text-xs text-slate-300">
                  1. <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline font-semibold">vercel.com</a> 접속 후 GitHub 계정으로 로그인<br />
                  2. <strong>Add New... ➔ Project</strong> 선택<br />
                  3. 방금 올린 저장소 옆의 <strong>[Import]</strong> 버튼 클릭
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">3</span>
                    환경 변수 등록 (Environment Variables)
                  </span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    Gemini 무료 키 발급 ➔
                  </a>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 font-mono text-[11px] text-emerald-300">
                  Key: <strong>GEMINI_API_KEY</strong><br />
                  Value: <strong>AIzaSy... (본인의 구글 AI 스튜디오 API 키)</strong>
                </div>
                <p className="text-[11px] text-slate-400">
                  * 키가 없어도 내장된 생태 도감 데이터로 모든 기능이 안전하게 작동합니다.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/60 space-y-1">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  [Deploy] 클릭하면 배포 완료!
                </span>
                <p className="text-xs text-slate-200">
                  약 30초 후 <code>https://내앱이름.vercel.app</code> 주소가 생성되어 누구나 스마트폰과 PC에서 바로 접속할 수 있습니다!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            프로젝트 루트의 <code>README.md</code>에서도 동일한 가이드를 확인하실 수 있습니다.
          </span>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
