import React, { useState, useRef } from 'react';
import { AnalysisResult } from '../types';
import { SAMPLE_PHOTOS, SamplePhoto } from '../data/samplePhotos';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Camera, Upload, Sparkles, AlertTriangle, ArrowRight, 
  CheckCircle2, RefreshCw, MessageSquare, BookOpen, 
  HelpCircle, ShieldCheck, Flame, Leaf, Globe
} from 'lucide-react';

interface ScannerTabProps {
  onDiscoverSpecies: (result: AnalysisResult) => void;
  onOpenChatWithAnimal: (animal: any) => void;
  onOpenQuizWithCategory: (category: string) => void;
}

export const ScannerTab: React.FC<ScannerTabProps> = ({
  onDiscoverSpecies,
  onOpenChatWithAnimal,
  onOpenQuizWithCategory,
}) => {
  const [scanMode, setScanMode] = useState<'lookalike' | 'wild'>('lookalike');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userNote, setUserNote] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // File Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setAnalysisResult(null);
      setErrorMessage(null);
      sound.playTap();
    };
    reader.readAsDataURL(file);
  };

  // Preset Sample Click
  const handleSelectSample = (sample: SamplePhoto) => {
    sound.playTap();
    setImagePreview(sample.imageUrl);
    setUserNote(`${sample.title} (${sample.desc})`);
    setAnalysisResult(null);
    setErrorMessage(null);
    if (sample.type === 'pet') {
      setScanMode('lookalike');
    } else {
      setScanMode('wild');
    }
  };

  // Start Web Camera
  const handleStartCamera = async () => {
    try {
      sound.playTap();
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      alert('카메라 접근 권한을 확인할 수 없습니다. 파일 업로드를 이용해 주세요.');
      setIsCameraActive(false);
    }
  };

  // Take Snapshot from Camera
  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setImagePreview(dataUrl);
      sound.playScan();
    }
    // Stop stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Cancel Camera
  const handleCancelCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Trigger Gemini Analysis
  const handleRunAnalysis = async () => {
    if (!imagePreview) return;

    setIsScanning(true);
    setErrorMessage(null);
    sound.playScan();

    try {
      setScanStep('1/3 이미지 형태학적 특징 및 생체 패턴 추출 중...');
      await new Promise(r => setTimeout(r, 600));

      setScanStep('2/3 IUCN 적색목록 및 국가보호종 데이터베이스 대조 중...');
      
      const payload: any = {
        imageBase64: imagePreview,
        mode: scanMode,
        userPrompt: userNote || (scanMode === 'lookalike' ? '반려동물과 닮은 멸종위기 야생 도플갱어를 찾아주세요.' : '자연 속 생물 종을 식별하고 멸종위기 등급과 기후변화 위협을 분석해 주세요.')
      };

      const res = await fetch('/api/analyze-species', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      setScanStep('3/3 기후변화 영향성 및 생태계 핵심 가치 지표 생성 완료!');

      if (!res.ok) {
        throw new Error(`분석 서버 오류: ${res.status}`);
      }

      const data: AnalysisResult = await res.json();
      data.uploadedImageUrl = imagePreview;

      setAnalysisResult(data);
      onDiscoverSpecies(data);
      sound.playSuccess();

      // Confetti burst
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      console.error('Scan error:', err);
      setErrorMessage('AI 분석 중 문제가 발생했습니다. 다시 시도해 주세요.');
      sound.playError();
    } finally {
      setIsScanning(false);
      setScanStep('');
    }
  };

  // Status color helper
  const getIucnBadgeColor = (statusStr: string) => {
    if (statusStr.includes('CR') || statusStr.includes('위급')) {
      return 'bg-red-500/20 text-red-400 border-red-500/40';
    }
    if (statusStr.includes('EN') || statusStr.includes('위기')) {
      return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
    }
    if (statusStr.includes('VU') || statusStr.includes('취약')) {
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
    if (statusStr.includes('NT') || statusStr.includes('준위협')) {
      return 'bg-lime-500/20 text-lime-300 border-lime-500/40';
    }
    return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 p-6 border border-emerald-800/40 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              멀티모달 Gemini 생태 렌즈 AI
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              우리 곁의 생명체 속 <span className="text-emerald-400">멸종위기 야생 사촌</span>을 찾아라!
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              반려견, 반려묘, 화초, 산책길 동식물 사진을 촬영하면 유사 종 탐지 AI가 
              <strong className="text-emerald-300 font-semibold"> 멸종위기 등급, 생태계 핵심 가치, 기후변화 위협</strong>을 알려드립니다.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-700 self-start sm:self-center shrink-0">
            <button
              onClick={() => {
                sound.playTap();
                setScanMode('lookalike');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                scanMode === 'lookalike'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🐾 반려동물 도플갱어
            </button>
            <button
              onClick={() => {
                sound.playTap();
                setScanMode('wild');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                scanMode === 'wild'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🌿 자연 생물 직접 식별
            </button>
          </div>
        </div>
      </div>

      {/* Main Upload / Camera Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Image Input & Preview */}
        <div className="md:col-span-6 space-y-4">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-400" />
                사진 등록 & 분석 대상
              </span>
              {imagePreview && (
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setAnalysisResult(null);
                    sound.playTap();
                  }}
                  className="text-xs text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> 다시 선택
                </button>
              )}
            </div>

            {/* Camera View or Preview or Placeholder */}
            {isCameraActive ? (
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border-2 border-emerald-500 shadow-xl">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 pointer-events-none border border-emerald-400/50 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-dashed border-emerald-400/80 rounded-2xl animate-pulse" />
                </div>
                <div className="absolute bottom-3 inset-x-0 flex justify-center gap-3">
                  <button
                    onClick={handleCaptureSnapshot}
                    className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" /> 촬영하기
                  </button>
                  <button
                    onClick={handleCancelCamera}
                    className="px-4 py-2 rounded-full bg-slate-800/90 hover:bg-slate-700 text-white font-medium text-xs cursor-pointer"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : imagePreview ? (
              <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center border border-slate-700 group">
                <img
                  src={imagePreview}
                  alt="업로드된 사진"
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-sm border border-slate-700 text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 준비 완료
                </div>

                {/* Radar sweep effect when scanning */}
                {isScanning && (
                  <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-4">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-emerald-500/40 animate-ping" />
                      <div className="absolute inset-2 rounded-full border border-teal-400/60 animate-spin" />
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <Sparkles className="w-8 h-8 text-emerald-300 animate-bounce" />
                      </div>
                    </div>
                    <p className="text-xs font-bold text-emerald-300 mt-4 text-center px-4 animate-pulse">
                      {scanStep}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border-2 border-dashed border-slate-700 hover:border-emerald-500/60 bg-slate-950/50 hover:bg-slate-900/60 p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all aspect-video"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                  <Upload className="w-7 h-7" />
                </div>
                <p className="text-sm font-bold text-slate-200">
                  사진을 드래그하거나 클릭하여 업로드
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  반려동물(개, 고양이, 햄스터 등) 또는 자연 속 동식물 사진 (JPG, PNG)
                </p>
              </div>
            )}

            {/* Hidden Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Input Action Buttons */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              >
                <Upload className="w-3.5 h-3.5" /> 파일 불러오기
              </button>
              <button
                onClick={handleStartCamera}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-400" /> 직접 촬영하기
              </button>
            </div>

            {/* User Note (Optional) */}
            <div className="mt-3">
              <input
                type="text"
                value={userNote}
                onChange={e => setUserNote(e.target.value)}
                placeholder="간단한 메모 (예: 숲길에서 만난 청설모 / 우리집 치즈냥이)"
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-200 placeholder-slate-500 outline-none"
              />
            </div>

            {/* Analyze Action Button */}
            <button
              onClick={handleRunAnalysis}
              disabled={!imagePreview || isScanning}
              className={`w-full mt-3 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                !imagePreview || isScanning
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 active:scale-[0.99]'
              }`}
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>AI 생태 분석 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>
                    {scanMode === 'lookalike'
                      ? '멸종위기 야생 도플갱어 탐지하기'
                      : '생물 종 식별 & 멸종위기 가치 분석하기'}
                  </span>
                </>
              )}
            </button>

            {errorMessage && (
              <div className="mt-3 p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                {errorMessage}
              </div>
            )}
          </div>

          {/* Quick Preset Samples */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                사진이 없으신가요? 1초 샘플 체험하기
              </span>
              <span className="text-[10px] text-slate-500">클릭 시 즉시 로드</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {SAMPLE_PHOTOS.map(sample => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className="group flex flex-col items-center rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/70 p-1.5 transition-all cursor-pointer text-left overflow-hidden"
                >
                  <div className="w-full aspect-square rounded-lg overflow-hidden mb-1 bg-slate-800">
                    <img
                      src={sample.imageUrl}
                      alt={sample.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-300 truncate w-full text-center">
                    {sample.title}
                  </span>
                  <span className="text-[9px] text-emerald-400/80 truncate w-full text-center">
                    ➔ {sample.expectedMatch.split('/')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis Result Display */}
        <div className="md:col-span-6">
          {analysisResult ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Main Result Card */}
              <div className="rounded-2xl bg-slate-900 border border-emerald-800/60 p-5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* Match Title Banner */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {analysisResult.subjectType === 'pet' ? '발견된 멸종위기 야생 도플갱어' : '식별된 야생 생물'}
                    </span>
                    <h3 className="text-xl font-black text-white mt-0.5">
                      {analysisResult.targetEndangeredSpecies.nameKo}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {analysisResult.targetEndangeredSpecies.nameEn}
                    </p>
                  </div>

                  {/* Rewards tag */}
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                      +{analysisResult.rewardXP} XP 🪙 +{analysisResult.rewardCoins}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">도감 등록 보너스</p>
                  </div>
                </div>

                {/* Badges Row: IUCN status & Korea Grade */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getIucnBadgeColor(analysisResult.targetEndangeredSpecies.iucnStatus)}`}>
                    IUCN: {analysisResult.targetEndangeredSpecies.iucnStatusKo || analysisResult.targetEndangeredSpecies.iucnStatus}
                  </div>
                  {analysisResult.targetEndangeredSpecies.koreaStatus && (
                    <div className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold">
                      {analysisResult.targetEndangeredSpecies.koreaStatus}
                    </div>
                  )}
                  <div className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium">
                    📍 {analysisResult.targetEndangeredSpecies.habitat}
                  </div>
                </div>

                {/* Similarity Reason / Identity */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 mb-4">
                  <div className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                    <span>🔍</span> 닮은점 & 생체 매칭 포인트
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {analysisResult.targetEndangeredSpecies.similarityReason}
                  </p>
                </div>

                {/* Ecological Value */}
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-900/50 mb-4">
                  <div className="text-xs font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    생태계 내 핵심 가치 (왜 보전해야 할까?)
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {analysisResult.targetEndangeredSpecies.ecologicalRole}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    현재 개체군: {analysisResult.targetEndangeredSpecies.population}
                  </p>
                </div>

                {/* Climate Threats */}
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-900/50 mb-4">
                  <div className="text-xs font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    기후변화 위협 경보 (Climate Crisis Alert)
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {analysisResult.targetEndangeredSpecies.climateImpact}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {analysisResult.targetEndangeredSpecies.threats?.map((th, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-200/90 border border-amber-500/20">
                        ⚠️ {th}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Fun Fact & Action Tip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[11px] font-bold text-teal-400 flex items-center gap-1 mb-1">
                      💡 재미있는 생태 상식
                    </span>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      {analysisResult.targetEndangeredSpecies.funFact}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 mb-1">
                      🌱 우리가 실천할 1가지 행동
                    </span>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      {analysisResult.targetEndangeredSpecies.actionTip}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      sound.playTap();
                      onOpenChatWithAnimal(analysisResult.targetEndangeredSpecies);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    이 동물과 1:1 대화하기
                  </button>

                  <button
                    onClick={() => {
                      sound.playTap();
                      onOpenQuizWithCategory(analysisResult.targetEndangeredSpecies.nameKo);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    생태 퀴즈 도전 (+XP)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="h-full min-h-[380px] rounded-2xl bg-slate-900/60 border border-slate-800/80 p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 text-emerald-400 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-200">
                사진을 올리고 생태 렌즈를 가동하세요
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1.5 leading-relaxed">
                반려동물의 사진을 등록하면 어떤 야생 멸종위기 동물과 닮았는지 탐지하고,
                자연 속 식물이나 새, 곤충을 식별해 기후변화 위협과 보전 가치를 분석해 드립니다.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-[11px] text-slate-400">
                <span className="px-2 py-1 rounded-md bg-slate-800/80">🐱 고양이 ➔ 삵/스라소니</span>
                <span className="px-2 py-1 rounded-md bg-slate-800/80">🐕 강아지 ➔ 토종 붉은여우</span>
                <span className="px-2 py-1 rounded-md bg-slate-800/80">🐹 햄스터 ➔ 하늘다람쥐</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
