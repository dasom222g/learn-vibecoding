import React from "react";

type BannerTone = "info" | "warning" | "error";

interface StatusBannerProps {
  tone: BannerTone;
  message: string;
}

const toneToClass: Record<BannerTone, string> = {
  info: "banner info",
  warning: "banner warning",
  error: "banner error"
};

const StatusBanner: React.FC<StatusBannerProps> = ({ tone, message }) => {
  return <div className={toneToClass[tone]}>{message}</div>;
};

export default StatusBanner;

