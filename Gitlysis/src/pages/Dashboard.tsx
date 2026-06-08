import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { GitHubRepo, GitHubUser } from "../api/github";
import { getUser, getRepos, getLanguages } from "../api/github";
import {
  analyzeDeveloper,
  roastDeveloper,
  chatWithDeveloper,
} from "../api/Groq";

export default function Dashboard() {
  const { username } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [languages, setLanguages] = useState<Record<string, number>>({});
  const [analysis, setAnalysis] = useState("");
  const [roast, setRoast] = useState("");
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [roastLoading, setRoastLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "analysis" | "roast" | "chat"
  >("overview");
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    if (!username) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    Promise.all([getUser(username), getRepos(username)])
      .then(async ([userData, repoData]) => {
        if (cancelled) return;
        const originalRepos = repoData.filter((r: GitHubRepo) => !r.fork);
        const langs = await getLanguages(originalRepos);
        if (cancelled) return;
        setUser(userData);
        setRepos(originalRepos);
        setLanguages(langs);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) navigate("/");
      });

    return () => {
      cancelled = true;
    };
  }, [username, navigate]);

  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const topLanguages = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const totalBytes = topLanguages.reduce((sum, [, v]) => sum + v, 0);

  const handleAnalyze = async () => {
    if (!user) return;
    if (analysis) {
      setActiveTab("analysis");
      return;
    }
    setAiLoading(true);
    setActiveTab("analysis");
    try {
      const result = await analyzeDeveloper({
        user,
        repos,
        languages,
        totalStars,
        contributions: 0,
      });
      setAnalysis(result);
    } catch {
      setAnalysis("Failed to generate analysis. Try again.");
    }
    setAiLoading(false);
  };

  const handleRoast = async () => {
    if (!user) return;
    if (roast) {
      setActiveTab("roast");
      return;
    }
    setRoastLoading(true);
    setActiveTab("roast");
    try {
      const result = await roastDeveloper({
        user,
        repos,
        languages,
        totalStars,
      });
      setRoast(result);
    } catch {
      setRoast("Failed to generate roast. Try again.");
    }
    setRoastLoading(false);
  };

  const handleChat = async () => {
    if (!user || !chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatLoading(true);
    try {
      const reply = await chatWithDeveloper(userMsg, {
        user,
        repos,
        languages,
        totalStars,
      });
      setChatMessages((prev) => [...prev, { role: "ai", text: reply }]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "ai", text: "Failed to get response. Try again." },
      ]);
    }
    setChatLoading(false);
  };

  if (loading) return <Loader />;

  return (
    <div
      className="bg-[#0a0a0a] min-h-screen text-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Navbar */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-10 py-4 border-b border-white/[0.07]"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(20px)" }}
      >
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 font-extrabold text-xl cursor-pointer"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          <span className="w-2 h-2 rounded-full bg-[#238636] inline-block" />
          Gitlytics
        </div>
        <button
          onClick={() => navigate("/")}
          className="border border-white/15 text-white/50 px-4 py-1.5 rounded-full text-sm cursor-pointer bg-transparent hover:text-white transition-colors"
        >
          ← Analyze another
        </button>
      </nav>

      <div className="max-w-[1100px] mx-auto px-8 pb-24">
        {/* Profile Header */}
        <div className="flex items-start gap-8 py-8 border-b border-white/[0.07] flex-wrap">
          <img
            src={user?.avatar_url}
            alt={user?.login}
            className="w-24 h-24 rounded-full border-2 border-[#238636]/50"
          />
          <div className="flex-1">
            <h1
              className="font-extrabold text-3xl mb-1 tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {user?.name || user?.login}
            </h1>
            <p className="text-white/40 mb-3">@{user?.login}</p>
            {user?.bio && (
              <p className="text-white/60 max-w-lg leading-relaxed mb-4 font-light">
                {user.bio}
              </p>
            )}
            <div className="flex gap-6 flex-wrap">
              {[
                { label: "Repos", value: user?.public_repos },
                { label: "Followers", value: user?.followers },
                { label: "Following", value: user?.following },
                { label: "Total Stars", value: totalStars },
              ].map((s) => (
                <div key={s.label}>
                  <span
                    className="font-bold text-xl"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {s.value}
                  </span>
                  <span className="text-white/30 text-sm ml-1.5">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <a
            href={user?.html_url}
            target="_blank"
            rel="noreferrer"
            className="border border-white/15 text-white px-5 py-2 rounded-full text-sm no-underline whitespace-nowrap hover:border-white/30 transition-colors"
          >
            View on GitHub →
          </a>
        </div>

        {/* AI Action Buttons */}
        <div className="flex gap-3 py-8 flex-wrap">
          <button
            onClick={handleAnalyze}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm cursor-pointer border border-[#238636]/40 transition-colors"
            style={{
              background:
                activeTab === "analysis" ? "#238636" : "rgba(35,134,54,0.1)",
              color: activeTab === "analysis" ? "white" : "#238636",
            }}
          >
            🧬 {aiLoading ? "Analyzing..." : "Dev DNA Report"}
          </button>
          <button
            onClick={handleRoast}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm cursor-pointer border border-[#b91c1c]/40 transition-colors"
            style={{
              background:
                activeTab === "roast" ? "#b91c1c" : "rgba(185,28,28,0.1)",
              color: activeTab === "roast" ? "white" : "#f87171",
            }}
          >
            😂 {roastLoading ? "Roasting..." : "Roast My GitHub"}
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm cursor-pointer border border-[#1f6feb]/40 transition-colors"
            style={{
              background:
                activeTab === "chat" ? "#1f6feb" : "rgba(31,111,235,0.1)",
              color: activeTab === "chat" ? "white" : "#1f6feb",
            }}
          >
            💬 Dev Chat
          </button>
          <button
            onClick={() => setActiveTab("overview")}
            className="px-6 py-3 rounded-full text-sm cursor-pointer border border-white/10 text-white/50 hover:text-white transition-colors"
            style={{
              background:
                activeTab === "overview"
                  ? "rgba(255,255,255,0.1)"
                  : "transparent",
            }}
          >
            📊 Overview
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            }}
          >
            {/* Language Map */}
            <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6">
              <h3
                className="font-bold mb-5 text-base"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                🗺️ Language Map
              </h3>
              {topLanguages.map(([lang, bytes]) => {
                const pct = Math.round((bytes / totalBytes) * 100);
                return (
                  <div key={lang} className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{lang}</span>
                      <span className="text-sm text-white/40">{pct}%</span>
                    </div>
                    <div className="bg-white/[0.06] rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{
                          background: langColor(lang),
                          width: `${pct}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Top Repos */}
            <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6">
              <h3
                className="font-bold mb-5 text-base"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                ⭐ Top Repositories
              </h3>
              {repos
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, 5)
                .map((repo) => (
                  <a
                    key={repo.name}
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="block no-underline py-3 border-b border-white/[0.05]"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-[#1f6feb] text-sm font-medium mb-0.5">
                          {repo.name}
                        </div>
                        <div className="text-white/30 text-xs">
                          {repo.description?.slice(0, 50) || "No description"}
                        </div>
                      </div>
                      <div className="text-white/40 text-xs whitespace-nowrap ml-4">
                        ⭐ {repo.stargazers_count}
                      </div>
                    </div>
                  </a>
                ))}
            </div>

            {/* Quick Stats */}
            <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6">
              <h3
                className="font-bold mb-5 text-base"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                ⚡ Quick Stats
              </h3>
              {[
                {
                  label: "Member since",
                  value: new Date(user?.created_at || "").getFullYear(),
                },
                { label: "Original repos", value: repos.length },
                {
                  label: "Most used language",
                  value: topLanguages[0]?.[0] || "N/A",
                },
                { label: "Total stars earned", value: totalStars },
                { label: "Location", value: user?.location || "Unknown" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex justify-between py-2.5 border-b border-white/[0.05]"
                >
                  <span className="text-white/40 text-sm">{s.label}</span>
                  <span className="text-sm font-medium">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === "analysis" && (
          <div className="bg-[#111] border border-[#238636]/20 rounded-2xl p-8">
            <h3
              className="font-bold mb-6 text-xl"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              🧬 Your Dev DNA Report
            </h3>
            {aiLoading ? (
              <div className="flex items-center gap-3 text-white/40">
                <div className="w-5 h-5 border-2 border-[#238636] border-t-transparent rounded-full animate-spin" />
                Groq is analyzing your GitHub profile...
              </div>
            ) : (
              <div className="text-white/80 leading-relaxed text-base whitespace-pre-wrap">
                {analysis}
              </div>
            )}
          </div>
        )}

        {/* Roast Tab */}
        {activeTab === "roast" && (
          <div className="bg-[#111] border border-[#b91c1c]/30 rounded-2xl p-8">
            <h3
              className="font-bold mb-6 text-xl"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              😂 GitHub Roast
            </h3>
            {roastLoading ? (
              <div className="flex items-center gap-3 text-white/40">
                <div className="w-5 h-5 border-2 border-[#f87171] border-t-transparent rounded-full animate-spin" />
                Groq is cooking up your roast...
              </div>
            ) : (
              <div className="text-white/80 leading-relaxed text-base italic">
                {roast}
              </div>
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="bg-[#111] border border-[#1f6feb]/20 rounded-2xl p-8 flex flex-col gap-4">
            <h3
              className="font-bold text-xl"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              💬 Dev Chat
            </h3>
            <p className="text-white/30 text-sm">
              Ask anything about this developer's GitHub profile.
            </p>

            {/* Suggested questions */}
            {chatMessages.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {[
                  "Is this a good hire?",
                  "What should they learn next?",
                  "How experienced are they?",
                  "What are their strongest skills?",
                  "Are they active on GitHub?",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setChatInput(q)}
                    className="border border-[#1f6feb]/20 bg-[#1f6feb]/[0.08] text-white/50 px-3 py-1.5 rounded-full text-xs cursor-pointer hover:text-white transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Messages */}
            <div className="flex flex-col gap-4 max-h-96 overflow-y-auto">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[75%] px-4 py-3 text-sm leading-relaxed text-white"
                    style={{
                      background:
                        msg.role === "user"
                          ? "#1f6feb"
                          : "rgba(255,255,255,0.06)",
                      borderRadius:
                        msg.role === "user"
                          ? "16px 16px 4px 16px"
                          : "16px 16px 16px 4px",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex items-center gap-2 text-white/30 text-sm">
                  <div className="w-4 h-4 border-2 border-[#1f6feb] border-t-transparent rounded-full animate-spin" />
                  Thinking...
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-3 mt-2">
              <input
                type="text"
                placeholder="Ask anything about this developer..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChat()}
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white text-sm outline-none"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
              <button
                onClick={handleChat}
                disabled={chatLoading || !chatInput.trim()}
                className="bg-[#1f6feb] text-white px-6 py-3 rounded-full font-semibold text-sm cursor-pointer disabled:opacity-50 hover:bg-[#3b82f6] transition-colors"
              >
                Send →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function langColor(lang: string): string {
  const colors: Record<string, string> = {
    JavaScript: "#f7df1e",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    Rust: "#dea584",
    Go: "#00ADD8",
    Java: "#b07219",
    CSS: "#563d7c",
    HTML: "#e34c26",
    Ruby: "#701516",
    Swift: "#ffac45",
    Kotlin: "#A97BFF",
    "C++": "#f34b7d",
    C: "#555555",
    Shell: "#89e051",
    Vue: "#41b883",
  };
  return colors[lang] || "#238636";
}

function Loader() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[#238636] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p
          className="text-white/40"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          Loading GitHub profile...
        </p>
      </div>
    </div>
  );
}
