import React from "react";
import { VideoItem } from "../types";
import { formatDate, formatNumber } from "../utils/format";

interface DetailsTableProps {
  videos: VideoItem[];
}

const DetailsTable: React.FC<DetailsTableProps> = ({ videos }) => {
  if (videos.length === 0) {
    return (
      <div className="card">
        <p className="muted">상위 노출 영상을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3>상위 노출 영상</h3>
        <p className="muted">썸네일, 조회수, 좋아요, 업로드 날짜</p>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>썸네일</th>
              <th>제목</th>
              <th>채널</th>
              <th>조회수</th>
              <th>좋아요</th>
              <th>업로드</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video.id}>
                <td>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="thumbnail"
                    loading="lazy"
                  />
                </td>
                <td className="title-cell">{video.title}</td>
                <td>{video.channel}</td>
                <td>{formatNumber(video.views)}</td>
                <td>{formatNumber(video.likes)}</td>
                <td>{formatDate(video.publishedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailsTable;

