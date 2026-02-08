# 📍 NextSpot — Discovery Engine

**NextSpot** is a modern geospatial discovery platform designed to help users explore and save interesting places nearby. Built with a focus on **performance, security, and scalable architecture**, it demonstrates a professional approach to full-stack development using the latest React and Next.js ecosystems.

## 🌟 The Vision

NextSpot is designed to solve "decision paralysis" when looking for places to go. Unlike traditional search engines that require specific queries, NextSpot acts as a **Discovery Engine**. It allows users to explore their surroundings visually and intuitively, transforming a simple map into a curated list of experiences tailored to their current needs—whether it's a quiet cafe to work in or a top-rated restaurant for a night out.

### Key User Features:
- **Intuitive Exploration:** A dynamic map interface that reacts instantly to filters, providing immediate visual feedback.
- **"Surprise Me" Engine:** A feature for the indecisive, selecting a highly-rated nearby spot with a single click.
- **Personalized Memory:** Users can build a personal atlas by saving favorites and tracking their discovery history.

## 🚀 Technical Highlights

### 🏗️ Architecture & Design Patterns
- **Feature-Sliced Design (FSD):** Organized by business domains (`features/discovery`) rather than just technical roles. This desacouples logic, making the codebase highly scalable and easier to navigate for large teams.
- **Server Actions Architecture:** All data mutations and database interactions are handled via Next.js Server Actions, providing a unified Type-Safe bridge between the client and the PostgreSQL database.
- **URL-as-State:** Leverages URL search parameters for filtering and navigation, ensuring that the application state is shareable, bookmarkable, and consistent across browser sessions.

### 🛡️ Security & Robustness
- **Authentication (NextAuth.js v5):** Implements secure session management using JWT and OAuth 2.0 (Google).
- **Schema Validation (Zod):** Strict end-to-end validation for all user inputs and API payloads, preventing injection attacks and ensuring data integrity.
- **Rate Limiting:** Custom implementation to protect sensitive Server Actions from abuse and brute-force attempts.
- **Database Safety:** Uses Prisma ORM with parameterized queries to inherently prevent SQL injection.

### ⚡ Performance Optimization
- **React 19 Server Components (RSC):** Minimizes client-side JavaScript by rendering the majority of the UI on the server.
- **Optimistic UI:** Uses `useOptimistic` for instant user feedback on actions like "favoriting" a place, providing a "zero-latency" feel.
- **Tailwind CSS 4:** Utilizes the latest high-performance styling engine for a lean and maintainable CSS bundle.

## 🛠️ Tech Stack

| Category | Technology |
|-----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Frontend** | React 19, Tailwind CSS 4, Lucide React |
| **Database** | PostgreSQL + Prisma ORM |
| **Auth** | NextAuth.js v5 (Beta) |
| **Maps API** | Google Maps Platform (@vis.gl/react-google-maps) |
| **Validation** | Zod |

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 20+
- pnpm (recommended)
- PostgreSQL Instance
- Google Maps API Key (Places & Maps JS API enabled)

### Setup Steps
1. **Clone & Install:**
   ```bash
   git clone https://github.com/your-username/nextspot.git
   cd nextspot
   pnpm install
   ```

2. **Environment Variables:**
   Create a `.env` file based on the required variables (Database URL, Auth Secrets, Google Maps Key).

3. **Database Initialization:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run Development:**
   ```bash
   pnpm dev
   ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
