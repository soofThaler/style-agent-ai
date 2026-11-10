# 👔 StyleAgent AI — Multi-Agent Fashion Intelligence & Wardrobe Platform

A production-ready Full Stack AI platform that bridges **Native Multimodal Computer Vision**, **Autonomous Web Search Grounding**, and **Parallel Multi-Agent Orchestration** to evaluate outfits, curate personal wardrobe items, and synthesize contextual styling recommendations.

Built with **React 19**, **TypeScript**, **Node.js (Express)**, **Anthropic Claude 3.5 Models**, and **MySQL 8.0**.

---

## 🌟 Key Capabilities

1. **Native Computer Vision Outfit Detection (Zero Manual Input)**
   * Users simply upload an outfit photo (mirror selfie, flat-lay garments on bed/floor).
   * Powered by Claude 3.5 Multimodal Vision to extract garments, silhouette cuts, materials, and dominant colorways automatically.

2. **Automated Brand & Product Cataloging Pipeline**
   * **Brand & Visual Sleuth Agent:** Inspects images for brand logos, team emblems, and pop-culture collaborations (e.g. Jordan, Nike, Adidas, SpongeBob).
   * **Web Cataloging Agent (Tool-Use):** Uses autonomous real-time web search to identify exact commercial model names (e.g., *"Jordan Flight MVP Graphic Tee"*, *"Adidas Originals x SpongeBob Patrick Superstar Shoes"*) and persists them directly into MySQL.

3. **Parallel Multi-Agent Styling Evaluation**
   * Employs an **Orchestrator-Workers Architecture** running concurrently via `Promise.allSettled`:
     * 📐 **Silhouette & Proportion Specialist:** Evaluates drape, volume ratios, and top-to-bottom balance with fashion rule-break enforcement.
     * 🎨 **Color Harmony Specialist:** Analyzes contrast ratios, color wheel theory, and palette cohesion.
     * 🍸 **Occasion & Context Specialist:** Grounded via live **Weather API Tooling** to calibrate dress codes against real-time local temperatures.

4. **"Style Me" Autonomous Wardrobe Curation**
   * Scans the user's digitized MySQL wardrobe inventory and autonomously synthesizes the optimal outfit pairing for any requested event, setting, and city.

5. **Curated Digital Closet (My Wardrobe)**
   * Persistent database layer tracking all extracted items with Category tags (`Top`, `Bottom`, `Shoes`), detailed metadata, filtering, and live deletion.

---

## 🏗️ Multi-Agent Architecture

[ User Outfit Photo / Mirror Selfie ]
                 │
                 ▼
     ┌───────────────────────┐
     │ Vision Extractor Agent│  --> Base garment segmentation & palette
     └───────────┬───────────┘
                 │
                 ▼
     ┌───────────────────────┐
     │ Brand Detector Agent  │  --> Scans logos, collabs & emblems
     └───────────┬───────────┘
                 │
                 ▼
     ┌───────────────────────┐
     │ Product Catalog Agent │ <--> [ Web Search Tool ]
     └───────────┬───────────┘
                 │
                 ▼ (Persisted as Official Commercial Items)
      [( MySQL 8.0 Wardrobe DB )]
                 │
                 ▼
   ┌────────────────────────────────────────────────────────┐
   │         MASTER ORCHESTRATOR (Promise.allSettled)       │
   └──────┬────────────────────┬─────────────────────┬──────┘
          │                    │                     │
          ▼                    ▼                     ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────────┐
│ Silhouette Agent │ │Color Harmony Ag. │ │Occasion Match Agent  │
│(Drape & Proport.)│ │(Tonal Harmony)   │ │  <-> [Weather Tool]  │
└──────────────────┘ └──────────────────┘ └──────────────────────┘
          │                    │                     │
          └────────────────────┼─────────────────────┘
                               │
                               ▼
        [ Composite Score (0-100) + Actionable Tips ]

---

## 🛠️ Tech Stack & Engineering Highlights

- **Frontend:** React 19, TypeScript, Vite, CSS Grid/Flexbox, Notyf Toast notifications, Dark Luxury Streetwear aesthetic.
- **Backend:** Node.js, Express, TypeScript, Layered Architecture (`Controller` -> `Service` -> `DAL`).
- **AI & LLM Engineering:** Anthropic Claude SDK (`claude-sonnet-5-5`, `claude-haiku-5-5`), Structured JSON output parsing via strict regex boundaries, System Prompt engineering.
- **Database:** MySQL 8.0, Connection Pooling via `mysql2`, Parameterized Queries, Joi Schema Validation.
- **External Tooling:** Live Weather API (Open-Meteo), Web Search Engine integration.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MySQL 8.0
- Anthropic API Key

### Backend Setup
1. Navigate to `Backend/` and install dependencies:
   cd Backend
   npm install

2. Configure `.env` file in `Backend/`:
   PORT=4000
   ENVIRONMENT=development
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password
   MYSQL_DATABASE=style_agent_db
   ANTHROPIC_API_KEY=your_anthropic_api_key

3. Initialize the database table in MySQL:
   CREATE DATABASE IF NOT EXISTS style_agent_db;
   USE style_agent_db;
   CREATE TABLE IF NOT EXISTS garments (
       id INT AUTO_INCREMENT PRIMARY KEY,
       category ENUM('top', 'bottom', 'shoes') NOT NULL,
       name VARCHAR(255) NOT NULL,
       color VARCHAR(255) NOT NULL,
       fit VARCHAR(150) NOT NULL
   );

4. Start the backend server:
   npm start

### Frontend Setup
1. Navigate to `Frontend/` and install dependencies:
   cd ../Frontend
   npm install

2. Start the development server:
   npm run dev

3. Open your browser at http://localhost:5173


