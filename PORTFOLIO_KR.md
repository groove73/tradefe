# 📈 증권 정보 플랫폼 (Securities Information Platform)

## 📖 프로젝트 개요
이 프로젝트는 **주식, 채권, 파생상품, 일반상품(석유/금/배출권)** 등 다양한 증권 시장의 수치 데이터를 통합 관리하고 시각화하는 웹 플랫폼입니다.  
사용자는 일별 시세 정보를 **직관적인 차트**와 **상세 테이블**을 통해 조회할 수 있으며, **KRX(한국거래소)** 및 **금융위원회** Open API와 연동되어 신뢰성 있는 데이터를 제공합니다.

---

## 🛠 기술 스택 (Tech Stack)

### Frontend (`tradefe`)
- **Framework**: [Next.js 16.1](https://nextjs.org/) (App Router) - 최신 React 기능을 활용한 고성능 웹 애플리케이션
- **Language**: TypeScript - 타입 안정성 확보
- **UI Library**: 
  - **Tailwind CSS v4** - 유틸리티 퍼스트 스타일링
  - **Shadcn/UI** (Radix UI 기반) - 접근성과 커스터마이징이 용이한 컴포넌트
- **State Management**: `nuqs` - URL Search Params를 활용한 상태 관리 (공유 가능한 URL)
- **Visualization**: `Recharts` - 데이터 시각화를 위한 반응형 차트 라이브러리
- **Date Handling**: `date-fns`, `react-day-picker`

### Backend (`tradebe`)
- **Framework**: [Spring Boot 3.2](https://spring.io/projects/spring-boot)
- **Language**: Java 21 - 최신 Java LTS 버전 사용
- **Build Tool**: Gradle
- **Database**: H2 (In-memory/Dev), JPA (ORM)
- **Architecture**: **Hexagonal Architecture (Ports and Adapters)**
  - 비즈니스 로직(Domain)을 외부 의존성(Web, Persistence, External API)으로부터 격리하여 유지보수성 및 테스트 용이성 확보
  - `adapter`: 외부 시스템과의 통신 (Controller, Repository, External API Client)
  - `application`: 유스케이스 및 포트 정의
  - `domain`: 핵심 비즈니스 로직 및 엔티티

---

## ✨ 주요 기능 (Key Features)

### 1. 다양한 시장 데이터 통합 조회
- **주식 (Stocks)**: KOSPI, KOSDAQ, KONEX, ETF, ETN 등의 일별 시세 및 매매 정보.
- **채권 (Bonds)**: 국채, 일반채권, 소액채권 시장의 일별 매매 정보.
- **파생상품 (Derivatives)**: 선물(Futures) 및 옵션(Options) 시장 데이터.
- **일반상품 (Commodities)**: 석유, 금, 탄소배출권 시장 데이터.

### 2. 데이터 시각화 (Dashboard & Visualization)
- 각 시장 데이터에 최적화된 **인포그래픽 및 차트** 제공.
- 시계열 데이터를 한눈에 파악할 수 있는 직관적인 그래프 UI.

### 3. 사용자 편의성
- **날짜 선택 (Date Picker)**: 과거 데이터를 손쉽게 조회할 수 있는 캘린더 인터페이스.
- **페이징 (Pagination)**: 대용량 데이터를 효율적으로 탐색할 수 있는 네비게이션.
- **URL 상태 동기화**: 조회 조건(날짜, 페이지 등)이 URL에 반영되어 즐겨찾기 및 공유 용이.

---

## 📂 아키텍처 구조 (Architecture Structure)

### Backend (Hexagonal)
```
com.trade.securities
├── domain          # 핵심 비즈니스 로직 (Core Business Logic)
├── application     # 애플리케이션 서비스 및 포트 (Use Cases & Ports)
│   ├── port.in     # (Input Port)
│   └── port.out    # (Output Port)
├── adapter         # 외부와 상호작용 (Adapters)
│   ├── in.web      # (Web Controller)
│   ├── out.persistence # (Database Adapter)
│   └── out.external    # (External API Adapter - KRX, FSC)
└── infrastructure  # 설정 및 공통 유틸리티 (Configuration)
```

### Frontend (Next.js App Router)
```
src
├── app             # 페이지 및 라우팅 (Pages & Routing)
│   ├── stocks      # 주식 관련 페이지
│   ├── bonds       # 채권 관련 페이지
│   └── ...
├── components      # 재사용 가능한 UI 컴포넌트
│   ├── ui          # Shadcn UI 기본 컴포넌트
│   └── ...         # 비즈니스 컴포넌트
├── lib             # 유틸리티 함수 및 설정
└── hooks           # 커스텀 훅
```

---

## 🚀 배포 (Deployment)
- **Frontend**: Vercel (Next.js 최적화 배포)
- **Backend**: Railway / Render (Docker 컨테이너 기반 배포 권장)
