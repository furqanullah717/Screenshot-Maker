interface FeaturePill {
  text: string;
  icon?: string;
}

interface ElementOffset {
  x: number;
  y: number;
  scale: number;
}

interface FeaturePillsProps {
  pills: FeaturePill[];
  positions: { x: number; y: number }[];
  color?: string;
  offset?: ElementOffset;
  canvasScale?: number;
}

const defaultIcons = ['music', 'code', 'palette', 'video', 'star', 'heart'];

export function FeaturePills({ pills, positions, color = '#3b82f6', offset = { x: 0, y: 0, scale: 1 }, canvasScale = 1 }: FeaturePillsProps) {
  return (
    <div 
      className="absolute inset-0 pointer-events-none z-20"
      style={{
        transform: `translate(${offset.x}%, ${offset.y}%) scale(${offset.scale})`,
        transformOrigin: 'center center',
      }}
    >
      {pills.map((pill, index) => {
        const position = positions[index % positions.length];
        const icon = pill.icon || defaultIcons[index % defaultIcons.length];
        
        return (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
            }}
          >
            <div 
              className="flex items-center bg-white rounded-full shadow-lg"
              style={{ 
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                gap: `${8 * canvasScale}px`,
                padding: `${10 * canvasScale}px ${16 * canvasScale}px`,
                borderRadius: `${9999 * canvasScale}px`,
              }}
            >
              <div 
                className="rounded-full flex items-center justify-center text-white"
                style={{ 
                  backgroundColor: color,
                  width: `${32 * canvasScale}px`,
                  height: `${32 * canvasScale}px`,
                }}
              >
                <svg style={{ width: `${16 * canvasScale}px`, height: `${16 * canvasScale}px` }} fill="currentColor" viewBox="0 0 24 24">
                  {getIconPath(icon)}
                </svg>
              </div>
              <span 
                className="text-gray-800 font-medium whitespace-nowrap"
                style={{ fontSize: `${14 * canvasScale}px` }}
              >
                {pill.text}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getIconPath(icon: string): JSX.Element {
  switch (icon) {
    case 'music':
      return <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>;
    case 'code':
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" fill="none" stroke="currentColor"/>;
    case 'palette':
      return <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10a2.5 2.5 0 002.5-2.5c0-.61-.23-1.21-.64-1.67-.08-.09-.13-.21-.13-.33 0-.28.22-.5.5-.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 8 6.5 8 8 8.67 8 9.5 7.33 11 6.5 11zm3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4s1.5.67 1.5 1.5S10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4s1.5.67 1.5 1.5S15.33 7 14.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>;
    case 'video':
      return <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>;
    case 'star':
      return <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>;
    case 'heart':
      return <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>;
    default:
      return <circle cx="12" cy="12" r="8"/>;
  }
}

export default FeaturePills;
