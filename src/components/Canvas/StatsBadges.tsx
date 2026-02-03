interface StatBadge {
  value: string;
  label: string;
  showLaurel?: boolean;
}

interface ElementOffset {
  x: number;
  y: number;
  scale: number;
}

interface StatsBadgesProps {
  stats: StatBadge[];
  positions: { x: number; y: number }[];
  color?: string;
  offset?: ElementOffset;
}

function LaurelWreath({ side }: { side: 'left' | 'right' }) {
  const transform = side === 'right' ? 'scaleX(-1)' : '';
  
  return (
    <svg 
      className="w-8 h-16 text-white opacity-80" 
      viewBox="0 0 32 64" 
      fill="currentColor"
      style={{ transform }}
    >
      <path d="M8 8c4 2 6 8 6 16s-2 14-6 16c-2-4-3-10-3-16s1-12 3-16z" opacity="0.8"/>
      <path d="M12 4c3 3 4 10 4 18s-1 15-4 18c-1-5-2-11-2-18s1-13 2-18z" opacity="0.6"/>
      <path d="M16 2c2 4 3 11 3 20s-1 16-3 20c-1-6-1-12-1-20s0-14 1-20z" opacity="0.4"/>
    </svg>
  );
}

export function StatsBadges({ stats, positions, color = '#ffffff', offset = { x: 0, y: 0, scale: 1 } }: StatsBadgesProps) {
  return (
    <div 
      className="absolute inset-0 pointer-events-none z-20"
      style={{
        transform: `translate(${offset.x}%, ${offset.y}%) scale(${offset.scale})`,
        transformOrigin: 'center center',
      }}
    >
      {stats.map((stat, index) => {
        const position = positions[index % positions.length];
        
        return (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
            }}
          >
            <div className="flex items-center gap-1">
              {stat.showLaurel !== false && <LaurelWreath side="left" />}
              <div className="text-center px-2">
                <div 
                  className="text-2xl font-bold leading-tight"
                  style={{ color }}
                >
                  {stat.value}
                </div>
                <div 
                  className="text-sm opacity-80"
                  style={{ color }}
                >
                  {stat.label}
                </div>
              </div>
              {stat.showLaurel !== false && <LaurelWreath side="right" />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsBadges;
