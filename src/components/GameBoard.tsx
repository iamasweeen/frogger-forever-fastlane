
import React from 'react';
import { Position, Car } from './Game';
import { Player } from './Player';
import { Vehicle } from './Vehicle';

interface GameBoardProps {
  width: number;
  height: number;
  playerPos: Position;
  cars: Car[];
  carLanes: number[];
}

export const GameBoard: React.FC<GameBoardProps> = ({
  width,
  height,
  playerPos,
  cars,
  carLanes
}) => {
  return (
    <div 
      className="relative bg-gradient-to-b from-green-400 to-green-500 touch-none"
      style={{ width, height }}
    >
      {/* Safe zones (grass) */}
      <div className="absolute inset-0 bg-green-500" />
      
      {/* Road lanes */}
      {carLanes.map((laneY, index) => (
        <div
          key={index}
          className="absolute bg-gray-700 shadow-inner"
          style={{
            top: laneY - 12,
            left: 0,
            width: '100%',
            height: 48, // Adjusted for mobile
          }}
        >
          {/* Road markings */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-yellow-300 transform -translate-y-1/2 opacity-70">
            <div className="flex justify-around h-full">
              {Array.from({ length: Math.floor(width / 40) }).map((_, i) => (
                <div key={i} className="w-6 h-full bg-yellow-300" />
              ))}
            </div>
          </div>
        </div>
      ))}
      
      {/* Start zone (bottom grass) */}
      <div
        className="absolute bg-green-600 border-t-2 md:border-t-4 border-yellow-400"
        style={{
          bottom: 0,
          left: 0,
          width: '100%',
          height: 60, // Adjusted for mobile
        }}
      >
        <div className="absolute top-1 md:top-2 left-1/2 transform -translate-x-1/2 text-yellow-100 font-bold text-sm md:text-lg">
          START
        </div>
      </div>
      
      {/* Goal zone (top grass) */}
      <div
        className="absolute bg-green-600 border-b-2 md:border-b-4 border-yellow-400"
        style={{
          top: 0,
          left: 0,
          width: '100%',
          height: 60, // Adjusted for mobile
        }}
      >
        <div className="absolute bottom-1 md:bottom-2 left-1/2 transform -translate-x-1/2 text-yellow-100 font-bold text-sm md:text-lg">
          GOAL
        </div>
      </div>
      
      {/* Cars */}
      {cars.map(car => (
        <Vehicle key={car.id} car={car} />
      ))}
      
      {/* Player */}
      <Player position={playerPos} />
    </div>
  );
};
