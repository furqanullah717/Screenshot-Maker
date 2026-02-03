import { ImageTransform } from '../../hooks/useScreenshots';

interface ImageControlsProps {
  imageTransform: ImageTransform;
  hasImage: boolean;
  onChange: (transform: ImageTransform) => void;
  onImageUpload: (file: File) => void;
  onImageRemove: () => void;
  disabled?: boolean;
}

export function ImageControls({
  imageTransform,
  hasImage,
  onChange,
  onImageUpload,
  onImageRemove,
  disabled,
}: ImageControlsProps) {
  const updateTransform = (updates: Partial<ImageTransform>) => {
    onChange({ ...imageTransform, ...updates });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  const handleReset = () => {
    onChange({ zoom: 1, x: 0, y: 0 });
  };

  return (
    <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        Screenshot Image
      </h3>

      <div className="space-y-4">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative"
        >
          <label className="block cursor-pointer">
            <div className={`px-4 py-4 rounded-lg text-sm font-medium text-center transition-colors border-2 border-dashed ${
              hasImage 
                ? 'border-green-600/50 bg-green-900/20 hover:bg-green-900/30' 
                : 'border-gray-600 bg-gray-800 hover:bg-gray-700 hover:border-gray-500'
            }`}>
              <svg
                className="w-8 h-8 mx-auto mb-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-gray-300">
                {hasImage ? 'Replace Image' : 'Upload Image'}
              </span>
              <p className="text-[10px] text-gray-500 mt-1">
                Click or drag & drop
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {hasImage && (
          <>
            <button
              onClick={onImageRemove}
              className="w-full px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-xs font-medium transition-colors"
            >
              Remove Image
            </button>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-gray-500">
                  Zoom: {(imageTransform.zoom * 100).toFixed(0)}%
                </label>
                <button
                  onClick={handleReset}
                  className="text-[10px] text-blue-400 hover:text-blue-300"
                >
                  Reset
                </button>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.05"
                value={imageTransform.zoom}
                onChange={(e) => updateTransform({ zoom: parseFloat(e.target.value) })}
                className="w-full accent-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 flex justify-between">
                  <span>Offset X</span>
                  <span>{imageTransform.x}px</span>
                </label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={imageTransform.x}
                  onChange={(e) => updateTransform({ x: parseInt(e.target.value) })}
                  className="w-full accent-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 flex justify-between">
                  <span>Offset Y</span>
                  <span>{imageTransform.y}px</span>
                </label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={imageTransform.y}
                  onChange={(e) => updateTransform({ y: parseInt(e.target.value) })}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ImageControls;
