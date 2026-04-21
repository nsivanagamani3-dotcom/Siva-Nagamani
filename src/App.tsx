/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Terminal, Cpu, Zap } from 'lucide-react';

export default function App() {
  return (
    <div className="flex flex-col h-screen w-full bg-dark-bg font-sans text-white overflow-hidden selection:bg-neon-green selection:text-black">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-dark-surface border-r border-white/10 flex flex-col p-8 shrink-0">
          <div className="mb-12">
            <h1 className="text-xl font-bold tracking-tighter text-neon-green text-neon-green flex items-center gap-2">
              SYNTH-SNAKE <span className="text-[10px] font-normal opacity-50 font-mono tracking-widest translate-y-0.5">v2.0</span>
            </h1>
          </div>

          <nav className="flex-1 space-y-10 overflow-y-auto">
            <div>
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono mb-6">Environment</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white/5 border-l-2 border-neon-green">
                    <div className="w-2 h-2 bg-neon-green rounded-full shadow-neon-green animate-pulse" />
                    <span className="text-xs font-mono text-white/80 uppercase">Neural Link Active</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 border-l-2 border-white/20 opacity-50">
                    <div className="w-2 h-2 bg-white/40 rounded-full" />
                    <span className="text-xs font-mono text-white/80 uppercase">Offline Buffer</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono mb-6">Game Statistics</h2>
              <div className="bg-black/40 p-5 rounded-lg border border-white/5 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] uppercase tracking-widest text-white/40">Up Time</span>
                  <span className="text-sm font-mono tracking-tighter">14:22:04</span>
                </div>
                <div className="flex justify-between items-baseline border-t border-white/5 pt-4">
                  <span className="text-[10px] uppercase tracking-widest text-white/40">Data Rate</span>
                  <span className="text-sm font-mono text-neon-green tracking-tighter">8.4 GB/S</span>
                </div>
              </div>
            </div>
          </nav>

          <footer className="mt-auto pt-8 border-t border-white/5">
                <div className="flex items-center gap-3">
                    <Cpu className="w-4 h-4 text-white/20" />
                    <div className="flex flex-col">
                        <span className="text-[8px] uppercase tracking-widest text-white/20">System Core</span>
                        <span className="text-[10px] font-mono text-white/40">ais-3.0.neural</span>
                    </div>
                </div>
          </footer>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10"
          >
            <SnakeGame />
          </motion.div>
          
          {/* Background Detail */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full grid-bg" />
            <motion.div 
              animate={{ 
                opacity: [0.1, 0.2, 0.1],
                scale: [1, 1.1, 1] 
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-green/5 blur-[120px] rounded-full"
            />
          </div>
        </main>
      </div>

      {/* Music Player Footer (Fixed component handles its own footer tag) */}
      <MusicPlayer />
    </div>
  );
}


