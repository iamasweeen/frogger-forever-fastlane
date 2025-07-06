import React, { useState, useEffect, useCallback } from 'react';
import { GameBoard } from './GameBoard';
import { GameOverModal } from './GameOverModal';
import { ScoreDisplay } from './ScoreDisplay';

export interface Position {
  x: number;
  y: number;
}

export interface Car {
  id: string;
  x: number;
  y: number;
  speed: number;
  color: string;
  direction: 1 | -1; // 1 for right, -1 for left
}

const GRID_SIZE = 40;
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_START_Y = GAME_HEIGHT - GRID_SIZE - 20;

const Game = () => {
  const [playerPos, setPlayerPos] = useState<Position>({ x: GAME_WIDTH / 2, y: PLAYER_START_Y });
  const [cars, setCars] = useState<Car[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('crossRoadHighScore');
    return saved ? parseInt(saved) : 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [gameRunning, setGameRunning] = useState(true);

  // Car spawn lanes (y positions)
  const carLanes = [150, 250, 350, 450];
  const carColors = ['#EF4444', '#3B82F6', '#F59E0B', '#8B5CF6', '#10B981'];

  const generateCar = useCallback((): Car => {
    const lane = carLanes[Math.floor(Math.random() * carLanes.length)];
    const direction: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
    const startX = direction === 1 ? -60 : GAME_WIDTH + 60;
    const baseSpeed = 2 + Math.floor(score / 50) * 0.5; // Increase speed based on score
    const speed = baseSpeed + Math.random() * 2;
    
    return {
      id: Date.now() + Math.random().toString(),
      x: startX,
      y: lane,
      speed,
      color: carColors[Math.floor(Math.random() * carColors.length)],
      direction
    };
  }, [score]);

  const checkCollision = useCallback((playerPos: Position, cars: Car[]) => {
    const playerSize = 30;
    const carWidth = 50;
    const carHeight = 25;
    
    return cars.some(car => {
      return (
        playerPos.x < car.x + carWidth &&
        playerPos.x + playerSize > car.x &&
        playerPos.y < car.y + carHeight &&
        playerPos.y + playerSize > car.y
      );
    });
  }, []);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!gameRunning || gameOver) return;

    const moveDistance = GRID_SIZE;
    setPlayerPos(prev => {
      let newPos = { ...prev };
      
      switch (event.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          newPos.y = Math.max(20, prev.y - moveDistance);
          break;
        case 's':
        case 'arrowdown':
          newPos.y = Math.min(GAME_HEIGHT - 50, prev.y + moveDistance);
          break;
        case 'a':
        case 'arrowleft':
          newPos.x = Math.max(20, prev.x - moveDistance);
          break;
        case 'd':
        case 'arrowright':
          newPos.x = Math.min(GAME_WIDTH - 50, prev.x + moveDistance);
          break;
      }
      
      // Update score when moving forward (up)
      if (newPos.y < prev.y) {
        setScore(s => s + 10);
      }
      
      return newPos;
    });
  }, [gameRunning, gameOver]);

  // Game loop
  useEffect(() => {
    if (!gameRunning || gameOver) return;

    const gameLoop = setInterval(() => {
      // Move cars
      setCars(prevCars => {
        const updatedCars = prevCars
          .map(car => ({
            ...car,
            x: car.x + car.speed * car.direction
          }))
          .filter(car => car.x > -100 && car.x < GAME_WIDTH + 100);

        // Check collision
        if (checkCollision(playerPos, updatedCars)) {
          setGameOver(true);
          setGameRunning(false);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('crossRoadHighScore', score.toString());
          }
        }

        return updatedCars;
      });

      // Spawn new cars randomly
      if (Math.random() < 0.02) {
        setCars(prevCars => [...prevCars, generateCar()]);
      }
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameRunning, gameOver, playerPos, checkCollision, generateCar, score, highScore]);

  // Keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Initialize some cars
  useEffect(() => {
    const initialCars = Array.from({ length: 3 }, () => generateCar());
    setCars(initialCars);
  }, []);

  const resetGame = () => {
    setPlayerPos({ x: GAME_WIDTH / 2, y: PLAYER_START_Y });
    setCars([]);
    setScore(0);
    setGameOver(false);
    setGameRunning(true);
    
    // Generate new initial cars
    setTimeout(() => {
      const initialCars = Array.from({ length: 3 }, () => generateCar());
      setCars(initialCars);
    }, 100);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-sky-400 to-sky-600 p-4">
      <div className="mb-4">
        <ScoreDisplay score={score} highScore={highScore} />
      </div>
      
      <div className="relative border-4 border-white rounded-lg shadow-2xl overflow-hidden">
        <GameBoard
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          playerPos={playerPos}
          cars={cars}
          carLanes={carLanes}
        />
        
        {gameOver && (
          <GameOverModal
            score={score}
            highScore={highScore}
            onRestart={resetGame}
          />
        )}
      </div>
      
      <div className="mt-4 text-white text-center">
        <p className="text-lg font-semibold">Use WASD or Arrow Keys to move</p>
        <p className="text-sm opacity-90">Cross the roads without getting hit!</p>
      </div>
    </div>
  );
};

export default Game;
