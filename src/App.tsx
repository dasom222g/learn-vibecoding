import React, { useEffect, useMemo, useState } from "react";
import DetailsTable from "./components/DetailsTable";
import EmptyState from "./components/EmptyState";
import InputPanel from "./components/InputPanel";
import StatusBanner from "./components/StatusBanner";
import SummaryCards from "./components/SummaryCards";
import { useKeywordAnalysis } from "./hooks/useKeywordAnalysis";
import { volumeLabel } from "./utils/format";

const App: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const saved = window.localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")
      .matches;
    return prefersDark ? "dark" : "light";
  });

  const [apiKey, setApiKey] = useState("");
  const [keyword, setKeyword] = useState("");
  const [notice, setNotice] = useState<string>();

  const { data, status, error, analyze } = useKeywordAnalysis({
    useMockOnError: true
  });

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  const handleAnalyze = () => {
    if (!apiKey.trim()) {
      setNotice("API Key를 입력하면 실제 데이터로 분석합니다.");
    } else {
      setNotice(undefined);
    }

    analyze(apiKey.trim(), keyword.trim());
  };

  const isLoading = status === "loading";
  const showEmpty =
    status === "success" && (!data || data.videos.length === 0);

  const headerLabel = useMemo(() => {
    if (data) {
      return `${volumeLabel(data.volumeScore)} · 경쟁 ${data.competitionScore}%`;
    }
    return "키워드 인사이트를 한눈에 확인하세요.";
  }, [data]);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">YouTube Keyword Analyzer</p>
          <h1>키워드 분석 대시보드</h1>
          <p className="muted">{headerLabel}</p>
        </div>

        <button
          type="button"
          className={`theme-toggle ${theme === "dark" ? "on" : "off"}`}
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
        >
          <span className="theme-toggle-label">
            {theme === "dark" ? "ON" : "OFF"}
          </span>
          <span className="theme-toggle-knob" />
        </button>
      </header>

      <main className="content">
        <div className="layout">
          <aside className="sidebar">
            <InputPanel
              apiKey={apiKey}
              keyword={keyword}
              isLoading={isLoading}
              onApiKeyChange={setApiKey}
              onKeywordChange={setKeyword}
              onSubmit={handleAnalyze}
            />
          </aside>

          <section className="main-area">
            {notice && <StatusBanner tone="warning" message={notice} />}
            {error && status !== "success" && (
              <StatusBanner tone="error" message={error} />
            )}
            {status === "loading" && (
              <StatusBanner
                tone="info"
                message="분석 중입니다. 잠시만 기다려주세요."
              />
            )}

            {data && status === "success" && (
              <>
                <SummaryCards
                  volumeScore={data.volumeScore}
                  competitionScore={data.competitionScore}
                  relatedKeywords={data.relatedKeywords}
                />
                <DetailsTable videos={data.videos} />
              </>
            )}

            {showEmpty && (
              <EmptyState message="결과가 없습니다. 키워드를 다시 입력하세요." />
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;

