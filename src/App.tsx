import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Snowflake as SnowflakeIcon, Sparkles, Compass, AlertCircle, RefreshCw } from 'lucide-react';
import { EffectType, SnowflakeItem, BalloonItem } from './types';
import Snowflake from './components/Snowflake';
import Balloon from './components/Balloon';

export default function App() {
  const [snowflakes, setSnowflakes] = useState<SnowflakeItem[]>([]);
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [activeEffect, setActiveEffect] = useState<EffectType>('none');
  const [isSpawning, setIsSpawning] = useState<boolean>(false);
  const [spawnCountdown, setSpawnCountdown] = useState<number>(0);

  // Spawner effect
  useEffect(() => {
    if (!isSpawning || activeEffect === 'none') return;

    const intervalId = setInterval(() => {
      if (activeEffect === 'snowflakes') {
        const id = Math.random().toString(36).substring(2, 9);
        const newSnowflake: SnowflakeItem = {
          id,
          x: Math.random() * 94 + 3, // Keep away from extreme edges
          size: Math.random() * 6 + 24, // 24px - 30px (medium size)
          opacity: Math.random() * 0.35 + 0.6, // 0.6 - 0.95 opacity
          duration: Math.random() * 1.2 + 3.4, // 3.4s - 4.6s falling speed
          sway: Math.random() * 26 + 12, // sway amount in px
          swayDuration: Math.random() * 1.0 + 1.8, // 1.8s - 2.8s sway period
          rotationSpeed: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 35 + 15),
        };
        setSnowflakes((prev) => [...prev, newSnowflake]);
      } else if (activeEffect === 'balloons') {
        // High-society luxurious & formal color palette
        const luxuryColors = [
          '#b91c1c', // Royal Burgundy / Crimson
          '#1e293b', // Crisp Slate Navy
          '#4338ca', // Elegant Indigo
          '#0f766e', // Vintage Pine Teal
          '#0284c7', // Serene Cerulean Blue
          '#b45309', // Antique Gold / Amber
          '#be185d', // Muted Deep Rose
        ];
        const randomColor = luxuryColors[Math.floor(Math.random() * luxuryColors.length)];
        const id = Math.random().toString(36).substring(2, 9);

        const newBalloon: BalloonItem = {
          id,
          x: Math.random() * 90 + 5, // Keep centered within bounds
          size: Math.random() * 6 + 32, // 32px - 38px width (medium-sized balloon base)
          aspectRatio: Math.random() * 0.08 + 1.22, // 1.22 - 1.3 height modifier
          color: randomColor,
          duration: Math.random() * 1.5 + 3.8, // 3.8s - 5.3s floating speed
          sway: Math.random() * 24 + 16, // sway amount in px
          swayDuration: Math.random() * 1.0 + 2.0, // sway cycle
          tilt: Math.random() * 12 - 6, // original tilt in degrees
        };
        setBalloons((prev) => [...prev, newBalloon]);
      }
    }, activeEffect === 'snowflakes' ? 150 : 250); // Spawning rate

    // Stop spawning after exactly 5 seconds
    const timerId = setTimeout(() => {
      setIsSpawning(false);
    }, 5000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timerId);
    };
  }, [isSpawning, activeEffect]);

  // High-precision Countdown Controller (100ms ticks)
  useEffect(() => {
    if (!isSpawning) {
      setSpawnCountdown(0);
      return;
    }

    setSpawnCountdown(5.0);
    const intervalId = setInterval(() => {
      setSpawnCountdown((prev) => {
        const next = prev - 0.1;
        return next <= 0 ? 0 : next;
      });
    }, 100);

    return () => clearInterval(intervalId);
  }, [isSpawning]);

  // Cleanup completed individual particles by ID to keep DOM light
  const handleRemoveSnowflake = (id: string) => {
    setSnowflakes((prev) => prev.filter((s) => s.id !== id));
  };

  const handleRemoveBalloon = (id: string) => {
    setBalloons((prev) => prev.filter((b) => b.id !== id));
  };

  // Safe orchestrator for triggers
  const triggerAtmosphericEffect = (effect: 'snowflakes' | 'balloons') => {
    // Quickly shut down state to reset triggers
    setIsSpawning(false);
    
    if (effect === 'snowflakes') {
      setBalloons([]); // clear other effect immediately
      setSnowflakes([]); // clear current if double-clicked
    } else {
      setSnowflakes([]); // clear other effect immediately
      setBalloons([]); // clear current if double-clicked
    }

    setActiveEffect(effect);
    
    // Defer reactivation briefly for react paint
    setTimeout(() => {
      setIsSpawning(true);
    }, 40);
  };

  // Clear all particles
  const resetAllEffects = () => {
    setIsSpawning(false);
    setActiveEffect('none');
    setSnowflakes([]);
    setBalloons([]);
    setSpawnCountdown(0);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#fcfbf9] text-zinc-900 font-sans overflow-hidden flex flex-col justify-between">
      
      {/* 1. Backdrop Grid Deco and Glass Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#e7e5e4]/20 to-transparent pointer-events-none" />

      {/* 2. Top Minimal Luxury Branding Header */}
      <header className="relative w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center space-x-2.5">
          <div className="w-2 h-2 rounded-full bg-zinc-900 animate-pulse" />
          <span className="font-mono text-[10px] tracking-[0.25em] text-zinc-400 uppercase font-medium">
            KINETIC STUDY // NO.411
          </span>
        </div>
        <div className="font-mono text-[10px] tracking-[0.15em] text-zinc-500 uppercase">
          REV. 2026.06
        </div>
      </header>

      {/* 3. Main Stage Particle Renderers (Overlay behind elements, but fills full screen) */}
      <main className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full">
        {/* Render Snowflakes with absolute coordinate calculations */}
        {activeEffect === 'snowflakes' &&
          snowflakes.map((snowflake) => (
            <Snowflake
              key={snowflake.id}
              item={snowflake}
              onComplete={handleRemoveSnowflake}
            />
          ))}

        {/* Render Balloons floating upwards */}
        {activeEffect === 'balloons' &&
          balloons.map((balloon) => (
            <Balloon
              key={balloon.id}
              item={balloon}
              onComplete={handleRemoveBalloon}
            />
          ))}
      </main>

      {/* 4. Elegant Center Piece Control Desk */}
      <section className="relative flex-1 flex items-center justify-center p-6 z-20">
        <motion.div 
          id="control-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-white/70 backdrop-blur-xl border border-zinc-200/80 rounded-2xl p-8 max-w-md w-full shadow-[0_8px_32px_rgba(27,27,27,0.02)] relative"
        >
          {/* Subtle elegant border accents */}
          <div className="absolute top-0 inset-x-4 h-[1px] bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
          
          <div className="text-center space-y-6">
            
            {/* Tag / Category */}
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200/40">
              <Compass className="w-3 h-3 text-zinc-500" />
              <span className="font-mono text-[9px] tracking-widest font-semibold uppercase">
                CELEBRATORY DYNAMICS
              </span>
            </div>

            {/* Typography Master Header */}
            <div className="space-y-2">
              <h1 className="text-4xl font-serif tracking-tight text-zinc-800 font-medium">
                Snowflakes &amp; Balloons
              </h1>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans max-w-sm mx-auto">
                An interactive physics study of weight and buoyancy. Toggle generators to trigger medium-sized streams of elements for exactly 5 seconds.
              </p>
            </div>

            {/* Premium Divider Line */}
            <hr className="border-zinc-100" />

            {/* Core Action Workspace: Dual Formal Buttons */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* BUTTON 1: SNOWFLAKES */}
              <button
                id="btn-snowflakes"
                onClick={() => triggerAtmosphericEffect('snowflakes')}
                className={`relative flex flex-col justify-center items-center py-5 px-4 rounded-xl border transition-all duration-300 group ${
                  activeEffect === 'snowflakes' && isSpawning
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-md font-medium scale-[1.02]'
                    : 'bg-white text-zinc-700 border-zinc-200/80 hover:border-zinc-400 hover:bg-zinc-50'
                }`}
              >
                {/* Glowing light indicator for active selection */}
                {activeEffect === 'snowflakes' && isSpawning && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                )}
                
                <SnowflakeIcon 
                  className={`w-7 h-7 mb-2.5 transition-transform duration-500 group-hover:rotate-12 ${
                    activeEffect === 'snowflakes' && isSpawning ? 'text-sky-300' : 'text-zinc-400 group-hover:text-zinc-600'
                  }`} 
                  strokeWidth={1.5}
                />
                <span className="text-xs font-mono tracking-widest font-semibold uppercase">
                  SNOWFLAKES
                </span>
                <span className="text-[9px] text-zinc-400 group-hover:text-zinc-500 mt-1 font-sans">
                  Falling Downward
                </span>
              </button>

              {/* BUTTON 2: BALLOONS */}
              <button
                id="btn-balloons"
                onClick={() => triggerAtmosphericEffect('balloons')}
                className={`relative flex flex-col justify-center items-center py-5 px-4 rounded-xl border transition-all duration-300 group ${
                  activeEffect === 'balloons' && isSpawning
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-md font-medium scale-[1.02]'
                    : 'bg-white text-zinc-700 border-zinc-200/80 hover:border-zinc-400 hover:bg-zinc-50'
                }`}
              >
                {/* Glowing light indicator for active selection */}
                {activeEffect === 'balloons' && isSpawning && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                )}

                <Sparkles 
                  className={`w-7 h-7 mb-2.5 transition-transform duration-300 group-hover:scale-110 ${
                    activeEffect === 'balloons' && isSpawning ? 'text-pink-300' : 'text-zinc-400 group-hover:text-zinc-600'
                  }`} 
                  strokeWidth={1.5}
                />
                <span className="text-xs font-mono tracking-widest font-semibold uppercase">
                  BALLOONS
                </span>
                <span className="text-[9px] text-zinc-400 group-hover:text-zinc-500 mt-1 font-sans">
                  Floating Upward
                </span>
              </button>

            </div>

            {/* Countdown State Indicator Block */}
            <AnimatePresence mode="wait">
              {isSpawning ? (
                <motion.div
                  key="timer-card"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-zinc-50 rounded-xl p-4 border border-zinc-100 text-left space-y-3 overflow-hidden text-xs"
                >
                  <div className="flex justify-between items-center text-zinc-500 text-[11px] font-mono">
                    <span className="tracking-wide uppercase font-semibold">
                      Spawning {activeEffect === 'snowflakes' ? 'Snow' : 'Balloons'}
                    </span>
                    <span className="font-semibold text-zinc-800">
                      {spawnCountdown.toFixed(1)}s Remaining
                    </span>
                  </div>

                  {/* Progressive loading bar representing elapsed time */}
                  <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${
                        activeEffect === 'snowflakes' ? 'bg-indigo-400' : 'bg-rose-400'
                      }`}
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: 5, ease: 'linear' }}
                    />
                  </div>

                  <div className="text-[10px] text-zinc-400 flex items-center space-x-1 font-sans">
                    <AlertCircle className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                    <span>Existing items will finish floating off-screen smoothly.</span>
                  </div>
                </motion.div>
              ) : activeEffect !== 'none' ? (
                <motion.div
                  key="post-timer-card"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-zinc-100/40 rounded-xl p-3.5 border border-zinc-200/40 text-center flex flex-col items-center justify-center space-y-2 overflow-hidden text-xs"
                >
                  <p className="text-zinc-600 font-mono text-[11px] uppercase tracking-wide">
                    Spawning Accomplished
                  </p>
                  
                  <div className="flex items-center space-x-3 mt-1">
                    <button
                      onClick={resetAllEffects}
                      className="inline-flex items-center space-x-1.5 text-zinc-500 hover:text-zinc-800 font-sans tracking-wide text-xs border border-zinc-200 py-1 px-3 bg-white hover:bg-zinc-50 rounded-md transition-all duration-200"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset View</span>
                    </button>
                    <button
                      onClick={() => triggerAtmosphericEffect(activeEffect)}
                      className="inline-flex items-center space-x-1.5 text-zinc-800 hover:text-black font-semibold font-sans tracking-wide text-xs border border-zinc-200 py-1 px-3 bg-white hover:bg-zinc-50 rounded-md transition-all duration-200"
                    >
                      <span>Trigger Again</span>
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

          </div>
        </motion.div>
      </section>

      {/* 5. Minimalist Footer Details */}
      <footer className="relative w-full max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center z-10 space-y-2 sm:space-y-0 text-zinc-400 font-mono text-[10px] tracking-wider uppercase font-medium">
        <div>
          ACTIVE PARTICLES: <span className="text-zinc-800">{snowflakes.length + balloons.length}</span>
        </div>
        <div className="space-x-4">
          <span>SIZE: MEDIUM</span>
          <span>•</span>
          <span>DURATION: 5.0S</span>
        </div>
      </footer>

    </div>
  );
}
