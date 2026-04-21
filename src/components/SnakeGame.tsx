import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;
const MIN_SPEED = 60;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER'>('IDLE');
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(p => p.x === newFood.x && p.y === newFood.y)) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setScore(0);
    setGameState('PLAYING');
    setSpeed(INITIAL_SPEED);
  };

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };
      const currentDir = nextDirection;
      setDirection(currentDir);

      switch (currentDir) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Wall Collision
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        setGameState('GAMEOVER');
        return prevSnake;
      }

      // Self Collision
      if (prevSnake.some(p => p.x === newHead.x && p.y === newHead.y)) {
        setGameState('GAMEOVER');
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food Collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
        setSpeed(s => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, nextDirection, generateFood]);

  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [gameState, moveSnake, speed]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setNextDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setNextDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setNextDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setNextDirection('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  // Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (Subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }

    // Draw Snake
    ctx.shadowBlur = 10;
    snake.forEach((p, i) => {
      ctx.fillStyle = i === 0 ? '#ffffff' : '#00ff99';
      ctx.shadowColor = i === 0 ? '#ffffff' : '#00ff99';
      
      const x = p.x * cellSize + 1.5;
      const y = p.y * cellSize + 1.5;
      const w = cellSize - 3;
      const h = cellSize - 3;

      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 2);
      ctx.fill();
    });

    // Draw Food
    ctx.fillStyle = '#ff00ea';
    ctx.shadowColor = '#ff00ea';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    const fx = food.x * cellSize + cellSize / 2;
    const fy = food.y * cellSize + cellSize / 2;
    ctx.arc(fx, fy, cellSize / 2 - 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Reset shadow
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Top Overlay Stats */}
      <div className="absolute -top-24 left-0 flex gap-12 z-20">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono">Current Score</span>
          <span className="text-4xl font-mono text-neon-green text-neon-green">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono">Multiplier</span>
          <span className="text-4xl font-mono text-white">x{(1 + score / 200).toFixed(1)}</span>
        </div>
      </div>

      <div className="relative p-[10px] bg-black neon-border rounded-lg overflow-hidden group">
        <div className="absolute inset-0 grid-bg opacity-40 group-hover:opacity-60 transition-opacity" />
        
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="relative z-10 block"
        />
        
        <div className="scanlines absolute inset-0 opacity-10 pointer-events-none z-20" />

        <AnimatePresence>
          {gameState === 'IDLE' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-6 z-30"
            >
              <h2 className="text-neon-green text-4xl font-bold tracking-tighter uppercase text-neon-green">Synth Snake</h2>
              <button 
                onClick={resetGame}
                className="group flex items-center gap-2 px-10 py-3 bg-neon-green/10 border border-neon-green/30 text-neon-green rounded-sm hover:bg-neon-green hover:text-black transition-all font-bold uppercase tracking-widest text-sm"
              >
                <Play className="w-4 h-4 fill-current" />
                Initialize
              </button>
            </motion.div>
          )}

          {gameState === 'GAMEOVER' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center gap-6 z-30"
            >
              <h2 className="text-neon-pink text-4xl font-bold uppercase tracking-tighter text-neon-pink">System Failure</h2>
              <div className="text-center">
                <p className="text-white/40 uppercase text-[10px] tracking-widest mb-1">Data Recovered</p>
                <p className="text-white text-4xl font-mono">{score}</p>
              </div>
              <button 
                onClick={resetGame}
                className="group flex items-center gap-2 px-10 py-3 bg-neon-pink/10 border border-neon-pink/30 text-neon-pink rounded-sm hover:bg-neon-pink hover:text-black transition-all font-bold uppercase tracking-widest text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Reboot System
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Overlay Label */}
      <div className="absolute -bottom-16 right-0 text-right z-20">
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono">Game Mode</div>
        <div className="text-sm font-bold text-neon-pink text-neon-pink uppercase tracking-widest">Neon Overdrive</div>
      </div>

      {/* Mobile Controls */}
      <div className="mt-20 grid grid-cols-2 gap-4 w-full p-4 md:hidden">
        <div className="grid grid-cols-3 gap-2">
            <div />
            <DirectionBtn icon={<ArrowUp />} onClick={() => direction !== 'DOWN' && setNextDirection('UP')} />
            <div />
            <DirectionBtn icon={<ArrowLeft />} onClick={() => direction !== 'RIGHT' && setNextDirection('LEFT')} />
            <DirectionBtn icon={<ArrowDown />} onClick={() => direction !== 'UP' && setNextDirection('DOWN')} />
            <DirectionBtn icon={<ArrowRight />} onClick={() => direction !== 'LEFT' && setNextDirection('RIGHT')} />
        </div>
      </div>
    </div>
  );
};

const DirectionBtn = ({ icon, onClick }: { icon: React.ReactNode, onClick: () => void }) => (
    <button 
        onClick={onClick}
        className="p-4 bg-gray-900 border border-gray-800 rounded-lg text-neon-cyan active:bg-neon-cyan active:text-black transition-colors"
    >
        {icon}
    </button>
);
