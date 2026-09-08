import React from 'react';

interface FactCheckIconProps {
  className?: string;
}

export const FactCheckIcon: React.FC<FactCheckIconProps> = ({ className = 'w-5 h-5' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="FactCheck F Icon"
    >
      {/* Bold, modern geometric 'F' for FactCheck */}
      <path d="M5 3.5h14a1 1 0 0 1 1 1v2.5a1 1 0 0 1-1 1H9.5v3h7.5a1 1 0 0 1 1 1v2.5a1 1 0 0 1-1 1H9.5V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" />
    </svg>
  );
};
