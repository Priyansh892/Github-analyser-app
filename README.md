# Gitlysis 🧬

> **Decode any developer's GitHub DNA with AI**

Gitlysis is an AI-powered developer intelligence tool that analyzes any public GitHub profile and generates a personality report, language breakdown, roast, and interactive chat — all powered by Groq AI and the GitHub API.

**[Live Demo](#)**

![Gitlysis Screenshot]

## 🖥️ Screenshots

| Landing Page | Landing Page |
|---|---|
| ![Landing 1](./src/assets/Landing%20Page%20screenshot1.jpg) | ![Landing 2](./src/assets/Landing%20Page%20screenshot2.jpg) |

| Dashboard | Dashboard |
|---|---|
| ![Dashboard 1](./src/assets/Dashboard%20Page%20screenshot3.jpg) | ![Dashboard 2](./src/assets/Dashboard%20Page%20screenshot4.jpg) |

## ✨ Features

### 🧬 Dev DNA Report
AI reads your repositories, languages, stars, and activity to generate a personalized developer personality report. Discover your Developer Archetype, coding strengths, blind spots, and overall vibe.

### 🗺️ Language Map
Visual breakdown of every programming language across your repositories — weighted by actual lines of code, not just repo count. See what you *really* code in.

### 😂 Roast My GitHub
Submit your profile for a brutally honest (but loving) AI roast. Painfully accurate, weirdly flattering, and extremely shareable.

### 💬 Dev Chat
Chat with an AI that has full context of the developer's GitHub data. Ask anything:
- *"Is this person a good hire?"*
- *"What should they learn next?"*
- *"How experienced are they?"*
- *"What are their strongest skills?"*

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS v3 + Inline Styles |
| Routing | React Router v6 |
| AI | Groq API (Llama 3.3 70B) |
| Data | GitHub REST API v3 |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [GitHub Personal Access Token](https://github.com/settings/tokens) (free)
- A [Groq API Key](https://console.groq.com) (free)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/Gitlysis.git
cd Gitlysis

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_GITHUB_TOKEN=your_github_token_here
VITE_GROQ_API_KEY=your_groq_api_key_here
```

**Getting your keys:**
- **GitHub Token** → [github.com/settings/tokens](https://github.com/settings/tokens) → Generate new token (classic) → No scopes needed
- **Groq API Key** → [console.groq.com](https://console.groq.com) → Create API Key → Free forever

### Run Locally

```bash
npm run dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173) in your browser.

---

## 📁 Project Structure

```
Gitlysis/
├── src/
│   ├── api/
│   │   ├── github.ts        # GitHub API calls (user, repos, languages)
│   │   └── groq.ts        # Groq AI calls (analyze, roast, chat)
│   ├── pages/
│   │   ├── Landing.tsx      # Home page with username input
│   │   └── Dashboard.tsx    # Analysis dashboard
│   ├── App.tsx              # Router setup
│   └── main.tsx             # Entry point
├── public/
├── .env                     # Environment variables (not committed)
├── .env.example             # Environment variables template
└── vite.config.ts
```

---

## 🔌 API Usage

### GitHub API
- `GET /users/:username` — Fetch user profile
- `GET /users/:username/repos` — Fetch all public repositories
- `GET /repos/:username/:repo/languages` — Fetch language breakdown per repo

### Groq API
Uses `llama-3.3-70b-versatile` model with custom prompts that inject real GitHub data as context for accurate, personalized responses.

---

## 🔒 Environment & Security

- API keys are stored in `.env` and never committed to Git
- `.env` is included in `.gitignore`
- GitHub API is used in read-only mode — no write permissions required
- Only public GitHub profiles are accessible

---

## 🚢 Deployment

This project is deployed on Vercel. To deploy your own:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard:
# VITE_GITHUB_TOKEN and VITE_GROQ_API_KEY
```

Or click below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/Gitlysis)

---

## 👨‍💻 Author

**Priyansh Agarwal**

- GitHub: [Priyansh892](https://github.com/Priyansh892)
- LinkedIn: [linkedin.com/in/priyansh-agarwal-sde](https://www.linkedin.com/in/priyansh-agarwal-sde/)

## 🙏 Acknowledgements

- [Groq](https://groq.com) for the blazing fast free AI API
- [GitHub REST API](https://docs.github.com/en/rest) for the developer data
- [Vite](https://vitejs.dev) for the lightning fast build tool
- [React Router](https://reactrouter.com) for client-side routing