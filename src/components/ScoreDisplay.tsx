
import React from 'react';

interface ScoreDisplayProps {
  score: number;
  highScore: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, highScore }) => {
  return (
    <div className="flex gap-2 md:gap-8 items-center">
      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 md:px-6 py-2 md:py-3 text-white">
        <div className="text-xs md:text-sm font-medium opacity-90">SCORE</div>
        <div className="text-lg md:text-2xl font-bold">{score}</div>
      </div>
      
      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 md:px-6 py-2 md:py-3 text-white">
        <div className="text-xs md:text-sm font-medium opacity-90">HIGH SCORE</div>
        <div className="text-lg md:text-2xl font-bold text-yellow-300">{highScore}</div>
      </div>
    </div>
  );
};
