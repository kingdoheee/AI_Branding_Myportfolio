# 🤖 AI·IT 교육 사업개발 전문가 김도희 포트폴리오 (2026)

본 프로젝트는 8년 3개월 이상의 경력을 보유한 **AI·IT 교육 사업개발 전문가 김도희**의 전문성을 극대화하여 보여주기 위한 프리미엄 웹 포트폴리오입니다.

---

## 📝 Product Requirements Document (PRD)

### 1. 프로젝트 비전
- **Target**: 대기업, 정부기관, IT 교육 서비스 기업 관계자 및 잠재적 비즈니스 파트너.
- **Goal**: "3만 시간의 교육 경험"과 "36억+의 사업 성과"를 가진 신뢰 기반의 전문가 아우라 형성.
- **Design Concept**: **Cyber-Editorial** (AI의 지적인 명징함 + 매거진의 읽기 쉬운 레이아웃).

### 2. 핵심 기능 요구사항
- **접근 제어 (Security)**: SHA-256 해싱 기술을 적용한 보기 모드(`view2026`) 및 관리자 모드(`admin2026!`) 보안 로그인.
- **실시간 편집 (Admin Features)**: 관리자 모드 활성화 시 `contentEditable`을 통한 텍스트 즉시 수정 및 클라우드 동기화.
- **데이터 영속성 (Persistence)**: Supabase PostgreSQL 연동을 통한 실시간 데이터 저장 및 LocalStorage 백업(하이브리드 방식).
- **인터랙티브 경험 (UX)**:
    - 스크롤 기반 섹션 드러내기(Scroll Reveal).
    - 핵심 지표 카운트업(Count-up) 애니메이션.
    - 마우스 동선을 따르는 은은한 스포트라이트(Spotlight) 배경 효과.

### 3. 기술 스택
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (Pure ES6+)
- **Backend/DB**: Supabase (PostgreSQL client)
- **Deployment**: Vercel (Auto-deploy via GitHub)

---

## 🎨 Design System Guide

### Typography & Layout
- **Font**: Pretendard (가독성 중심의 프리미엄 서체)
- **Hierarchy**: Eyebrow(자간 0.3em) - Header - Body 간의 명확한 시각적 위계 확립.
- **Layout**: 180px의 광활한 가로 여백을 활용한 매거진 스타일의 여유로운 공간감.

### Color Palette
- **Main**: `Ink Charcoal` (텍스트 가독성 최우선)
- **Point**: `Electric Indigo` (기술적 신뢰감)
- **Highlight**: `Cyber Teal` (AI 및 데이터 중심의 혁신성)

---

## 🛠 Setup & Run
1. 사이트 접속 후 설정된 액세스 코드로 로그인합니다.
2. 관리자 모드에서 텍스트를 수정하고 상단 툴바의 **'저장'**을 누르면 클라우드 DB에 즉각 반영됩니다.
3. 상세한 배포 가이드는 `walkthrough.md`를 참고하십시오.
