
import React from 'react';
import { Button } from '@/components/ui/button';

interface GameOverModalProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ 
  score, 
  highScore, 
  onRestart 
}) => {
  const isNewHighScore = score === highScore && score > 0;

  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-4 md:p-8 shadow-2xl text-center max-w-xs md:max-w-sm mx-4 transform scale-95 animate-scale-in w-full">
        <div className="mb-4 md:mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Game Over!</h2>
          {isNewHighScore && (
            <div className="text-yellow-500 font-bold text-base md:text-lg mb-2 animate-pulse">
              🎉 NEW HIGH SCORE! 🎉
            </div>
          )}
        </div>
        
        <div className="mb-4 md:mb-6 space-y-2 md:space-y-3">
          <div className="bg-gray-100 rounded-lg p-3 md:p-4">
            <div className="text-xs md:text-sm text-gray-600 font-medium">Your Score</div>
            <div className="text-xl md:text-2xl font-bold text-gray-800">{score}</div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg p-3 md:p-4">
            <div className="text-xs md:text-sm text-yellow-700 font-medium">High Score</div>
            <div className="text-xl md:text-2xl font-bold text-yellow-800">{highScore}</div>
          </div>
        </div>
        
        <Button 
          onClick={onRestart}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 text-sm md:text-base"
        >
          🎮 Play Again
        </Button>
        
        <p className="text-xs md:text-sm text-gray-500 mt-3 md:mt-4">
          <span className="md:hidden">Swipe or use buttons to move</span>
          <span className="hidden md:inline">Use WASD or Arrow Keys to move</span>
        </p>
      </div>
    </div>
  );
};
