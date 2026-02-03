import { useState } from 'react';
import { 
  BackgroundConfig, 
  gradientPresets, 
  solidColors, 
  createGradientCSS 
} from '../../data/gradientPresets';

interface ColorPickerProps {
  background: BackgroundConfig;
  onChange: (background: BackgroundConfig) => void;
  disabled?: boolean;
}

type TabType = 'gradient' | 'solid';

export function ColorPicker({ background, onChange, disabled }: ColorPickerProps) {
  const [activeTab, setActiveTab] = useState<TabType>(background.type);

  const handleGradientSelect = (preset: typeof gradientPresets[0]) => {
    onChange({
      ...background,
      type: 'gradient',
      gradientColors: preset.colors,
      gradientAngle: preset.angle,
    });
  };

  const handleSolidSelect = (color: string) => {
    onChange({
      ...background,
      type: 'solid',
      solidColor: color,
    });
  };

  const handleAngleChange = (angle: number) => {
    onChange({
      ...background,
      gradientAngle: angle,
    });
  };

  const handleCustomColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeTab === 'solid') {
      handleSolidSelect(e.target.value);
    }
  };

  return (
    <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        Background
      </h3>

      <div className="flex gap-1 mb-3">
        <button
          onClick={() => setActiveTab('gradient')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'gradient'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Gradient
        </button>
        <button
          onClick={() => setActiveTab('solid')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'solid'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Solid
        </button>
      </div>

      {activeTab === 'gradient' ? (
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-1.5">
            {gradientPresets.map(preset => {
              const isSelected = 
                background.type === 'gradient' &&
                JSON.stringify(background.gradientColors) === JSON.stringify(preset.colors);
              return (
                <button
                  key={preset.id}
                  onClick={() => handleGradientSelect(preset)}
                  className={`aspect-square rounded-lg transition-all ${
                    isSelected ? 'ring-2 ring-white ring-offset-1 ring-offset-gray-900' : 'hover:scale-110'
                  }`}
                  style={{ background: createGradientCSS(preset.colors, preset.angle) }}
                  title={preset.name}
                />
              );
            })}
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 flex justify-between">
              <span>Angle</span>
              <span>{background.gradientAngle}°</span>
            </label>
            <input
              type="range"
              min="0"
              max="360"
              step="15"
              value={background.gradientAngle}
              onChange={(e) => handleAngleChange(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-7 gap-1.5">
            {solidColors.map(color => {
              const isSelected = background.type === 'solid' && background.solidColor === color.color;
              return (
                <button
                  key={color.id}
                  onClick={() => handleSolidSelect(color.color)}
                  className={`aspect-square rounded-lg transition-all ${
                    isSelected ? 'ring-2 ring-white ring-offset-1 ring-offset-gray-900' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.color }}
                  title={color.name}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Custom:</label>
            <input
              type="color"
              value={background.solidColor}
              onChange={handleCustomColor}
              className="w-8 h-8 rounded cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={background.solidColor}
              onChange={(e) => handleSolidSelect(e.target.value)}
              className="flex-1 px-2 py-1 bg-gray-800 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="#000000"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ColorPicker;
