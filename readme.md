# 🔍 PureSearch --- Privacy-Focused Meta Search Engine

![Status](https://img.shields.io/badge/status-active-success)
![Deploy](https://img.shields.io/badge/deploy-AWS%20%7C%20Vercel-blue)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![License](https://img.shields.io/badge/license-MIT-green)

> 🚀 A modern, privacy-first meta search engine with custom ranking,
> filtering, and scalable architecture.

------------------------------------------------------------------------

# 📸 Demo Preview

*(Add screenshots here)*

![Home](./screenshots/home_light.jpeg)
![Results](./screenshots/results_light.jpeg)
![Suggestions](./screenshots/suggestions_light.jpeg)

------------------------------------------------------------------------

# 🧠 Architecture Diagram

    User
     ↓
    Frontend (React + Vercel)
     ↓
    Backend API (Node.js on AWS EC2)
     ↓
    SearXNG (Docker - Internal Only)

------------------------------------------------------------------------

# ✨ Features

-   🔎 Multi-engine search (Google, Bing)
-   🧠 Custom ranking algorithm (stable + priority-based)
-   🚫 Keyword & regex filtering
-   🔐 Privacy-first proxy (no direct exposure)
-   ⚡ Autocomplete suggestions
-   🎨 Glassmorphism UI

------------------------------------------------------------------------

# 🧱 Tech Stack

Frontend: - React (Vite) - Tailwind CSS

Backend: - Node.js - Express.js

Search: - SearXNG (Docker)

DevOps: - Docker Compose - AWS EC2 - Vercel

------------------------------------------------------------------------

# 📁 Project Structure

    .
    ├── frontend/
    ├── backend/
    ├── searxng/
    │   └── settings.yml
    └── docker-compose.yml

------------------------------------------------------------------------

# ⚙️ Environment Variables

Frontend:

    VITE_API_BASE_URL=http://localhost:3000

Backend:

    SEARXNG_URL=http://searxng:8080

------------------------------------------------------------------------

# 🛠️ Setup Guide

## 1. Clone Repo

    git clone https://github.com/your-username/puresearch.git
    cd puresearch

## 2. Start Backend + SearXNG

    docker-compose up -d --build

## 3. Start Frontend

    cd frontend
    npm install
    npm run dev

------------------------------------------------------------------------

# ☁️ Deployment

Backend: - AWS EC2 (Docker) - Port 3000 exposed

Frontend: - Vercel

------------------------------------------------------------------------

# 🔒 Security

-   Internal-only SearXNG
-   Backend proxy protection
-   Secrets ignored via .gitignore

------------------------------------------------------------------------

# 📊 Core Algorithm

``` js
if (scoreA !== scoreB) return scoreA - scoreB;
return a.originalIndex - b.originalIndex;
```

------------------------------------------------------------------------

# 🎯 Use Cases

-   Privacy-focused search engine
-   Safe browsing tool
-   Research aggregator
-   Full-stack portfolio project

------------------------------------------------------------------------

# 🚀 Future Improvements

-   Redis caching
-   AI ranking (LLM)
-   User personalization
-   Analytics dashboard
-   Mobile optimization

------------------------------------------------------------------------

# 🤝 Contribution

PRs are welcome!

------------------------------------------------------------------------

# 👨‍💻 Author

Ubaid Patel\
Full Stack Developer

------------------------------------------------------------------------

# ⭐ Project Value

This project demonstrates: - System design - Backend engineering -
Docker + cloud deployment - Real-world problem solving

------------------------------------------------------------------------