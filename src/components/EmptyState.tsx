import React from "react";

interface EmptyStateProps {
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return <div className="card empty-state">{message}</div>;
};

export default EmptyState;

