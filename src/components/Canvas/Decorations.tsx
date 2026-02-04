interface DecorationsProps {
  visible: boolean;
  variant?: 'circles' | 'shapes' | 'blobs';
  canvasScale?: number;
}

export function Decorations({ visible, variant = 'circles', canvasScale = 1 }: DecorationsProps) {
  if (!visible) return null;

  if (variant === 'circles') {
    return (
      <>
        <div 
          className="absolute rounded-full bg-white/10 pointer-events-none" 
          style={{ 
            top: `${-80 * canvasScale}px`, 
            right: `${-80 * canvasScale}px`, 
            width: `${256 * canvasScale}px`, 
            height: `${256 * canvasScale}px`,
            filter: `blur(${24 * canvasScale}px)`,
          }} 
        />
        <div 
          className="absolute rounded-full bg-white/10 pointer-events-none" 
          style={{ 
            bottom: `${-80 * canvasScale}px`, 
            left: `${-80 * canvasScale}px`, 
            width: `${192 * canvasScale}px`, 
            height: `${192 * canvasScale}px`,
            filter: `blur(${24 * canvasScale}px)`,
          }} 
        />
        <div 
          className="absolute rounded-full bg-white/5 pointer-events-none" 
          style={{ 
            top: '33%', 
            left: `${-40 * canvasScale}px`, 
            width: `${128 * canvasScale}px`, 
            height: `${128 * canvasScale}px`,
            filter: `blur(${16 * canvasScale}px)`,
          }} 
        />
        <div 
          className="absolute rounded-full bg-white/5 pointer-events-none" 
          style={{ 
            bottom: '25%', 
            right: `${-40 * canvasScale}px`, 
            width: `${160 * canvasScale}px`, 
            height: `${160 * canvasScale}px`,
            filter: `blur(${16 * canvasScale}px)`,
          }} 
        />
      </>
    );
  }

  if (variant === 'shapes') {
    return (
      <>
        <div 
          className="absolute bg-white/10 rounded-lg pointer-events-none" 
          style={{ 
            top: `${40 * canvasScale}px`, 
            left: `${40 * canvasScale}px`, 
            width: `${80 * canvasScale}px`, 
            height: `${80 * canvasScale}px`,
            transform: 'rotate(45deg)',
            filter: `blur(${4 * canvasScale}px)`,
          }} 
        />
        <div 
          className="absolute bg-white/10 rounded-lg pointer-events-none" 
          style={{ 
            bottom: `${80 * canvasScale}px`, 
            right: `${40 * canvasScale}px`, 
            width: `${64 * canvasScale}px`, 
            height: `${64 * canvasScale}px`,
            transform: 'rotate(12deg)',
            filter: `blur(${4 * canvasScale}px)`,
          }} 
        />
        <div 
          className="absolute bg-white/5 rounded-full pointer-events-none" 
          style={{ 
            top: '50%', 
            right: `${20 * canvasScale}px`, 
            width: `${48 * canvasScale}px`, 
            height: `${96 * canvasScale}px`,
            transform: 'rotate(-12deg)',
          }} 
        />
      </>
    );
  }

  if (variant === 'blobs') {
    return (
      <>
        <div 
          className="absolute bg-white/10 pointer-events-none"
          style={{ 
            top: `${-80 * canvasScale}px`, 
            right: `${-80 * canvasScale}px`, 
            width: `${320 * canvasScale}px`, 
            height: `${320 * canvasScale}px`,
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            filter: `blur(${48 * canvasScale}px)`,
          }}
        />
        <div 
          className="absolute bg-white/10 pointer-events-none"
          style={{ 
            bottom: `${-80 * canvasScale}px`, 
            left: `${-80 * canvasScale}px`, 
            width: `${256 * canvasScale}px`, 
            height: `${256 * canvasScale}px`,
            borderRadius: '40% 60% 70% 30% / 40% 70% 30% 60%',
            filter: `blur(${48 * canvasScale}px)`,
          }}
        />
      </>
    );
  }

  return null;
}

export default Decorations;
