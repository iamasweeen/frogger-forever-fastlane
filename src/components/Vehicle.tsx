
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
        width: 40, // Adjusted for mobile
        height: 20,
        backgroundColor: car.color,
        transform: `translateY(-50%) ${car.direction === -1 ? 'scaleX(-1)' : ''}`,
      }}
    >
      {/* Car details */}
      <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white rounded-full opacity-90" />
      <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-white rounded-full opacity-90" />
      <div className="absolute bottom-0.5 left-1 w-1.5 h-1.5 bg-gray-800 rounded-full" />
      <div className="absolute bottom-0.5 right-1 w-1.5 h-1.5 bg-gray-800 rounded-full" />
    </div>
  );
};
