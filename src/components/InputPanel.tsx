import React from "react";

interface InputPanelProps {
  apiKey: string;
  keyword: string;
  isLoading: boolean;
  onApiKeyChange: (value: string) => void;
  onKeywordChange: (value: string) => void;
  onSubmit: () => void;
}

const InputPanel: React.FC<InputPanelProps> = ({
  apiKey,
  keyword,
  isLoading,
  onApiKeyChange,
  onKeywordChange,
  onSubmit
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <div className="card input-panel">
      <div className="card-header">
        <h2>유튜브 키워드 분석기</h2>
        <p className="muted">API Key는 클라이언트 상태에서만 관리됩니다.</p>
      </div>
      <div className="input-grid">
        <label className="field">
          <span className="field-label">YouTube API Key</span>
          <input
            type="password"
            placeholder="API Key를 입력하세요"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            disabled={isLoading}
          />
        </label>
        <label className="field">
          <span className="field-label">키워드</span>
          <input
            type="text"
            placeholder="예: 여행 브이로그"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
        </label>
        <div className="actions">
          <button
            className="primary"
            onClick={onSubmit}
            disabled={isLoading || keyword.trim().length === 0}
          >
            {isLoading ? "분석 중..." : "분석 시작"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputPanel;

