
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
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4 transform scale-95 animate-scale-in">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Game Over!</h2>
          {isNewHighScore && (
            <div className="text-yellow-500 font-bold text-lg mb-2 animate-pulse">
              🎉 NEW HIGH SCORE! 🎉
            </div>
          )}
        </div>
        
        <div className="mb-6 space-y-3">
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="text-sm text-gray-600 font-medium">Your Score</div>
            <div className="text-2xl font-bold text-gray-800">{score}</div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg p-4">
            <div className="text-sm text-yellow-700 font-medium">High Score</div>
            <div className="text-2xl font-bold text-yellow-800">{highScore}</div>
          </div>
        </div>
        
        <Button 
          onClick={onRestart}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
        >
          🎮 Play Again
        </Button>
        
        <p className="text-sm text-gray-500 mt-4">
          Use WASD or Arrow Keys to move
        </p>
      </div>
    </div>
  );
};
