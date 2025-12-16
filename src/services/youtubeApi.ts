import { KeywordAnalysis, VideoItem } from "../types";

const API_BASE = "https://www.googleapis.com/youtube/v3";
const SEARCH_MAX_RESULTS = 10;

interface SearchItem {
  id: { videoId?: string };
  snippet: {
    title: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
  };
}

interface SearchResponse {
  items?: SearchItem[];
}

interface VideoItemResponse {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
  };
  statistics?: {
    viewCount?: string;
    likeCount?: string;
  };
}

interface VideosResponse {
  items?: VideoItemResponse[];
}

function pickThumbnail(item: {
  thumbnails: {
    default?: { url: string };
    medium?: { url: string };
    high?: { url: string };
  };
}): string {
  return (
    item.thumbnails.high?.url ??
    item.thumbnails.medium?.url ??
    item.thumbnails.default?.url ??
    ""
  );
}

async function fetchSearch(
  apiKey: string,
  keyword: string
): Promise<SearchItem[]> {
  const params = new URLSearchParams({
    part: "snippet",
    q: keyword,
    type: "video",
    maxResults: SEARCH_MAX_RESULTS.toString(),
    order: "viewCount",
    key: apiKey
  });

  const response = await fetch(`${API_BASE}/search?${params.toString()}`);
  if (!response.ok) {
    throw new Error("검색 결과를 가져오는 중 오류가 발생했습니다.");
  }

  const data = (await response.json()) as SearchResponse;
  return data.items ?? [];
}

async function fetchVideoDetails(
  apiKey: string,
  ids: string[]
): Promise<VideoItem[]> {
  if (ids.length === 0) {
    return [];
  }

  const params = new URLSearchParams({
    part: "snippet,statistics",
    id: ids.join(","),
    key: apiKey,
    maxResults: ids.length.toString()
  });

  const response = await fetch(`${API_BASE}/videos?${params.toString()}`);
  if (!response.ok) {
    throw new Error("영상 상세 정보를 가져오는 중 오류가 발생했습니다.");
  }

  const data = (await response.json()) as VideosResponse;
  const items = data.items ?? [];

  return items.map((item) => ({
    id: item.id,
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    thumbnail: pickThumbnail(item.snippet),
    views: Number(item.statistics?.viewCount ?? 0),
    likes: Number(item.statistics?.likeCount ?? 0),
    publishedAt: item.snippet.publishedAt
  }));
}

function deriveRelatedKeywords(results: SearchItem[]): string[] {
  const candidates = new Map<string, number>();

  results.forEach((item) => {
    const words = item.snippet.title
      .split(/\s+/)
      .map((word) => word.replace(/[^\w가-힣]/g, "").trim())
      .filter((word) => word.length >= 2);

    words.forEach((word) => {
      const count = candidates.get(word) ?? 0;
      candidates.set(word, count + 1);
    });
  });

  return Array.from(candidates.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word)
    .filter(Boolean)
    .slice(0, 5);
}

function computeVolumeScore(videos: VideoItem[]): number {
  const totalViews = videos.reduce((sum, video) => sum + video.views, 0);
  if (videos.length === 0) return 0;
  const averageViews = totalViews / videos.length;
  const score = Math.min(100, Math.log10(averageViews + 1) * 20 + videos.length);
  return Math.round(score);
}

function computeCompetitionScore(videos: VideoItem[]): number {
  if (videos.length === 0) return 0;
  const likeSum = videos.reduce((sum, video) => sum + video.likes, 0);
  const viewSum = videos.reduce((sum, video) => sum + video.views, 0);
  const engagement = viewSum > 0 ? (likeSum / viewSum) * 100 : 0;
  const score = Math.min(100, Math.round(engagement * 2 + videos.length * 3));
  return score;
}

export async function analyzeKeyword(
  apiKey: string,
  keyword: string
): Promise<KeywordAnalysis> {
  if (!apiKey) {
    throw new Error("API Key를 입력해주세요.");
  }
  if (!keyword) {
    throw new Error("분석할 키워드를 입력해주세요.");
  }

  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/c8f65d8b-dfa0-43d1-a888-73c384d2cd8d", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H3",
      location: "youtubeApi.ts:analyzeKeyword:entry",
      message: "Start analyzeKeyword",
      data: {
        hasKey: Boolean(apiKey),
        keywordLength: keyword.length
      },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion

  const searchResults = await fetchSearch(apiKey, keyword);
  const videoIds = searchResults
    .map((item) => item.id.videoId)
    .filter((id): id is string => Boolean(id));

  const videos = await fetchVideoDetails(apiKey, videoIds);
  const volumeScore = computeVolumeScore(videos);
  const competitionScore = computeCompetitionScore(videos);
  const relatedKeywords = deriveRelatedKeywords(searchResults);

  return {
    volumeScore,
    competitionScore,
    relatedKeywords,
    videos
  };
}

export function createMockAnalysis(keyword: string): KeywordAnalysis {
  const baseWords = [keyword, `${keyword} 공략`, `${keyword} 튜토리얼`, `${keyword} 리뷰`];
  const videos: VideoItem[] = Array.from({ length: 6 }).map((_, index) => ({
    id: `mock-${index + 1}`,
    title: `${keyword} 영상 ${index + 1}`,
    channel: `채널 ${index + 1}`,
    thumbnail: `https://placehold.co/320x180?text=${encodeURIComponent(
      keyword
    )}+${index + 1}`,
    views: 5000 * (index + 1),
    likes: 400 * (index + 1),
    publishedAt: new Date(Date.now() - index * 86400000 * 5).toISOString()
  }));

  return {
    volumeScore: 65,
    competitionScore: 45,
    relatedKeywords: baseWords,
    videos
  };
}

