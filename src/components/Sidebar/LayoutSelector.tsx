import { layoutTemplates, LayoutTemplate } from '../../data/layoutTemplates';

interface LayoutSelectorProps {
  selectedLayout: string;
  onChange: (layoutId: string) => void;
  disabled?: boolean;
}

function PhoneMockup({ 
  x, y, scale, rotation = 0, isSelected, opacity = 1 
}: { 
  x: number; y: number; scale: number; rotation?: number; isSelected: boolean; opacity?: number;
}) {
  const frameColor = isSelected ? '#3b82f6' : '#374151';
  const screenColor = isSelected ? '#1e3a5f' : '#1f2937';
  const highlightColor = isSelected ? '#60a5fa' : '#4b5563';
  
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
        width: '28%',
        height: '50%',
        opacity,
      }}
    >
      {/* Phone frame */}
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: frameColor,
          borderRadius: '4px',
          padding: '2px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}
      >
        {/* Screen */}
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: screenColor,
            borderRadius: '3px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Screen content lines */}
          <div style={{ padding: '15% 12%' }}>
            <div style={{ 
              width: '60%', 
              height: '8%', 
              backgroundColor: highlightColor, 
              borderRadius: '1px',
              marginBottom: '8%',
              opacity: 0.6,
            }} />
            <div style={{ 
              width: '80%', 
              height: '12%', 
              backgroundColor: highlightColor, 
              borderRadius: '2px',
              marginBottom: '6%',
              opacity: 0.4,
            }} />
            <div style={{ 
              width: '70%', 
              height: '12%', 
              backgroundColor: highlightColor, 
              borderRadius: '2px',
              opacity: 0.4,
            }} />
          </div>
          {/* Notch */}
          <div
            style={{
              position: 'absolute',
              top: '3%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '30%',
              height: '6%',
              backgroundColor: frameColor,
              borderRadius: '10px',
            }}
          />
        </div>
      </div>
    </div>
  );
}

function TextBlock({ position, isSelected }: { position: string; isSelected: boolean }) {
  const color = isSelected ? '#60a5fa' : '#9ca3af';
  
  const getStyle = (): React.CSSProperties => {
    switch (position) {
      case 'top':
        return { top: '6%', left: '50%', transform: 'translateX(-50%)', alignItems: 'center' };
      case 'bottom':
        return { bottom: '8%', left: '50%', transform: 'translateX(-50%)', alignItems: 'center' };
      case 'left':
        return { top: '45%', left: '8%', transform: 'translateY(-50%)', alignItems: 'flex-start' };
      case 'right':
        return { top: '45%', right: '8%', transform: 'translateY(-50%)', alignItems: 'flex-end' };
      case 'top-left':
        return { top: '6%', left: '8%', alignItems: 'flex-start' };
      case 'bottom-left':
        return { bottom: '8%', left: '8%', alignItems: 'flex-start' };
      default:
        return { top: '20%', left: '50%', transform: 'translateX(-50%)', alignItems: 'center' };
    }
  };

  return (
    <div 
      className="absolute flex flex-col gap-0.5" 
      style={getStyle()}
    >
      {/* Title line */}
      <div
        style={{
          width: '28px',
          height: '4px',
          backgroundColor: color,
          borderRadius: '2px',
        }}
      />
      {/* Subtitle line */}
      <div
        style={{
          width: '20px',
          height: '2px',
          backgroundColor: color,
          borderRadius: '1px',
          opacity: 0.5,
        }}
      />
    </div>
  );
}

