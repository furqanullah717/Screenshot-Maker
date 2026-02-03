import { TextTransform } from '../../hooks/useScreenshots';

interface TextControlsProps {
  transform: TextTransform;
  onChange: (transform: TextTransform) => void;
  disabled?: boolean;
}

export function TextControls({ 
  transform,
  onChange,
  disabled 
}: TextControlsProps) {
  const handleReset = () => {
    onChange({ x: 0, y: 0, scale: 1 });
  };

  return (
    <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Text Position
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
            min="0.5"
            max="1.5"
            step="0.05"
            value={transform.scale}
            onChange={(e) => onChange({ ...transform, scale: parseFloat(e.target.value) })}
            className="w-full accent-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

export default TextControls;
