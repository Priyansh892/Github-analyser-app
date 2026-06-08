import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!username.trim()) {
      setError("Enter a GitHub username");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`https://api.github.com/users/${username}`);
      if (!res.ok) {
        setError("GitHub user not found");
        setLoading(false);
        return;
      }
      navigate(`/dashboard/${username}`);
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-[#0a0a0a] min-h-screen text-white overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      {/* Orbs */}
      <div
        className="fixed rounded-full pointer-events-none z-0 opacity-15"
        style={{
          width: 500,
          height: 500,
          background: "#238636",
          filter: "blur(80px)",
          top: -100,
          left: -150,
        }}
      />
      <div
        className="fixed rounded-full pointer-events-none z-0"
        style={{
          width: 400,
          height: 400,
          background: "#1f6feb",
          opacity: 0.12,
          filter: "blur(80px)",
          bottom: -100,
          right: -100,
        }}
      />

      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-5 border-b border-white/[0.07]"
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(20px)" }}
      >
        <div
          className="flex items-center gap-2 font-extrabold text-xl"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          <span className="w-2 h-2 rounded-full bg-[#238636] inline-block" />
          Gitlytics
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="text-white/40 text-sm no-underline hover:text-white transition-colors"
        >
          GitHub →
        </a>
      </nav>

      {/* Hero */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-8 pt-32 pb-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 border rounded-full px-4 py-1.5 text-xs uppercase tracking-widest mb-8 text-[#238636] border-[#238636]/30 bg-[#238636]/10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#238636] inline-block" />
          AI-Powered Developer Intelligence
        </div>

        {/* Heading */}
        <h1
          className="font-extrabold leading-none mb-6"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(3rem, 8vw, 6rem)",
            letterSpacing: "-3px",
          }}
        >
          Your code.
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #238636, #1f6feb)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Your identity.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-white/45 text-lg max-w-lg leading-relaxed mb-10 font-light">
          Enter any GitHub username and get an AI-powered developer personality
          report, language breakdown, and a witty roast of your repos.
        </p>

        {/* Input */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          <div className="flex items-center rounded-full pl-5 pr-1 py-1 gap-2 border border-white/15 bg-white/5">
            <span className="text-white/30 text-base">github.com/</span>
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              className="bg-transparent border-none outline-none text-white text-base w-40"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-[#238636] text-white px-6 py-2.5 rounded-full font-semibold text-base cursor-pointer whitespace-nowrap hover:bg-[#2ea043] transition-colors disabled:opacity-60"
            >
              {loading ? "Checking..." : "Analyze →"}
            </button>
          </div>
        </div>

        {error && <p className="text-[#f85149] text-sm mb-4">{error}</p>}

        <p className="text-white/20 text-base">
          Try: gvanrossum, mojombo, yyx990803, dhh
        </p>

        {/* Stats */}
        <div className="flex gap-12 pt-10 mt-12 border-t border-white/[0.07]">
          {[
            { num: "AI", label: "Personality report" },
            { num: "🔥", label: "Roast your repos" },
            { num: "∞", label: "Any public profile" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="text-3xl font-bold"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {s.num}
              </div>
              <div className="text-xs text-white/30 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-[1100px] mx-auto px-8 pb-24">
        <p className="text-[#238636] text-xs uppercase tracking-widest mb-3">
          What Gitlytics does
        </p>
        <h2
          className="font-bold tracking-tight mb-12 max-w-[460px] leading-tight"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            letterSpacing: "-1px",
          }}
        >
          Four ways to understand your dev identity
        </h2>

        <div
          className="grid gap-px bg-white/[0.06] border border-white/[0.06] rounded-2xl overflow-hidden"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          }}
        >
          {features.map((f) => (
            <div
              key={f.name}
              className="bg-[#111] p-8 hover:bg-[#1a1a1a] transition-colors"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <div
                className="font-bold text-base mb-2"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {f.name}
              </div>
              <div className="text-white/40 text-sm leading-relaxed font-light">
                {f.desc}
              </div>
              <span
                className={`inline-block mt-4 text-[0.72rem] px-2.5 py-0.5 rounded-full border ${f.green ? "bg-[#238636]/10 border-[#238636]/25 text-[#238636]" : "bg-[#1f6feb]/10 border-[#1f6feb]/25 text-[#1f6feb]"}`}
              >
                {f.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="relative z-10 max-w-[900px] mx-auto mb-24 px-12 py-16 bg-[#111] border border-white/[0.06] rounded-3xl text-center">
        <h2
          className="font-extrabold tracking-tight mb-4"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            letterSpacing: "-1px",
          }}
        >
          What kind of developer are you?
        </h2>
        <p className="text-white/40 font-light">
          Enter your GitHub username above and find out in seconds.
        </p>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-white/20 text-base border-t border-white/[0.05]">
        Built by Priyansh Agarwal · Powered by GitHub API & Groq AI · ©{" "}
        {new Date().getFullYear()} Gitlytics
      </footer>
    </div>
  );
}

const features = [
  {
    icon: "🧬",
    name: "Dev DNA Report",
    desc: "AI reads your repos, languages, and stars to write a personality report that actually gets you.",
    tag: "AI Report",
    green: true,
  },
  {
    icon: "🗺️",
    name: "Language Map",
    desc: "Visual breakdown of every language across all your repos. See what you really code in.",
    tag: "Visualization",
    green: false,
  },
  {
    icon: "😂",
    name: "Roast My GitHub",
    desc: "AI brutally roasts your repos, commit history, and README quality. Painfully accurate.",
    tag: "Fan Favourite",
    green: true,
  },
  {
    icon: "💬",
    name: "Dev Chat",
    desc: 'Ask anything about any GitHub profile. "Is this person a good hire?" Groq answers with data.',
    tag: "AI Chat",
    green: false,
  },
];
