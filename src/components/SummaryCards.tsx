import React from "react";
import { volumeLabel } from "../utils/format";

interface SummaryCardsProps {
  volumeScore: number;
  competitionScore: number;
  relatedKeywords: string[];
}

const GaugeBar: React.FC<{ score: number }> = ({ score }) => (
  <div className="gauge">
    <div className="gauge-fill" style={{ width: `${score}%` }} />
    <span className="gauge-label">{score}%</span>
  </div>
);

const SummaryCards: React.FC<SummaryCardsProps> = ({
  volumeScore,
  competitionScore,
  relatedKeywords
}) => {
  return (
    <div className="card-grid">
      <div className="card metric-card">
        <div className="card-header">
          <h3>검색량 수준</h3>
          <p className="muted">조회 수 기반 추정</p>
        </div>
        <div className="metric-value">{volumeLabel(volumeScore)}</div>
        <p className="muted small">점수 {volumeScore} / 100</p>
      </div>

      <div className="card metric-card">
        <div className="card-header">
          <h3>경쟁 강도</h3>
          <p className="muted">참여율과 영상 수 기반</p>
        </div>
        <GaugeBar score={competitionScore} />
        <p className="muted small">점수 {competitionScore} / 100</p>
      </div>

      <div className="card metric-card">
        <div className="card-header">
          <h3>추천 연관 키워드 Top 5</h3>
          <p className="muted">제목 빈도로 추출</p>
        </div>
        <ul className="pill-list">
          {relatedKeywords.length === 0 && (
            <li className="muted">관련 키워드가 없습니다.</li>
          )}
          {relatedKeywords.map((keyword) => (
            <li key={keyword} className="pill">
              {keyword}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SummaryCards;

