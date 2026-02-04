import { useRef } from 'react';
import { PhoneConfig, ImageTransform, PhoneTransform } from '../../hooks/useScreenshots';

interface PhoneControlBarProps {
  phoneConfig: PhoneConfig;
  phoneIndex: number;
  onUpdate: (updates: Partial<PhoneConfig>) => void;
  onImageUpload: (file: File) => void;
  onClose: () => void;
}

export function PhoneControlBar({
  phoneConfig,
  phoneIndex,
  onUpdate,
  onImageUpload,
  onClose,
}: PhoneControlBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
    e.target.value = '';
  };

  const updateImageTransform = (updates: Partial<ImageTransform>) => {
    onUpdate({
      imageTransform: { ...phoneConfig.imageTransform, ...updates },
    });
  };

  const updatePhoneTransform = (updates: Partial<PhoneTransform>) => {
    onUpdate({
      phoneTransform: { ...phoneConfig.phoneTransform, ...updates },
    });
  };

  const resetAll = () => {
    onUpdate({
      imageTransform: { zoom: 1, x: 0, y: 0 },
      phoneTransform: { x: 0, y: 0, scale: 1, rotation: 0 },
    });
  };

  const hasImage = !!phoneConfig.image;

  return (
    <div className="bg-gray-900 border-b border-gray-700 px-4 py-2">
      {/* Row 1: Phone indicator, Image upload, Phone position controls */}
      <div className="flex items-center gap-4 mb-2">
        {/* Phone indicator */}
        <div className="flex items-center gap-2 pr-4 border-r border-gray-700">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
            {phoneIndex + 1}
          </div>
          <span className="text-sm font-medium text-white whitespace-nowrap">Phone {phoneIndex + 1}</span>
        </div>

        {/* Image upload */}
        <div className="flex items-center gap-2 pr-4 border-r border-gray-700">
          <label className="cursor-pointer">
            <div className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              hasImage 
                ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {hasImage ? 'Replace' : 'Upload'}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {hasImage && (
            <button
              onClick={() => onUpdate({ image: null })}
              className="p-1.5 rounded-md bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
              title="Remove image"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>

        {/* Phone Position X */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Position X</span>
          <input
            type="range"
            min="-50"
            max="50"
            step="1"
            value={phoneConfig.phoneTransform.x}
            onChange={(e) => updatePhoneTransform({ x: parseInt(e.target.value) })}
            className="w-24 accent-blue-500 h-1"
          />
          <span className="text-[10px] text-gray-500 w-8">{phoneConfig.phoneTransform.x}%</span>
        </div>

        {/* Phone Position Y */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Position Y</span>
          <input
            type="range"
            min="-50"
            max="50"
            step="1"
            value={phoneConfig.phoneTransform.y}
            onChange={(e) => updatePhoneTransform({ y: parseInt(e.target.value) })}
            className="w-24 accent-blue-500 h-1"
          />
          <span className="text-[10px] text-gray-500 w-8">{phoneConfig.phoneTransform.y}%</span>
        </div>

        {/* Rotation */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Rotate</span>
          <input
            type="range"
            min="-30"
            max="30"
            step="1"
            value={phoneConfig.phoneTransform.rotation}
            onChange={(e) => updatePhoneTransform({ rotation: parseInt(e.target.value) })}
            className="w-24 accent-blue-500 h-1"
          />
          <span className="text-[10px] text-gray-500 w-8">{phoneConfig.phoneTransform.rotation}°</span>
        </div>

        {/* Scale */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Scale</span>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.05"
            value={phoneConfig.phoneTransform.scale}
            onChange={(e) => updatePhoneTransform({ scale: parseFloat(e.target.value) })}
            className="w-24 accent-blue-500 h-1"
          />
          <span className="text-[10px] text-gray-500 w-10">{Math.round(phoneConfig.phoneTransform.scale * 100)}%</span>
        </div>

        {/* Reset & Close - always on right */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={resetAll}
            className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white transition-colors"
            title="Deselect phone"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Row 2: Image controls (only shown when image exists) */}
      {hasImage && (
        <div className="flex items-center gap-4 pt-2 border-t border-gray-800">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Image Controls</span>
          
          {/* Zoom */}
          <div className="flex items-center gap-2 pl-2">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Zoom</span>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.05"
              value={phoneConfig.imageTransform.zoom}
              onChange={(e) => updateImageTransform({ zoom: parseFloat(e.target.value) })}
              className="w-24 accent-green-500 h-1"
            />
            <span className="text-[10px] text-gray-500 w-10">{Math.round(phoneConfig.imageTransform.zoom * 100)}%</span>
          </div>

          {/* Pan X */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Pan X</span>
            <input
              type="range"
              min="-100"
              max="100"
              value={phoneConfig.imageTransform.x}
              onChange={(e) => updateImageTransform({ x: parseInt(e.target.value) })}
              className="w-24 accent-green-500 h-1"
            />
            <span className="text-[10px] text-gray-500 w-10">{phoneConfig.imageTransform.x}px</span>
          </div>

          {/* Pan Y */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Pan Y</span>
            <input
              type="range"
              min="-100"
              max="100"
              value={phoneConfig.imageTransform.y}
              onChange={(e) => updateImageTransform({ y: parseInt(e.target.value) })}
              className="w-24 accent-green-500 h-1"
            />
            <span className="text-[10px] text-gray-500 w-10">{phoneConfig.imageTransform.y}px</span>
          </div>

          {/* Reset image transform */}
          <button
            onClick={() => updateImageTransform({ zoom: 1, x: 0, y: 0 })}
            className="px-2 py-1 rounded-md text-[10px] font-medium bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300 transition-colors"
          >
            Reset Image
          </button>
        </div>
      )}
    </div>
  );
}

export default PhoneControlBar;
