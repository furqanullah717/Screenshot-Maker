interface DecorationsProps {
  visible: boolean;
  variant?: 'circles' | 'shapes' | 'blobs';
}

export function Decorations({ visible, variant = 'circles' }: DecorationsProps) {
  if (!visible) return null;

  if (variant === 'circles') {
    return (
      <>
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute top-1/3 -left-10 w-32 h-32 rounded-full bg-white/5 blur-lg pointer-events-none" />
        <div className="absolute bottom-1/4 -right-10 w-40 h-40 rounded-full bg-white/5 blur-lg pointer-events-none" />
      </>
    );
  }

  if (variant === 'shapes') {
    return (
      <>
        <div className="absolute top-10 left-10 w-20 h-20 rotate-45 bg-white/10 rounded-lg blur-sm pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-16 h-16 rotate-12 bg-white/10 rounded-lg blur-sm pointer-events-none" />
        <div className="absolute top-1/2 right-5 w-12 h-24 -rotate-12 bg-white/5 rounded-full pointer-events-none" />
      </>
    );
  }

  if (variant === 'blobs') {
    return (
      <>
        <div 
          className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 blur-3xl pointer-events-none"
          style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
        />
        <div 
          className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 blur-3xl pointer-events-none"
          style={{ borderRadius: '40% 60% 70% 30% / 40% 70% 30% 60%' }}
        />
      </>
    );
  }

  return null;
}

export default Decorations;
