import { FeaturePillData, PairedPosition, ElementPosition } from '../../hooks/useScreenshots';

interface FeaturePillsEditorProps {
  pills: FeaturePillData[];
  onChange: (pills: FeaturePillData[]) => void;
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
  disabled?: boolean;
  isPairedLayout?: boolean;
  position?: PairedPosition;
  onPositionChange?: (position: PairedPosition) => void;
  offset?: ElementPosition;
  onOffsetChange?: (offset: ElementPosition) => void;
}

const iconOptions = [
  { id: 'star', label: 'Star' },
  { id: 'heart', label: 'Heart' },
  { id: 'code', label: 'Code' },
  { id: 'palette', label: 'Palette' },
  { id: 'music', label: 'Music' },
  { id: 'video', label: 'Video' },
];

const defaultPills: FeaturePillData[] = [
  { text: 'Feature 1', icon: 'star' },
  { text: 'Feature 2', icon: 'heart' },
  { text: 'Feature 3', icon: 'code' },
  { text: 'Feature 4', icon: 'palette' },
];

export function FeaturePillsEditor({ 
  pills: propPills, 
  onChange, 
  enabled = true, 
  onToggle, 
  disabled,
  isPairedLayout,
  position = 'first',
  onPositionChange,
  offset = { x: 0, y: 0, scale: 1 },
  onOffsetChange,
}: FeaturePillsEditorProps) {
  const pills = propPills || defaultPills;
  
  const updatePill = (index: number, updates: Partial<FeaturePillData>) => {
    const newPills = [...pills];
    newPills[index] = { ...newPills[index], ...updates };
    onChange(newPills);
  };

  const addPill = () => {
    onChange([...pills, { text: `Feature ${pills.length + 1}`, icon: 'star' }]);
  };

  const removePill = (index: number) => {
    const newPills = pills.filter((_, i) => i !== index);
    onChange(newPills);
  };

  return (
    <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Feature Pills
        </h3>
        {onToggle && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => onToggle(e.target.checked)}
              className="w-4 h-4 rounded bg-gray-800 border-gray-600 text-blue-600"
            />
            <span className="text-[10px] text-gray-500">Show</span>
          </label>
        )}
      </div>
      
      {isPairedLayout && onPositionChange && enabled && (
        <div className="mb-3">
          <label className="text-[10px] text-gray-500 block mb-1">Show on</label>
          <div className="flex gap-1">
            {(['first', 'second', 'both'] as PairedPosition[]).map((pos) => (
              <button
                key={pos}
                onClick={() => onPositionChange(pos)}
                className={`flex-1 py-1.5 px-2 rounded text-xs capitalize transition-colors ${
                  position === pos
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {pos === 'first' ? '1st' : pos === 'second' ? '2nd' : 'Both'}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {enabled && onOffsetChange && (
        <div className="mb-3 space-y-2 p-2 bg-gray-800/50 rounded">
          <label className="text-[10px] text-gray-500 block">Position & Size</label>
          <div className="flex gap-2 items-center">
            <span className="text-[10px] text-gray-500 w-6">X</span>
            <input
              type="range"
              min="-30"
              max="30"
              step="1"
              value={offset.x}
              onChange={(e) => onOffsetChange({ ...offset, x: Number(e.target.value) })}
              className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[10px] text-gray-400 w-8 text-right">{offset.x}%</span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-[10px] text-gray-500 w-6">Y</span>
            <input
              type="range"
              min="-30"
              max="30"
              step="1"
              value={offset.y}
              onChange={(e) => onOffsetChange({ ...offset, y: Number(e.target.value) })}
              className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[10px] text-gray-400 w-8 text-right">{offset.y}%</span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-[10px] text-gray-500 w-6">Size</span>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={offset.scale}
              onChange={(e) => onOffsetChange({ ...offset, scale: Number(e.target.value) })}
              className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[10px] text-gray-400 w-8 text-right">{Math.round(offset.scale * 100)}%</span>
          </div>
          <button
            onClick={() => onOffsetChange({ x: 0, y: 0, scale: 1 })}
            className="w-full py-1 text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
          >
            Reset Position
          </button>
        </div>
      )}
      
      <div className={`space-y-3 ${!enabled ? 'opacity-50 pointer-events-none' : ''}`}>
        {pills.map((pill, index) => (
          <div key={index} className="flex gap-2">
            <select
              value={pill.icon || 'star'}
              onChange={(e) => updatePill(index, { icon: e.target.value })}
              className="w-20 px-2 py-1.5 bg-gray-800 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {iconOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
            <input
              type="text"
              value={pill.text}
              onChange={(e) => updatePill(index, { text: e.target.value })}
              className="flex-1 px-2 py-1.5 bg-gray-800 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Feature name..."
            />
            <button
              onClick={() => removePill(index)}
              className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        
        <button
          onClick={addPill}
          className="w-full py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Feature
        </button>
      </div>
    </div>
  );
}

export default FeaturePillsEditor;