function LayoutThumbnail({ layout, isSelected }: { layout: LayoutTemplate; isSelected: boolean }) {
  const rotation = layout.phonePosition.rotation || 0;
  const secondRotation = layout.secondPhonePosition?.rotation || 0;
  const hasAnyRotation = rotation !== 0 || secondRotation !== 0;
  const showText = layout.showText !== false && layout.id !== 'minimal';
  
  // Gradient based on selection
  const bgGradient = isSelected 
    ? 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #db2777 100%)'
    : 'linear-gradient(135deg, #374151 0%, #1f2937 100%)';

  return (
    <div 
      className="relative w-full h-full rounded-md" 
      style={{ 
        background: bgGradient,
        overflow: hasAnyRotation ? 'visible' : 'hidden',
      }}
    >
      {/* Decorative circles */}
      {layout.decorations && (
        <>
          <div 
            className="absolute rounded-full"
            style={{
              top: '-10%',
              right: '-10%',
              width: '40%',
              height: '25%',
              backgroundColor: 'rgba(255,255,255,0.08)',
            }}
          />
          <div 
            className="absolute rounded-full"
            style={{
              bottom: '-5%',
              left: '-10%',
              width: '30%',
              height: '20%',
              backgroundColor: 'rgba(255,255,255,0.05)',
            }}
          />
        </>
      )}

      {/* Text block */}
      {showText && <TextBlock position={layout.textPosition} isSelected={isSelected} />}
      
      {/* Primary phone */}
      <PhoneMockup
        x={layout.phonePosition.x}
        y={layout.phonePosition.y}
        scale={layout.phonePosition.scale}
        rotation={rotation}
        isSelected={isSelected}
      />
      
      {/* Secondary phone */}
      {layout.phoneCount === 2 && layout.secondPhonePosition && (
        <PhoneMockup
          x={layout.secondPhonePosition.x}
          y={layout.secondPhonePosition.y}
          scale={layout.secondPhonePosition.scale}
          rotation={secondRotation}
          isSelected={isSelected}
          opacity={0.85}
        />
      )}
      
      {/* Feature pills indicator */}
      {layout.showFeaturePills && (
        <div className="absolute bottom-2 left-2 flex gap-0.5">
          {[1, 2, 3].map(i => (
            <div 
              key={i}
              className="rounded-full"
              style={{
                width: '6px',
                height: '6px',
                backgroundColor: isSelected ? '#60a5fa' : '#9ca3af',
                opacity: 1 - (i * 0.2),
              }}
            />
          ))}
        </div>
      )}
      
      {/* Stats indicator */}
      {layout.showStats && (
        <div className="absolute bottom-2 right-2 flex gap-0.5 items-center">
          <svg width="8" height="8" viewBox="0 0 24 24" fill={isSelected ? '#fbbf24' : '#9ca3af'}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span style={{ fontSize: '6px', color: isSelected ? '#fbbf24' : '#9ca3af', fontWeight: 600 }}>4.9</span>
        </div>
      )}
    </div>
  );
}

export function LayoutSelector({ selectedLayout, onChange, disabled }: LayoutSelectorProps) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        Layout Template
      </h3>
      <div className="grid grid-cols-3 gap-2.5">
        {layoutTemplates.map(layout => {
          const isSelected = selectedLayout === layout.id;
          const hasRotation = (layout.phonePosition.rotation || 0) !== 0 || 
                              (layout.secondPhonePosition?.rotation || 0) !== 0;
          return (
            <button
              key={layout.id}
              onClick={() => onChange(layout.id)}
              disabled={disabled}
              className={`group relative aspect-[9/16] rounded-xl transition-all duration-200 ${
                hasRotation ? '' : 'overflow-hidden'
              } ${
                isSelected
                  ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900 scale-[1.02]'
                  : 'hover:ring-2 hover:ring-gray-500/50 hover:scale-[1.02]'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={layout.description}
            >
              <LayoutThumbnail layout={layout} isSelected={isSelected} />
              <div className={`absolute bottom-0 left-0 right-0 px-1.5 py-1.5 rounded-b-xl transition-all ${
                isSelected 
                  ? 'bg-gradient-to-t from-blue-900/90 to-transparent' 
                  : 'bg-gradient-to-t from-black/80 to-transparent'
              }`}>
                <span className={`text-[9px] font-semibold leading-tight block truncate ${
                  isSelected ? 'text-blue-200' : 'text-gray-300 group-hover:text-white'
                }`}>
                  {layout.name}
                </span>
              </div>
              {isSelected && (
                <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LayoutSelector;
