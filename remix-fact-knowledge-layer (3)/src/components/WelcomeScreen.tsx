import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { FactCheckIcon } from './FactCheckIcon';

interface WelcomeScreenProps {
  onComplete: () => void;
  durationMs?: number; // default 2200ms
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onComplete,
  durationMs = 2200,
}) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);

      if (elapsed >= durationMs) {
        clearInterval(interval);
        handleExit();
      }
    }, 25);

    return () => clearInterval(interval);
  }, [durationMs]);

  const handleExit = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 350);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="welcome-factcheck"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white text-slate-900 overflow-hidden select-none font-sans"
        >
          {/* Ambient Warm Atmosphere Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-orange-200/40 rounded-full blur-3xl opacity-60" />
            <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-orange-300/30 rounded-full blur-3xl opacity-50" />
          </div>

          {/* Center Card */}
          <motion.div
            initial={{ scale: 0.94, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-md mx-4 p-8 sm:p-10 bg-white/95 backdrop-blur-xl rounded-3xl border border-orange-200/80 shadow-2xl shadow-orange-500/10 flex flex-col items-center text-center"
          >
            {/* Glowing F FactCheck Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 240, damping: 18 }}
              className="relative mb-6"
            >
              <div className="absolute inset-0 rounded-2xl bg-orange-500 blur-xl opacity-35" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 text-white flex items-center justify-center shadow-xl shadow-orange-500/25 border border-white/40">
                <FactCheckIcon className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            {/* Only display Welcome to FactCheck */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mb-6"
            >
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Welcome to <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">FactCheck</span>
              </h1>
            </motion.div>

            {/* Minimal auto-transition progress indicator */}
            <div className="w-full space-y-2 mb-4">
              <div className="w-full h-1.5 rounded-full bg-orange-100 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>
            </div>

            {/* Direct Enter Action */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={handleExit}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer"
            >
              <span>Enter FactCheck</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
