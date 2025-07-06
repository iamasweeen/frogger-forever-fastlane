
import React from 'react';
import { Position } from './Game';

interface PlayerProps {
  position: Position;
}

export const Player: React.FC<PlayerProps> = ({ position }) => {
  return (
    <div
      className="absolute bg-yellow-400 border-2 border-yellow-600 rounded-full shadow-lg transition-all duration-100 z-10"
      style={{
        left: position.x,
        top: position.y,
        width: 25, // Adjusted for mobile
        height: 25,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Player face/details */}
      <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-black rounded-full" />
      <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 bg-black rounded-full" />
    </div>
  );
};
