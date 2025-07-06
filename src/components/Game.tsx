
import React, { useState, useEffect, useCallback, useRef } from 'react';
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

const GRID_SIZE = 30; // Reduced for mobile
const GAME_WIDTH = Math.min(400, window.innerWidth - 40); // Responsive width
const GAME_HEIGHT = Math.min(600, window.innerHeight - 200); // Responsive height
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
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Car spawn lanes (y positions) - adjusted for mobile
  const carLanes = [120, 200, 280, 360];
  const carColors = ['#EF4444', '#3B82F6', '#F59E0B', '#8B5CF6', '#10B981'];

  const generateCar = useCallback((): Car => {
    const lane = carLanes[Math.floor(Math.random() * carLanes.length)];
    const direction: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
    const startX = direction === 1 ? -60 : GAME_WIDTH + 60;
    const baseSpeed = 1.5 + Math.floor(score / 50) * 0.3; // Slightly slower for mobile
    const speed = baseSpeed + Math.random() * 1.5;
    
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
    const playerSize = 25; // Slightly smaller for mobile
    const carWidth = 40; // Adjusted for mobile
    const carHeight = 20;
    
    return cars.some(car => {
      return (
        playerPos.x < car.x + carWidth &&
        playerPos.x + playerSize > car.x &&
        playerPos.y < car.y + carHeight &&
        playerPos.y + playerSize > car.y
      );
    });
  }, []);

  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!gameRunning || gameOver) return;

    const moveDistance = GRID_SIZE;
    setPlayerPos(prev => {
      let newPos = { ...prev };
      
      switch (direction) {
        case 'up':
          newPos.y = Math.max(20, prev.y - moveDistance);
          break;
        case 'down':
          newPos.y = Math.min(GAME_HEIGHT - 40, prev.y + moveDistance);
          break;
        case 'left':
          newPos.x = Math.max(20, prev.x - moveDistance);
          break;
        case 'right':
          newPos.x = Math.min(GAME_WIDTH - 40, prev.x + moveDistance);
          break;
      }
      
      // Update score when moving forward (up)
      if (newPos.y < prev.y) {
        setScore(s => s + 10);
      }
      
      return newPos;
    });
  }, [gameRunning, gameOver]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    switch (event.key.toLowerCase()) {
      case 'w':
      case 'arrowup':
        movePlayer('up');
        break;
      case 's':
      case 'arrowdown':
        movePlayer('down');
        break;
      case 'a':
      case 'arrowleft':
        movePlayer('left');
        break;
      case 'd':
      case 'arrowright':
        movePlayer('right');
        break;
    }
  }, [movePlayer]);

  // Touch controls
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    if (!touchStartRef.current) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const minSwipeDistance = 30;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        movePlayer(deltaX > 0 ? 'right' : 'left');
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        movePlayer(deltaY > 0 ? 'down' : 'up');
      }
    }

    touchStartRef.current = null;
  }, [movePlayer]);

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

      // Spawn new cars randomly (slightly less frequent for mobile)
      if (Math.random() < 0.015) {
        setCars(prevCars => [...prevCars, generateCar()]);
      }
    }, 60); // Slightly slower for mobile

    return () => clearInterval(gameLoop);
  }, [gameRunning, gameOver, playerPos, checkCollision, generateCar, score, highScore]);

  // Keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Initialize some cars
  useEffect(() => {
    const initialCars = Array.from({ length: 2 }, () => generateCar()); // Fewer initial cars for mobile
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
      const initialCars = Array.from({ length: 2 }, () => generateCar());
      setCars(initialCars);
    }, 100);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-sky-400 to-sky-600 p-2 touch-none select-none">
      <div className="mb-2">
        <ScoreDisplay score={score} highScore={highScore} />
      </div>
      
      <div 
        className="relative border-4 border-white rounded-lg shadow-2xl overflow-hidden touch-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
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
      
      {/* Mobile Control Instructions */}
      <div className="mt-4 text-white text-center px-4">
        <p className="text-sm md:text-lg font-semibold">
          <span className="md:hidden">Swipe to move</span>
          <span className="hidden md:inline">Use WASD or Arrow Keys to move</span>
        </p>
        <p className="text-xs md:text-sm opacity-90">Cross the roads without getting hit!</p>
      </div>

      {/* Mobile directional buttons for backup control */}
      <div className="mt-4 grid grid-cols-3 gap-2 md:hidden">
        <div></div>
        <button
          className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white font-bold text-xl active:bg-white/30 transition-colors"
          onTouchStart={(e) => { e.preventDefault(); movePlayer('up'); }}
        >
          ↑
        </button>
        <div></div>
        <button
          className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white font-bold text-xl active:bg-white/30 transition-colors"
          onTouchStart={(e) => { e.preventDefault(); movePlayer('left'); }}
        >
          ←
        </button>
        <div></div>
        <button
          className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white font-bold text-xl active:bg-white/30 transition-colors"
          onTouchStart={(e) => { e.preventDefault(); movePlayer('right'); }}
        >
          →
        </button>
        <div></div>
        <button
          className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white font-bold text-xl active:bg-white/30 transition-colors"
          onTouchStart={(e) => { e.preventDefault(); movePlayer('down'); }}
        >
          ↓
        </button>
        <div></div>
      </div>
    </div>
  );
};

export default Game;
