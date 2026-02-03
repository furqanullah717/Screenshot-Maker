import { deviceFrames, DeviceFrame } from '../../data/deviceFrames';

interface DeviceSelectorProps {
  selectedDevice: string;
  onChange: (deviceId: string) => void;
  disabled?: boolean;
}

function DeviceIcon({ device, isSelected }: { device: DeviceFrame; isSelected: boolean }) {
  const baseColor = isSelected ? 'border-blue-500' : 'border-gray-500';
  const bgColor = isSelected ? 'bg-blue-500/20' : 'bg-gray-700';
  
  return (
    <div className={`relative w-5 h-8 rounded-md border-2 ${baseColor} ${bgColor} flex items-center justify-center`}>
      {device.notchType === 'dynamic-island' && (
        <div className="absolute top-1 w-2 h-0.5 rounded-full bg-current opacity-60" />
      )}
      {device.notchType === 'notch' && (
        <div className="absolute top-0 w-2.5 h-1 rounded-b bg-current opacity-60" />
      )}
      {device.notchType === 'punch-hole' && (
        <div className="absolute top-0.5 w-1 h-1 rounded-full bg-current opacity-60" />
      )}
    </div>
  );
}

export function DeviceSelector({ selectedDevice, onChange, disabled }: DeviceSelectorProps) {
  const iosDevices = deviceFrames.filter(d => d.type === 'ios');
  const androidDevices = deviceFrames.filter(d => d.type === 'android');

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        Device Frame
      </h3>
      
      <div className="space-y-4">
        <div>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">iOS</span>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {iosDevices.map(device => {
              const isSelected = selectedDevice === device.id;
              return (
                <button
                  key={device.id}
                  onClick={() => onChange(device.id)}
                  disabled={disabled}
                  className={`p-2 rounded-lg text-xs font-medium text-left transition-colors flex items-center gap-2 ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <DeviceIcon device={device} isSelected={isSelected} />
                  <span className="truncate">{device.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Android</span>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {androidDevices.map(device => {
              const isSelected = selectedDevice === device.id;
              return (
                <button
                  key={device.id}
                  onClick={() => onChange(device.id)}
                  disabled={disabled}
                  className={`p-2 rounded-lg text-xs font-medium text-left transition-colors flex items-center gap-2 ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <DeviceIcon device={device} isSelected={isSelected} />
                  <span className="truncate">{device.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeviceSelector;
