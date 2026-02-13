import { motion } from 'motion/react';
import { GridType } from './AdvancedGridControls';

interface GridOverlayProps {
  gridType: GridType;
  opacity: number;
  color: string;
}

export function GridOverlay({ gridType, opacity, color }: GridOverlayProps) {
  if (gridType === 'none') return null;

  const colorMap: Record<string, string> = {
    cyan: 'rgb(34, 211, 238)',
    amber: 'rgb(251, 191, 36)',
    purple: 'rgb(168, 85, 247)',
    green: 'rgb(34, 197, 94)',
    red: 'rgb(239, 68, 68)',
    white: 'rgb(255, 255, 255)',
  };

  const gridColor = colorMap[color] || colorMap.cyan;
  const opacityValue = opacity / 100;

  const grids = {
    thirds: (
      <>
        {/* Vertical lines */}
        <div 
          className="absolute left-1/3 top-0 bottom-0 w-0.5"
          style={{
            background: `linear-gradient(to bottom, transparent, ${gridColor}, transparent)`,
            opacity: opacityValue,
          }}
        />
        <div 
          className="absolute right-1/3 top-0 bottom-0 w-0.5"
          style={{
            background: `linear-gradient(to bottom, transparent, ${gridColor}, transparent)`,
            opacity: opacityValue,
          }}
        />
        {/* Horizontal lines */}
        <div 
          className="absolute top-1/3 left-0 right-0 h-0.5"
          style={{
            background: `linear-gradient(to right, transparent, ${gridColor}, transparent)`,
            opacity: opacityValue,
          }}
        />
        <div 
          className="absolute bottom-1/3 left-0 right-0 h-0.5"
          style={{
            background: `linear-gradient(to right, transparent, ${gridColor}, transparent)`,
            opacity: opacityValue,
          }}
        />
        {/* Intersection points */}
        {[
          { top: '33.33%', left: '33.33%' },
          { top: '33.33%', left: '66.67%' },
          { top: '66.67%', left: '33.33%' },
          { top: '66.67%', left: '66.67%' },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{
              top: pos.top,
              left: pos.left,
              backgroundColor: gridColor,
              opacity: opacityValue * 0.8,
            }}
          />
        ))}
      </>
    ),

    golden: (
      <>
        {/* Golden ratio: 0.618 */}
        <div 
          className="absolute left-[38.2%] top-0 bottom-0 w-0.5"
          style={{
            background: `linear-gradient(to bottom, transparent, ${gridColor}, transparent)`,
            opacity: opacityValue,
          }}
        />
        <div 
          className="absolute right-[38.2%] top-0 bottom-0 w-0.5"
          style={{
            background: `linear-gradient(to bottom, transparent, ${gridColor}, transparent)`,
            opacity: opacityValue,
          }}
        />
        <div 
          className="absolute top-[38.2%] left-0 right-0 h-0.5"
          style={{
            background: `linear-gradient(to right, transparent, ${gridColor}, transparent)`,
            opacity: opacityValue,
          }}
        />
        <div 
          className="absolute bottom-[38.2%] left-0 right-0 h-0.5"
          style={{
            background: `linear-gradient(to right, transparent, ${gridColor}, transparent)`,
            opacity: opacityValue,
          }}
        />
        {/* φ symbol */}
        <div 
          className="absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded backdrop-blur-sm"
          style={{ 
            color: gridColor, 
            opacity: opacityValue,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          φ = 1.618
        </div>
      </>
    ),

    center: (
      <>
        {/* Center crosshair */}
        <div 
          className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
          style={{
            background: `linear-gradient(to bottom, transparent, ${gridColor}, transparent)`,
            opacity: opacityValue,
          }}
        />
        <div 
          className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2"
          style={{
            background: `linear-gradient(to right, transparent, ${gridColor}, transparent)`,
            opacity: opacityValue,
          }}
        />
        {/* Face guidelines */}
        <div 
          className="absolute top-[15%] left-0 right-0 h-0.5"
          style={{
            background: `linear-gradient(to right, transparent, ${gridColor}, transparent)`,
            opacity: opacityValue * 0.7,
          }}
        />
        <div 
          className="absolute top-[60%] left-0 right-0 h-0.5"
          style={{
            background: `linear-gradient(to right, transparent, ${gridColor}, transparent)`,
            opacity: opacityValue * 0.7,
          }}
        />
        {/* Labels */}
        <div 
          className="absolute top-[15%] right-2 text-xs px-2 py-0.5 rounded backdrop-blur-sm -translate-y-1/2"
          style={{ 
            color: gridColor, 
            opacity: opacityValue * 0.8,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          Eyes
        </div>
        <div 
          className="absolute top-[60%] right-2 text-xs px-2 py-0.5 rounded backdrop-blur-sm -translate-y-1/2"
          style={{ 
            color: gridColor, 
            opacity: opacityValue * 0.8,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          Chin
        </div>
      </>
    ),

    diagonal: (
      <>
        {/* Diagonal lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line 
            x1="0" y1="0" x2="100%" y2="100%" 
            stroke={gridColor}
            strokeWidth="2"
            opacity={opacityValue}
          />
          <line 
            x1="100%" y1="0" x2="0" y2="100%" 
            stroke={gridColor}
            strokeWidth="2"
            opacity={opacityValue}
          />
          {/* Additional diagonals */}
          <line 
            x1="0" y1="50%" x2="50%" y2="100%" 
            stroke={gridColor}
            strokeWidth="1"
            opacity={opacityValue * 0.5}
            strokeDasharray="4 4"
          />
          <line 
            x1="50%" y1="0" x2="100%" y2="50%" 
            stroke={gridColor}
            strokeWidth="1"
            opacity={opacityValue * 0.5}
            strokeDasharray="4 4"
          />
        </svg>
      </>
    ),

    spiral: (
      <>
        {/* Fibonacci spiral */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
          <path
            d="M 61.8 38.2 Q 61.8 61.8 38.2 61.8 Q 14.6 61.8 14.6 38.2 Q 14.6 14.6 38.2 14.6 Q 61.8 14.6 61.8 38.2"
            fill="none"
            stroke={gridColor}
            strokeWidth="0.5"
            opacity={opacityValue}
          />
          <path
            d="M 50 50 Q 50 61.8 38.2 61.8 Q 26.4 61.8 26.4 50 Q 26.4 38.2 38.2 38.2 Q 50 38.2 50 50"
            fill="none"
            stroke={gridColor}
            strokeWidth="0.5"
            opacity={opacityValue}
          />
          {/* Quarter divisions */}
          <line x1="61.8" y1="0" x2="61.8" y2="100" stroke={gridColor} strokeWidth="0.5" opacity={opacityValue * 0.4} />
          <line x1="0" y1="61.8" x2="100" y2="61.8" stroke={gridColor} strokeWidth="0.5" opacity={opacityValue * 0.4} />
        </svg>
        <div 
          className="absolute bottom-2 right-2 text-xs px-2 py-1 rounded backdrop-blur-sm"
          style={{ 
            color: gridColor, 
            opacity: opacityValue,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          Fibonacci
        </div>
      </>
    ),

    passport: (
      <>
        {/* Official passport photo guidelines */}
        {/* Head height zone (70-80% of frame) */}
        <div 
          className="absolute left-0 right-0 border-2 border-dashed"
          style={{
            top: '10%',
            height: '80%',
            borderColor: gridColor,
            opacity: opacityValue * 0.4,
          }}
        />
        
        {/* Eye level (50-70% from bottom) */}
        <div 
          className="absolute left-0 right-0 h-0.5"
          style={{
            top: '35%',
            background: `linear-gradient(to right, transparent, ${gridColor}, transparent)`,
            opacity: opacityValue,
          }}
        />
        <div 
          className="absolute top-[35%] left-2 text-xs px-2 py-0.5 rounded backdrop-blur-sm -translate-y-1/2"
          style={{ 
            color: gridColor, 
            opacity: opacityValue,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          Eye Level (65%)
        </div>

        {/* Top of head */}
        <div 
          className="absolute left-0 right-0 h-0.5"
          style={{
            top: '10%',
            background: `linear-gradient(to right, transparent, ${gridColor}, transparent)`,
            opacity: opacityValue,
          }}
        />
        <div 
          className="absolute top-[10%] left-2 text-xs px-2 py-0.5 rounded backdrop-blur-sm -translate-y-1/2"
          style={{ 
            color: gridColor, 
            opacity: opacityValue,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          Top (10%)
        </div>

        {/* Chin level */}
        <div 
          className="absolute left-0 right-0 h-0.5"
          style={{
            top: '90%',
            background: `linear-gradient(to right, transparent, ${gridColor}, transparent)`,
            opacity: opacityValue,
          }}
        />
        <div 
          className="absolute top-[90%] left-2 text-xs px-2 py-0.5 rounded backdrop-blur-sm -translate-y-1/2"
          style={{ 
            color: gridColor, 
            opacity: opacityValue,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          Chin (90%)
        </div>

        {/* Center vertical */}
        <div 
          className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
          style={{
            background: `linear-gradient(to bottom, transparent, ${gridColor}, transparent)`,
            opacity: opacityValue * 0.6,
          }}
        />

        {/* Face width guides (shoulders ~65% width) */}
        <div 
          className="absolute top-0 bottom-0 w-0.5"
          style={{
            left: '17.5%',
            background: `linear-gradient(to bottom, transparent 50%, ${gridColor} 50%, transparent)`,
            opacity: opacityValue * 0.3,
            backgroundSize: '100% 20px',
          }}
        />
        <div 
          className="absolute top-0 bottom-0 w-0.5"
          style={{
            right: '17.5%',
            background: `linear-gradient(to bottom, transparent 50%, ${gridColor} 50%, transparent)`,
            opacity: opacityValue * 0.3,
            backgroundSize: '100% 20px',
          }}
        />

        {/* Info badge */}
        <div 
          className="absolute bottom-2 left-2 text-xs px-2 py-1 rounded backdrop-blur-sm"
          style={{ 
            color: gridColor, 
            opacity: opacityValue,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          📐 Official Passport Guidelines
        </div>
      </>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="absolute inset-0 pointer-events-none"
    >
      {grids[gridType]}
    </motion.div>
  );
}
