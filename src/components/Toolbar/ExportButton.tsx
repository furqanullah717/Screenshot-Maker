import { useState } from 'react';
import { ExportSize, ExportFormat, exportSizes } from '../../data/exportSizes';

interface ExportButtonProps {
  onExport: (size: ExportSize, format: ExportFormat, quality: number) => Promise<void>;
  onExportAll: (size: ExportSize, format: ExportFormat, quality: number) => Promise<void>;
  screenshotCount: number;
  disabled?: boolean;
}

export function ExportButton({ onExport, onExportAll, screenshotCount, disabled }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSize] = useState<ExportSize>(exportSizes[0]);
  const [format, setFormat] = useState<ExportFormat>('png');
  const [quality, setQuality] = useState(0.92);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCurrent = async () => {
    setIsExporting(true);
    try {
      await onExport(selectedSize, format, quality);
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      await onExportAll(selectedSize, format, quality);
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || isExporting}
        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
          disabled || isExporting
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {isExporting ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Exporting...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-50 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-sm font-semibold text-white mb-3">Export Settings</h3>
              
              <div className="space-y-4">
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Pixel-perfect export at canvas dimensions</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 ml-6">
                    Size is determined by the platform selector in the toolbar
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Format</label>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setFormat('png')}
                        className={`flex-1 py-1.5 text-xs rounded transition-colors ${
                          format === 'png'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        PNG
                      </button>
                      <button
                        onClick={() => setFormat('jpeg')}
                        className={`flex-1 py-1.5 text-xs rounded transition-colors ${
                          format === 'jpeg'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        JPEG
                      </button>
                    </div>
                  </div>

                  {format === 'jpeg' && (
                    <div>
                      <label className="text-xs text-gray-400 mb-1 flex justify-between">
                        <span>Quality</span>
                        <span>{Math.round(quality * 100)}%</span>
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="1"
                        step="0.05"
                        value={quality}
                        onChange={(e) => setQuality(parseFloat(e.target.value))}
                        className="w-full accent-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-850 flex gap-2">
              <button
                onClick={handleExportCurrent}
                disabled={isExporting}
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                Export Current
              </button>
              {screenshotCount > 1 && (
                <button
                  onClick={handleExportAll}
                  disabled={isExporting}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Export All ({screenshotCount})
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ExportButton;
