import { deviceFrames, getDeviceById } from '../../data/deviceFrames';

interface DeviceSelectorProps {
  selectedDevice: string;
  onChange: (deviceId: string) => void;
  disabled?: boolean;
}

// Group devices by manufacturer/series for better organization
const deviceGroups = [
  // iOS
  { label: 'iPhone 16 Series', ids: ['iphone-16-pro-max', 'iphone-16-pro', 'iphone-16'] },
  { label: 'iPhone 15 Series', ids: ['iphone-15-pro-max', 'iphone-15-pro', 'iphone-15'] },
  { label: 'iPhone 14 Series', ids: ['iphone-14-pro-max', 'iphone-14-pro', 'iphone-14'] },
  { label: 'iPhone 13 Series', ids: ['iphone-13-pro-max', 'iphone-13', 'iphone-13-mini'] },
  { label: 'iPhone SE', ids: ['iphone-se'] },
  // Android
  { label: 'Samsung S24', ids: ['samsung-s24-ultra', 'samsung-s24-plus', 'samsung-s24'] },
  { label: 'Samsung S23', ids: ['samsung-s23-ultra', 'samsung-s23'] },
  { label: 'Samsung A Series', ids: ['samsung-a54'] },
  { label: 'Pixel 9', ids: ['pixel-9-pro-xl', 'pixel-9-pro', 'pixel-9'] },
  { label: 'Pixel 8', ids: ['pixel-8-pro', 'pixel-8'] },
  { label: 'OnePlus', ids: ['oneplus-12', 'oneplus-11'] },
  { label: 'Xiaomi', ids: ['xiaomi-14-ultra', 'xiaomi-14'] },
  { label: 'Other', ids: ['generic-android', 'no-frame'] },
];

export function DeviceSelector({ selectedDevice, onChange, disabled }: DeviceSelectorProps) {
  const selectedDeviceInfo = getDeviceById(selectedDevice);

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        Device Frame
      </h3>
      
      <div className="space-y-3">
        {/* Current selection display */}
        <div className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg">
          <div className="relative w-6 h-10 rounded-md border-2 border-blue-500 bg-blue-500/20 flex items-center justify-center">
            {selectedDeviceInfo?.notchType === 'dynamic-island' && (
              <div className="absolute top-1 w-2.5 h-0.5 rounded-full bg-blue-400" />
            )}
            {selectedDeviceInfo?.notchType === 'notch' && (
              <div className="absolute top-0 w-3 h-1 rounded-b bg-blue-400" />
            )}
            {selectedDeviceInfo?.notchType === 'punch-hole' && (
              <div className="absolute top-0.5 w-1.5 h-1.5 rounded-full bg-blue-400" />
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-white">{selectedDeviceInfo?.name || 'Select Device'}</div>
            <div className="text-[10px] text-gray-500 uppercase">{selectedDeviceInfo?.type || ''}</div>
          </div>
        </div>

        {/* Single dropdown with all devices */}
        <select
          value={selectedDevice}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {deviceGroups.map(group => (
            <optgroup key={group.label} label={group.label}>
              {group.ids.map(id => {
                const device = deviceFrames.find(d => d.id === id);
                return device ? (
                  <option key={id} value={id}>{device.name}</option>
                ) : null;
              })}
            </optgroup>
          ))}
        </select>
      </div>
    </div>
  );
}

export default DeviceSelector;
