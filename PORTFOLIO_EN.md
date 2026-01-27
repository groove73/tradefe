# 📈 Securities Information Platform

## 📖 Project Overview
This project is a comprehensive web platform designed to manage and visualize daily market data across various securities markets, including **Stocks, Bonds, Derivatives, and Commodities (Oil/Gold/Carbon Credits)**.  
Users can track historical price trends through **interactive charts** and **detailed data tables**. The system ensures reliable data provision by integrating with Open APIs from **KRX (Korea Exchange)** and the **FSC (Financial Services Commission)**.

---

## 🛠 Tech Stack

### Frontend (`tradefe`)
- **Framework**: [Next.js 16.1](https://nextjs.org/) (App Router) - Leveraging the latest React features for a high-performance web application.
- **Language**: TypeScript - Ensuring type safety and code quality.
- **UI Library**: 
  - **Tailwind CSS v4** - Utility-first CSS for rapid and flexible styling.
  - **Shadcn/UI** (Built on Radix UI) - Accessible and customizable component primitives.
- **State Management**: `nuqs` - URL Search Params based state management for shareable and bookmarkable views.
- **Visualization**: `Recharts` - Responsive and composable charting library for data visualization.
- **Date Handling**: `date-fns`, `react-day-picker`.

### Backend (`tradebe`)
- **Framework**: [Spring Boot 3.2](https://spring.io/projects/spring-boot)
- **Language**: Java 21 - Utilizing the latest LTS version of Java.
- **Build Tool**: Gradle.
- **Database**: H2 (In-memory/Dev), JPA (ORM) for efficient data persistence.
- **Architecture**: **Hexagonal Architecture (Ports and Adapters)**
  - Decouples core business logic (Domain) from external dependencies (Web, Persistence, External APIs) to enhance maintainability and testability.
  - `adapter`: Handles communication with external systems (Controllers, Repositories, External API Clients).
  - `application`: Defines use cases and ports.
  - `domain`: Encapsulates core business rules and entities.

---

## ✨ Key Features

### 1. Integrated Multi-Market Data Access
- **Stocks**: Daily price and trading info for KOSPI, KOSDAQ, KONEX, ETFs, ETNs, etc.
- **Bonds**: Daily trading data for Government Bonds, General Bonds, and Small-Mid Cap Bonds.
- **Derivatives**: Market data for Futures and Options.
- **Commodities**: Trading data for Oil, Gold, and Carbon Emission Rights.

### 2. Advanced Data Visualization
- **Infographics & Charts**: Optimized visualizations tailored for each market type.
- **Time-Series Analysis**: Intuitive graphs to visualize historical trends at a glance.

### 3. User Experience (UX)
- **Date Selection**: Calendar interface for easy navigation through historical data.
- **Pagination**: Efficient data browsing for large datasets.
- **URL State Synchronization**: Search conditions (date, page number) are reflected in the URL, strictly following web standards for shareability.

---

## 📂 Architecture Structure

### Backend (Hexagonal)
```
com.trade.securities
├── domain          # Core Business Logic & Entities
├── application     # Use Cases & Ports
│   ├── port.in     # (Input Ports / Use Cases)
│   └── port.out    # (Output Ports)
├── adapter         # External Interactions
│   ├── in.web      # (Web Controllers)
│   ├── out.persistence # (Database Adapters)
│   └── out.external    # (External API Clients - KRX, FSC)
└── infrastructure  # Configuration & Shared Utilities
```

### Frontend (Next.js App Router)
```
src
├── app             # Pages & Routing (App Router Structure)
│   ├── stocks      # Stock Market Pages
│   ├── bonds       # Bond Market Pages
│   └── ...
├── components      # Reusable UI Components
│   ├── ui          # Shadcn UI Base Components
│   └── ...         # Feature-Specific Components
├── lib             # Utilities & Configuration
└── hooks           # Custom Hooks
```

---

## 🚀 Deployment
- **Frontend**: Vercel (Optimized for Next.js)
- **Backend**: Railway / Render (Docker container-based deployment recommended)
