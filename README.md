# 🌿 에코가디언즈 (EcoGuardians): 멸종위기 동물 알리기 & 생태계 보호 퀴즈 앱

> **기후변화로 인한 생물 다양성 위기 극복을 위한 AI 기반 게이미피케이션 생태 교육 플랫폼**
> 
> 반려동물이나 자연 속 동식물 사진을 찍으면 **유사 종 탐지 AI(Gemini 3.8 Flash)**가 멸종위기 등급과 생태적 가치 정보를 안내하고, 챗봇 및 게임형 퀴즈 배틀을 통해 생태계 보호 의식을 고취합니다.

---

## 📌 1. 문제 배경 및 AI 해결 방안

- **문제 상황**: 기후변화와 서식지 파괴로 전 세계 및 한반도의 생물 다양성이 심각한 위기에 처해 있으나, 대중의 위기의식이 낮고 관련 전문 정보(IUCN Red List, 국가 멸종위기종 등)에 대한 접근성이 떨어집니다.
- **AI 해결 방안**: 
  1. **멀티모달 비전 AI (AI 생태 렌즈)**: 일상 속 반려동물(개, 고양이, 햄스터 등)의 사진을 올리면 이와 생체적·유전적으로 가장 닮은 '멸종위기 야생 도플갱어'(삵, 토종 붉은여우, 눈표범, 하늘다람쥐 등)를 찾아 매칭하거나 자연 생물을 직접 식별.
  2. **생태 가치 & 기후 위협 분석**: 해당 종의 생태계 내 핵심 역할, 기후변화(온난화, 해빙, 서식지 축소) 영향, 일상 속 1인 1실천 팁을 시각화.
  3. **게이미피케이션 퀴즈 & 도감**: 5라운드 스피드 퀴즈, AI 실시간 무한 퀴즈, 생태 도감(Wild Dex) 수집, 서식지 숲(Eco Sanctuary) 복원 시뮬레이션 제공.
  4. **에코 챗봇 & 동물 페르소나**: AI 생태 탐험대장 및 멸종위기 동물(북극곰, 바다거북, 수달, 꿀벌 등)과의 1:1 감정 이입 대화.

---

## ✨ 2. 핵심 기능 안내

| 탭 / 기능 | 주요 내용 |
| :--- | :--- |
| **📸 AI 생태 렌즈** | • 반려동물 도플갱어 탐지 vs 자연 생물 직접 식별 모드<br>• 카메라 촬영 및 사진 파일 업로드 지원<br>• 6종 원클릭 샘플 테스트 (치즈냥이, 시바견, 햄스터, 수달, 꿀벌, 북극곰)<br>• IUCN 적색목록 및 환경부 멸종위기 I/II급 판별 |
| **⚡ 생태 퀴즈 아레나** | • 5라운드 스피드 서바이벌 (25초 타이머 & 콤보 배율 x1.0~x2.0)<br>• Gemini 실시간 동적 퀴즈 출제 모드<br>• 상세 생태학적 해설 및 실천 팁 제공<br>• 정답률 기반 경험치(XP) 및 코인 보상 |
| **💬 에코 챗봇 & 대화** | • AI 생태 탐험대장 '에코'와의 환경 Q&A<br>• 멸종위기 동물(삵, 붉은여우, 수달, 북극곰, 바다거북, 꿀벌 등) 1인칭 페르소나 대화<br>• 추천 질문 칩 및 기습 퀴즈 인터랙션 |
| **📖 생태 도감 (Wild Dex)** | • 한반도 야생, 수생태계, 극지/고산, 수분 매개자별 카드 수집<br>• 미해금 동물 실루엣 잠금 해제 시스템<br>• 생태 지표종 상세 프로필 및 보전 가치 카드 모달 |
| **🌱 서식지 숲 & 실천 서약** | • 나의 에코 성소 (My Eco Sanctuary) 4단계 시뮬레이션<br>• 일일 환경 실천 체크리스트 (텀블러, 줍깅, 대기전력 차단, 계단 걷기 등)<br>• 7대 가디언 업적 명예 배지 시스템 |

---

## 🛠️ 3. 기술 스택

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas-Confetti
- **Audio Synthesizer**: Web Audio API (외부 mp3 파일 없이 순수 브라우저 합성 사운드 구현)
- **AI Engine**: Google Gemini API (`gemini-3.8-flash` via `@google/genai`)
- **Serverless / Backend**: Vercel Serverless Functions (`/api/*`), Express (로컬 및 AI Studio 환경)
- **Deployment**: Vercel, GitHub

---

## 🚀 4. GitHub 업로드 및 Vercel 1분 무료 배포 가이드

본 프로젝트는 **Vercel Serverless 환경과 완벽히 호환되도록 구성**되어 있습니다. 아래 순서대로 진행하면 누구나 1분 안에 전 세계에 무료 배포할 수 있습니다.

### [1단계] GitHub 리포지토리 생성 및 코드 푸시

