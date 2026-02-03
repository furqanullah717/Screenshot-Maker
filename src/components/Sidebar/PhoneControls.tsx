import { PhoneTransform } from '../../hooks/useScreenshots';

interface PhoneControlsProps {
  transform: PhoneTransform;
  onChange: (transform: PhoneTransform) => void;
  disabled?: boolean;
}

export function PhoneControls({ 
  transform,
  onChange,
  disabled 
}: PhoneControlsProps) {
  const handleReset = () => {
    onChange({ x: 0, y: 0, scale: 1, rotation: 0 });
  };

  return (
    <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Phone Position
        </h3>
        <button
          onClick={handleReset}
          className="text-[10px] text-blue-400 hover:text-blue-300"
        >
          Reset
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 flex justify-between">
            <span>Horizontal (X)</span>
            <span>{transform.x}%</span>
          </label>
          <input
            type="range"
            min="-50"
            max="50"
            step="1"
            value={transform.x}
            onChange={(e) => onChange({ ...transform, x: parseInt(e.target.value) })}
            className="w-full accent-blue-500"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 flex justify-between">
            <span>Vertical (Y)</span>
            <span>{transform.y}%</span>
          </label>
          <input
            type="range"
            min="-50"
            max="50"
            step="1"
            value={transform.y}
            onChange={(e) => onChange({ ...transform, y: parseInt(e.target.value) })}
            className="w-full accent-blue-500"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 flex justify-between">
            <span>Size</span>
            <span>{Math.round(transform.scale * 100)}%</span>
          </label>
          <input
            type="range"
            min="0.3"
            max="1.5"
            step="0.05"
            value={transform.scale}
            onChange={(e) => onChange({ ...transform, scale: parseFloat(e.target.value) })}
            className="w-full accent-blue-500"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 flex justify-between">
            <span>Rotation</span>
            <span>{transform.rotation}°</span>
          </label>
          <input
            type="range"
            min="-30"
            max="30"
            step="1"
            value={transform.rotation}
            onChange={(e) => onChange({ ...transform, rotation: parseInt(e.target.value) })}
            className="w-full accent-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

export default PhoneControls;
