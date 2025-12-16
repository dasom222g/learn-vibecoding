import { useCallback, useState } from "react";
import { analyzeKeyword, createMockAnalysis } from "../services/youtubeApi";
import { AnalysisStatus, KeywordAnalysis } from "../types";

interface UseKeywordAnalysisOptions {
  useMockOnError?: boolean;
}

interface UseKeywordAnalysisResult {
  data?: KeywordAnalysis;
  status: AnalysisStatus;
  error?: string;
  analyze: (apiKey: string, keyword: string) => Promise<void>;
}

export function useKeywordAnalysis(
  options: UseKeywordAnalysisOptions = {}
): UseKeywordAnalysisResult {
  const [data, setData] = useState<KeywordAnalysis>();
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [error, setError] = useState<string>();

  const analyze = useCallback(
    async (apiKey: string, keyword: string) => {
      setStatus("loading");
      setError(undefined);
      try {
        const result = await analyzeKeyword(apiKey, keyword);
        setData(result);
        setStatus("success");
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "알 수 없는 오류가 발생했습니다.";
        setError(message);

        if (options.useMockOnError) {
          const mock = createMockAnalysis(keyword);
          setData(mock);
          setStatus("success");
          return;
        }

        setStatus("error");
      }
    },
    [options.useMockOnError]
  );

  return { data, status, error, analyze };
}