1. [GitHub](https://github.com/)에 로그인하고 우측 상단 `+` 버튼 ➔ **New repository**를 클릭합니다.
2. 저장소 이름을 입력합니다 (예: `eco-guardians-quiz`).
3. 공개 범위(Public 또는 Private)를 선택하고 **Create repository**를 누릅니다.
4. 로컬 터미널(또는 작업 폴더)에서 다음 명령어로 코드를 깃허브에 푸시합니다:

```bash
# 1. git 초기화 (이미 되어 있다면 생략)
git init

# 2. 모든 파일 추가 및 커밋
git add .
git commit -m "feat: 에코가디언즈 멸종위기 동물 & 생태 퀴즈 웹앱 완성"

# 3. 브랜치명을 main으로 설정
git branch -M main

# 4. 내 깃허브 저장소 연결 (본인의 GitHub 주소 입력)
git remote add origin https://github.com/사용자아이디/eco-guardians-quiz.git

# 5. 푸시
git push -u origin main
```

---

### [2단계] Vercel에서 리포지토리 불러오기 (Import)

1. [Vercel](https://vercel.com/)에 접속하여 **GitHub 계정으로 로그인**합니다.
2. 대시보드 우측 상단 **[Add New...]** ➔ **[Project]**를 클릭합니다.
3. 방금 푸시한 `eco-guardians-quiz` 저장소 옆의 **[Import]** 버튼을 누릅니다.

---

### [3단계] 프로젝트 빌드 설정 확인 (자동 감지)

Vercel이 본 프로젝트의 `vercel.json`과 `vite` 설정을 자동으로 감지합니다:
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
*(별도로 수정할 필요 없이 기본값 유지)*

---

### [4단계] 환경 변수(Environment Variables) 설정 (중요 🔑)

Vercel 배포 화면 하단의 **Environment Variables** 토글을 열고 환경 변수를 등록합니다:

| Key | Value | 설명 |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | `AIzaSy...` (본인의 Gemini API 키) | Google AI Studio에서 무료로 발급받은 API 키 |

> 💡 **Gemini API 키가 아직 없으신가요?**
> 1. [Google AI Studio](https://aistudio.google.com/app/apikey)에 접속하여 구글 로그인합니다.
> 2. **Get API key** ➔ **Create API key**를 클릭하여 무료 키를 복사합니다.
> 3. Vercel의 `Environment Variables`에 붙여넣습니다.
> *(키를 등록하지 않더라도, 내장된 생태 도감 데이터 및 퀴즈 폴백 기능으로 서비스 체험이 가능합니다.)*

---

### [5단계] [Deploy] 클릭 및 배포 완료!

- **[Deploy]** 버튼을 누르면 약 30초~1분 후 빌드가 완료되며, `https://eco-guardians-quiz.vercel.app` 형태의 **무료 전 세계 공개 URL**이 생성됩니다.
- 모바일(스마트폰), 태블릿, PC 등 모든 기기에서 카메라 촬영 및 AI 분석이 작동합니다!

---

## 💻 5. 로컬 개발 환경 실행 방법

컴퓨터에서 직접 코드를 수정하고 실행하고 싶을 때:

```bash
# 1. 의존성 패키지 설치
npm install

# 2. 환경 변수 파일 생성
cp .env.example .env
# .env 파일을 열고 GEMINI_API_KEY="본인의_API_키" 를 입력합니다.

# 3. 로컬 풀스택 개발 서버 실행
npm run dev
# 브라우저에서 http://localhost:3000 접속
```

---

## 📁 6. 프로젝트 디렉토리 구조

```text
├── api/                     # Vercel Serverless Functions (백엔드 API 엔드포인트)
│   ├── analyze-species.ts   # 사진 분석 및 멸종위기 도플갱어 탐지 API
│   ├── chat.ts              # 에코 대장 및 동물 페르소나 1:1 대화 API
│   └── generate-quiz.ts     # 실시간 생태 퀴즈 생성 API
├── src/
│   ├── components/          # 핵심 UI 컴포넌트
│   │   ├── Header.tsx       # 레벨, 경험치, 코인, 내비게이션 바
│   │   ├── ScannerTab.tsx   # AI 생태 렌즈 & 카메라 스캔
│   │   ├── QuizTab.tsx      # 스피드 퀴즈 서바이벌 & AI 퀴즈 배틀
│   │   ├── ChatTab.tsx      # 멸종위기 동물 페르소나 챗봇
│   │   ├── DexTab.tsx       # 생태 도감 카드 컬렉션
│   │   ├── HabitatPledgeTab.tsx # 서식지 성소 복원 & 일일 실천 서약
│   │   └── AppManualModal.tsx   # 인앱(웹앱 내) 상세 사용 설명서 모달
│   ├── data/                # 생태 도감, 퀴즈, 배지, 샘플 사진 데이터셋
│   ├── utils/               # Web Audio API 사운드 신시사이저
│   ├── types.ts             # TypeScript 데이터 인터페이스 정의
│   ├── App.tsx              # 앱 메인 컨트롤러 및 상태 관리
│   └── main.tsx             # React 엔트리포인트
├── server.ts                # 로컬 및 AI Studio 환경용 Express 서버
├── vercel.json              # Vercel 배포 및 리라이트 라우팅 설정
├── package.json             # 패키지 매니페스트
└── README.md                # 종합 프로젝트 및 배포 설명서
```

---

## 📜 라이선스

Apache License 2.0. 누구나 생태 보전과 기후위기 교육 목적으로 자유롭게 활용 및 배포할 수 있습니다.
