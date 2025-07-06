
import React from 'react';
import { Position } from './Game';

interface PlayerProps {
  position: Position;
}

export const Player: React.FC<PlayerProps> = ({ position }) => {
  return (
    <div
      className="absolute bg-yellow-400 border-2 border-yellow-600 rounded-full shadow-lg transition-all duration-150 z-10"
      style={{
        left: position.x,
        top: position.y,
        width: 30,
        height: 30,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Player face/details */}
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rounded-full" />
      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-black rounded-full" />
    </div>
  );
};
