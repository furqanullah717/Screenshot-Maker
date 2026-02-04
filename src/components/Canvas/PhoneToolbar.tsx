import { useRef } from 'react';
import { PhoneConfig, ImageTransform, PhoneTransform } from '../../hooks/useScreenshots';
import { deviceFrames } from '../../data/deviceFrames';

interface PhoneToolbarProps {
  phoneConfig: PhoneConfig;
  phoneIndex: number;
  onUpdate: (updates: Partial<PhoneConfig>) => void;
  onImageUpload: (file: File) => void;
  onClose: () => void;
}

export function PhoneToolbar({
  phoneConfig,
  phoneIndex,
  onUpdate,
  onImageUpload,
  onClose,
}: PhoneToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
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

  const resetImageTransform = () => {
    onUpdate({
      imageTransform: { zoom: 1, x: 0, y: 0 },
    });
  };

  const resetPhoneTransform = () => {
    onUpdate({
      phoneTransform: { x: 0, y: 0, scale: 1, rotation: 0 },
    });
  };

  const hasImage = !!phoneConfig.image;

  return (
    <div
      className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl p-4 min-w-[320px]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
            {phoneIndex + 1}
          </div>
          <span className="text-sm font-semibold text-white">Phone {phoneIndex + 1}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-700 rounded-md transition-colors"
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <label className="block cursor-pointer">
            <div className={`px-3 py-2.5 rounded-lg text-xs font-medium text-center transition-colors border-2 border-dashed flex items-center justify-center gap-2 ${
              hasImage 
                ? 'border-green-600/50 bg-green-900/20 hover:bg-green-900/30' 
                : 'border-gray-600 bg-gray-800 hover:bg-gray-700 hover:border-gray-500'
            }`}>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-300">
                {hasImage ? 'Replace Image' : 'Upload Image'}
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 block">
            Device Frame
          </label>
          <select
            value={phoneConfig.deviceFrame}
            onChange={(e) => onUpdate({ deviceFrame: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {deviceFrames.map(device => (
              <option key={device.id} value={device.id}>
                {device.name}
              </option>
            ))}
          </select>
        </div>

        <div className="border-t border-gray-700 pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Phone Position</span>
            <button
              onClick={resetPhoneTransform}
              className="text-[10px] text-blue-400 hover:text-blue-300"
            >
              Reset
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-500 flex justify-between mb-0.5">
                <span>X</span>
                <span>{phoneConfig.phoneTransform.x}%</span>
              </label>
              <input
                type="range"
                min="-50"
                max="50"
                step="1"
                value={phoneConfig.phoneTransform.x}
                onChange={(e) => updatePhoneTransform({ x: parseInt(e.target.value) })}
                className="w-full accent-blue-500 h-1"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 flex justify-between mb-0.5">
                <span>Y</span>
                <span>{phoneConfig.phoneTransform.y}%</span>
              </label>
              <input
                type="range"
                min="-50"
                max="50"
                step="1"
                value={phoneConfig.phoneTransform.y}
                onChange={(e) => updatePhoneTransform({ y: parseInt(e.target.value) })}
                className="w-full accent-blue-500 h-1"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 flex justify-between mb-0.5">
                <span>Scale</span>
                <span>{Math.round(phoneConfig.phoneTransform.scale * 100)}%</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={phoneConfig.phoneTransform.scale}
                onChange={(e) => updatePhoneTransform({ scale: parseFloat(e.target.value) })}
                className="w-full accent-blue-500 h-1"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 flex justify-between mb-0.5">
                <span>Rotation</span>
                <span>{phoneConfig.phoneTransform.rotation}°</span>
              </label>
              <input
                type="range"
                min="-30"
                max="30"
                step="1"
                value={phoneConfig.phoneTransform.rotation}
                onChange={(e) => updatePhoneTransform({ rotation: parseInt(e.target.value) })}
                className="w-full accent-blue-500 h-1"
              />
            </div>
          </div>
        </div>

        {hasImage && (
          <div className="border-t border-gray-700 pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Image Zoom & Pan</span>
              <button
                onClick={resetImageTransform}
                className="text-[10px] text-blue-400 hover:text-blue-300"
              >
                Reset
              </button>
            </div>
            
            <div className="space-y-2">
              <div>
                <label className="text-[10px] text-gray-500 flex justify-between mb-0.5">
                  <span>Zoom</span>
                  <span>{Math.round(phoneConfig.imageTransform.zoom * 100)}%</span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.05"
                  value={phoneConfig.imageTransform.zoom}
                  onChange={(e) => updateImageTransform({ zoom: parseFloat(e.target.value) })}
                  className="w-full accent-blue-500 h-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-gray-500 flex justify-between mb-0.5">
                    <span>Pan X</span>
                    <span>{phoneConfig.imageTransform.x}px</span>
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={phoneConfig.imageTransform.x}
                    onChange={(e) => updateImageTransform({ x: parseInt(e.target.value) })}
                    className="w-full accent-blue-500 h-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 flex justify-between mb-0.5">
                    <span>Pan Y</span>
                    <span>{phoneConfig.imageTransform.y}px</span>
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={phoneConfig.imageTransform.y}
                    onChange={(e) => updateImageTransform({ y: parseInt(e.target.value) })}
                    className="w-full accent-blue-500 h-1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {hasImage && (
          <button
            onClick={() => onUpdate({ image: null })}
            className="w-full px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-xs font-medium transition-colors"
          >
            Remove Image
          </button>
        )}
      </div>
    </div>
  );
}

export default PhoneToolbar;
