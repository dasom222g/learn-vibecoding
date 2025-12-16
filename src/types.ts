export type AnalysisStatus = "idle" | "loading" | "success" | "error";

export interface VideoItem {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  views: number;
  likes: number;
  publishedAt: string;
}

export interface KeywordAnalysis {
  volumeScore: number;
  competitionScore: number;
  relatedKeywords: string[];
  videos: VideoItem[];
}

