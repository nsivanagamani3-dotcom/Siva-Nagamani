import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber City Nights',
    artist: 'AI Oracle',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/cyber/200/200',
  },
  {
    id: '2',
    title: 'Neon Pulse',
    artist: 'Synthetix',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/neon/200/200',
  },
  {
    id: '3',
    title: 'Digital Dreams',
    artist: 'Glitch Master',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/glitch/200/200',
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Playback failed", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const skipPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
      setProgress(newProgress);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <footer className="h-20 bg-dark-surface border-t border-white/10 flex items-center px-8 justify-between w-full fixed bottom-0 left-0 z-50">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={skipNext}
      />
      
      {/* Track Info */}
      <div className="flex items-center gap-4 w-72">
        <div className="w-10 h-10 bg-neon-green rounded-sm shadow-lg shadow-neon-green/20 overflow-hidden">
            <img src={currentTrack.cover} alt="" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
        </div>
        <div className="overflow-hidden">
          <div className="text-sm font-bold truncate text-white uppercase tracking-tight">{currentTrack.title}</div>
          <div className="text-[10px] text-white/40 uppercase tracking-widest">Now Playing</div>
        </div>
      </div>

      {/* Controls & Progress */}
      <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
        <div className="flex items-center gap-8">
            <button onClick={skipPrev} className="text-white/40 hover:text-white transition-colors">
                <SkipBack className="w-4 h-4 fill-current" />
            </button>
            <button 
                onClick={togglePlay}
                className="w-10 h-10 rounded-full border border-neon-green flex items-center justify-center text-neon-green hover:bg-neon-green hover:text-black transition-all"
            >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current translate-x-0.5" />}
            </button>
            <button onClick={skipNext} className="text-white/40 hover:text-white transition-colors">
                <SkipForward className="w-4 h-4 fill-current" />
            </button>
        </div>

        <div className="flex items-center gap-3 w-full">
          <span className="text-[10px] font-mono text-white/40">
            {formatTime(audioRef.current?.currentTime || 0)}
          </span>
          <div className="flex-1 h-0.5 bg-white/10 rounded-full cursor-pointer relative group"
               onClick={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 const x = e.clientX - rect.left;
                 const p = (x / rect.width) * 100;
                 handleProgressChange({ target: { value: p.toString() } } as any);
               }}
          >
            <div 
              className="h-full bg-neon-green shadow-neon-green" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <span className="text-[10px] font-mono text-white/40">
            {formatTime(audioRef.current?.duration || 0)}
          </span>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-4 w-72 justify-end">
        <div className="text-[10px] uppercase tracking-widest text-white/40 font-mono">VOL</div>
        <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white/60"
        />
      </div>
    </footer>
  );
};
