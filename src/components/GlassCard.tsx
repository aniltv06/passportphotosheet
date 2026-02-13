import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function GlassCard({ children, className = '', delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -2 }}
      className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}
