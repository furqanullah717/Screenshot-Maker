import { TextStyleConfig } from '../../hooks/useScreenshots';

interface FontControlsProps {
  textStyle: TextStyleConfig;
  onChange: (textStyle: TextStyleConfig) => void;
  disabled?: boolean;
}

const fontFamilies = [
  { id: 'inter', name: 'Inter', value: 'Inter, system-ui, sans-serif' },
  { id: 'sf-pro', name: 'SF Pro', value: '-apple-system, BlinkMacSystemFont, sans-serif' },
  { id: 'roboto', name: 'Roboto', value: 'Roboto, sans-serif' },
  { id: 'poppins', name: 'Poppins', value: 'Poppins, sans-serif' },
  { id: 'montserrat', name: 'Montserrat', value: 'Montserrat, sans-serif' },
  { id: 'open-sans', name: 'Open Sans', value: 'Open Sans, sans-serif' },
  { id: 'lato', name: 'Lato', value: 'Lato, sans-serif' },
  { id: 'playfair', name: 'Playfair', value: 'Playfair Display, serif' },
];

const fontWeights = [
  { value: 400, name: 'Regular' },
  { value: 500, name: 'Medium' },
  { value: 600, name: 'Semibold' },
  { value: 700, name: 'Bold' },
  { value: 800, name: 'Extra Bold' },
];

const textColors = [
  '#ffffff',
  '#f8fafc',
  '#e2e8f0',
  '#000000',
  '#1e293b',
  '#fbbf24',
  '#34d399',
  '#60a5fa',
];

export function FontControls({ textStyle, onChange, disabled }: FontControlsProps) {
  const updateStyle = (updates: Partial<TextStyleConfig>) => {
    onChange({ ...textStyle, ...updates });
  };

  return (
    <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        Typography
      </h3>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Font Family</label>
          <select
            value={textStyle.fontFamily}
            onChange={(e) => updateStyle({ fontFamily: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {fontFamilies.map(font => (
              <option key={font.id} value={font.value}>
                {font.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Font Weight</label>
          <div className="flex gap-1">
            {fontWeights.map(weight => (
              <button
                key={weight.value}
                onClick={() => updateStyle({ fontWeight: weight.value })}
                className={`flex-1 py-1.5 text-[10px] font-medium rounded transition-colors ${
                  textStyle.fontWeight === weight.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
                title={weight.name}
              >
                {weight.value}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 flex justify-between">
              <span>Title Size</span>
              <span>{textStyle.titleSize}px</span>
            </label>
            <input
              type="range"
              min="20"
              max="56"
              value={textStyle.titleSize}
              onChange={(e) => updateStyle({ titleSize: parseInt(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 flex justify-between">
              <span>Subtitle</span>
              <span>{textStyle.subtitleSize}px</span>
            </label>
            <input
              type="range"
              min="12"
              max="28"
              value={textStyle.subtitleSize}
              onChange={(e) => updateStyle({ subtitleSize: parseInt(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-2 block">Text Color</label>
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              {textColors.map(color => (
                <button
                  key={color}
                  onClick={() => updateStyle({ color })}
                  className={`w-6 h-6 rounded-full transition-all ${
                    textStyle.color === color
                      ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-gray-900'
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <input
              type="color"
              value={textStyle.color}
              onChange={(e) => updateStyle({ color: e.target.value })}
              className="w-6 h-6 rounded cursor-pointer bg-transparent"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={textStyle.shadowEnabled}
              onChange={(e) => updateStyle({ shadowEnabled: e.target.checked })}
              className="w-4 h-4 rounded bg-gray-800 border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs text-gray-400">Text Shadow</span>
          </label>
          
          {textStyle.shadowEnabled && (
            <div className="mt-2 pl-6 space-y-2">
              <div>
                <label className="text-xs text-gray-500 mb-1 flex justify-between">
                  <span>Blur</span>
                  <span>{textStyle.shadowBlur}px</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={textStyle.shadowBlur}
                  onChange={(e) => updateStyle({ shadowBlur: parseInt(e.target.value) })}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FontControls;
