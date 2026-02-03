import { layoutTemplates, LayoutTemplate } from '../../data/layoutTemplates';

interface LayoutSelectorProps {
  selectedLayout: string;
  onChange: (layoutId: string) => void;
  disabled?: boolean;
}

function LayoutThumbnail({ layout, isSelected }: { layout: LayoutTemplate; isSelected: boolean }) {
  const phoneColor = isSelected ? '#60a5fa' : '#6b7280';
  const accentColor = isSelected ? '#60a5fa' : '#9ca3af';
  
  const rotation = layout.phonePosition.rotation || 0;
  const hasRotation = rotation !== 0;
  const secondRotation = layout.secondPhonePosition?.rotation || 0;
  const hasAnyRotation = hasRotation || secondRotation !== 0;

  const phoneStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${layout.phonePosition.x}%`,
    top: `${layout.phonePosition.y}%`,
    transform: `translate(-50%, -50%) scale(${layout.phonePosition.scale}) rotate(${rotation}deg)`,
    width: '24%',
    height: '45%',
    backgroundColor: phoneColor,
    borderRadius: '3px',
    boxShadow: hasRotation ? '0 2px 4px rgba(0,0,0,0.3)' : undefined,
  };

  const getTextPosition = (): React.CSSProperties => {
    switch (layout.textPosition) {
      case 'top':
        return { top: '8%', left: '50%', transform: 'translateX(-50%)' };
      case 'bottom':
        return { top: '85%', left: '50%', transform: 'translateX(-50%)' };
      case 'left':
        return { top: '50%', left: '15%', transform: 'translate(-50%, -50%)' };
      case 'right':
        return { top: '50%', left: '75%', transform: 'translate(-50%, -50%)' };
      case 'top-left':
        return { top: '8%', left: '8%', transform: 'none' };
      case 'bottom-left':
        return { top: '85%', left: '8%', transform: 'none' };
      case 'overlay':
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  const showText = !['overlay', 'minimal'].includes(layout.textPosition) && layout.id !== 'minimal';

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 rounded" style={{ overflow: hasAnyRotation ? 'visible' : 'hidden' }}>
      {showText && (
        <div className="absolute flex flex-col" style={getTextPosition()}>
          <div
            className="rounded-sm mb-0.5"
            style={{
              width: '24px',
              height: '3px',
              backgroundColor: accentColor,
            }}
          />
          <div
            className="rounded-sm opacity-60"
            style={{
              width: '16px',
              height: '2px',
              backgroundColor: accentColor,
            }}
          />
        </div>
      )}
      
      <div style={phoneStyle} />
      
      {layout.phoneCount === 2 && layout.secondPhonePosition && (
        <div
          style={{
            position: 'absolute',
            left: `${layout.secondPhonePosition.x}%`,
            top: `${layout.secondPhonePosition.y}%`,
            transform: `translate(-50%, -50%) scale(${layout.secondPhonePosition.scale}) rotate(${secondRotation}deg)`,
            width: '24%',
            height: '45%',
            backgroundColor: phoneColor,
            borderRadius: '3px',
            opacity: 0.7,
            boxShadow: secondRotation !== 0 ? '0 2px 4px rgba(0,0,0,0.3)' : undefined,
          }}
        />
      )}
      
      {layout.showFeaturePills && layout.featurePillPositions && (
        <>
          {layout.featurePillPositions.slice(0, 3).map((pos, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
                width: '20%',
                height: '6%',
                opacity: 0.8,
              }}
            />
          ))}
        </>
      )}
      
      {layout.showStats && layout.statPositions && (
        <>
          {layout.statPositions.slice(0, 3).map((pos, i) => (
            <div
              key={i}
              className="absolute flex items-center justify-center"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="flex items-center gap-0.5">
                <div className="w-1.5 h-3 text-white/50">〈</div>
                <div className="text-[6px] font-bold text-white/80">★</div>
                <div className="w-1.5 h-3 text-white/50">〉</div>
              </div>
            </div>
          ))}
        </>
      )}
      
      {layout.decorations && !layout.showFeaturePills && !layout.showStats && (
        <>
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white/10" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-white/10" />
        </>
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
      <div className="grid grid-cols-3 gap-2">
        {layoutTemplates.map(layout => {
          const isSelected = selectedLayout === layout.id;
          const hasRotation = (layout.phonePosition.rotation || 0) !== 0 || 
                              (layout.secondPhonePosition?.rotation || 0) !== 0;
          return (
            <button
              key={layout.id}
              onClick={() => onChange(layout.id)}
              disabled={disabled}
              className={`relative aspect-[9/16] rounded-lg transition-all ${
                hasRotation ? '' : 'overflow-hidden'
              } ${
                isSelected
                  ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900'
                  : 'hover:ring-1 hover:ring-gray-600'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={layout.description}
            >
              <LayoutThumbnail layout={layout} isSelected={isSelected} />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-1 py-1 rounded-b-lg">
                <span className="text-[8px] font-medium text-white leading-tight block truncate">{layout.name}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LayoutSelector;
