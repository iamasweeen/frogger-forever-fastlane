
import React from 'react';
import { Car } from './Game';

interface VehicleProps {
  car: Car;
}

export const Vehicle: React.FC<VehicleProps> = ({ car }) => {
  return (
    <div
      className="absolute rounded-md shadow-lg transition-all duration-75"
      style={{
        left: car.x,
        top: car.y,
        width: 50,
        height: 25,
        backgroundColor: car.color,
        transform: `translateY(-50%) ${car.direction === -1 ? 'scaleX(-1)' : ''}`,
      }}
    >
      {/* Car details */}
      <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-90" />
      <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-90" />
      <div className="absolute bottom-1 left-2 w-2 h-2 bg-gray-800 rounded-full" />
      <div className="absolute bottom-1 right-2 w-2 h-2 bg-gray-800 rounded-full" />
    </div>
  );
};
