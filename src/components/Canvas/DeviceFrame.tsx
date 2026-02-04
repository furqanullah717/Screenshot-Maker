import { DeviceFrame as DeviceFrameType, getDeviceById } from '../../data/deviceFrames';
import { ImageTransform } from '../../hooks/useScreenshots';

interface DeviceFrameProps {
  deviceId: string;
  screenshot: string | null;
  imageTransform: ImageTransform;
  scale?: number;
  className?: string;
  isSelected?: boolean;
  phoneIndex?: number;
  onClick?: (phoneIndex: number) => void;
}

interface DynamicIslandProps {
  width: number;
  height: number;
}

function DynamicIsland({ width, height }: DynamicIslandProps) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 bg-black rounded-full z-20"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        top: '12px',
      }}
    />
  );
}

interface NotchProps {
  width: number;
  height: number;
}

function Notch({ width, height }: NotchProps) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 bg-black z-20"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        top: '0',
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px',
      }}
    />
  );
}

interface PunchHoleProps {
  size: number;
}

function PunchHole({ size }: PunchHoleProps) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 bg-black rounded-full z-20"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top: '10px',
      }}
    />
  );
}

interface HomeButtonProps {
  visible: boolean;
}

function HomeButton({ visible }: HomeButtonProps) {
  if (!visible) return null;
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 bottom-2 rounded-full border-2 border-gray-600 z-20"
      style={{
        width: '40px',
        height: '40px',
      }}
    />
  );
}

function renderNotchElement(device: DeviceFrameType) {
  switch (device.notchType) {
    case 'dynamic-island':
      return (
        <DynamicIsland
          width={device.notchWidth || 126}
          height={device.notchHeight || 37}
        />
      );
    case 'notch':
      return (
        <Notch
          width={device.notchWidth || 150}
          height={device.notchHeight || 34}
        />
      );
    case 'punch-hole':
      return <PunchHole size={device.notchWidth || 24} />;
    case 'none':
    default:
      return null;
  }
}

export function DeviceFrame({
  deviceId,
  screenshot,
  imageTransform,
  scale = 1,
  className = '',
  isSelected = false,
  phoneIndex = 0,
  onClick,
}: DeviceFrameProps) {
  const device = getDeviceById(deviceId);

  if (!device) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-800 rounded-lg">
        <span className="text-gray-400">Device not found</span>
      </div>
    );
  }

  const isNoFrame = device.id === 'no-frame';
  const isIPhoneSE = device.id === 'iphone-se';

  const frameWidth = device.width * scale;
  const frameHeight = device.height * scale;

  const screenWidth = frameWidth - (device.screenInset.left + device.screenInset.right) * scale;
  const screenHeight = frameHeight - (device.screenInset.top + device.screenInset.bottom) * scale;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(phoneIndex);
    }
  };

  return (
    <div
      className={`relative ${className} ${onClick ? 'cursor-pointer' : ''}`}
      style={{
        width: `${frameWidth}px`,
        height: `${frameHeight}px`,
      }}
      onClick={handleClick}
    >
      {isSelected && (
        <div
          className="absolute -inset-2 rounded-[inherit] pointer-events-none z-50"
          style={{
            borderRadius: `${(device.borderRadius + 8) * scale}px`,
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.4)',
          }}
        />
      )}
      {/* Device Frame (outer bezel) */}
      {!isNoFrame && (
        <div
          className="absolute inset-0 shadow-2xl"
          style={{
            backgroundColor: device.frameColor,
            borderRadius: `${device.borderRadius * scale}px`,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        />
      )}

      {/* Inner bezel highlight */}
      {!isNoFrame && (
        <div
          className="absolute"
          style={{
            top: `${device.screenInset.top * scale * 0.5}px`,
            left: `${device.screenInset.left * scale * 0.5}px`,
            right: `${device.screenInset.right * scale * 0.5}px`,
            bottom: `${device.screenInset.bottom * scale * 0.5}px`,
            backgroundColor: device.bezelColor,
            borderRadius: `${(device.borderRadius - 4) * scale}px`,
          }}
        />
      )}

      {/* Screen Area */}
      <div
        className="absolute overflow-hidden bg-gray-900"
        style={{
          top: `${device.screenInset.top * scale}px`,
          left: `${device.screenInset.left * scale}px`,
          width: `${screenWidth}px`,
          height: `${screenHeight}px`,
          borderRadius: isNoFrame ? '0' : `${device.innerBorderRadius * scale}px`,
        }}
      >
        {/* Notch/Dynamic Island/Punch Hole */}
        {renderNotchElement(device)}

        {/* Screenshot Image */}
        {screenshot ? (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `scale(${imageTransform.zoom}) translate(${imageTransform.x}px, ${imageTransform.y}px)`,
            }}
          >
            <img
              src={screenshot}
              alt="Screenshot"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="text-center text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-2 opacity-50"
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
              <span className="text-xs">Drop image here</span>
            </div>
          </div>
        )}

        {/* Status Bar (subtle overlay for realism) */}
        {!isNoFrame && !isIPhoneSE && (
          <div
            className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 pt-3 z-10"
            style={{ height: '44px' }}
          >
            <span className="text-white text-xs font-medium opacity-80">9:41</span>
            <div className="flex items-center gap-1 opacity-80">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z" opacity="0" />
                <path d="M2 9h3v12H2V9zm5-4h3v16H7V5zm5-3h3v19h-3V2zm5 6h3v13h-3V8z" />
              </svg>
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
              </svg>
              <svg className="w-6 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="7" width="18" height="10" rx="2" ry="2" stroke="currentColor" strokeWidth="1" fill="none" />
                <rect x="4" y="9" width="12" height="6" rx="1" fill="currentColor" />
                <path d="M22 10v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        )}

        {/* Home Indicator (for notch/dynamic island devices) */}
        {(device.notchType === 'notch' || device.notchType === 'dynamic-island') && (
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-full opacity-60 z-10"
            style={{
              width: '134px',
              height: '5px',
            }}
          />
        )}
      </div>

      {/* Home Button for iPhone SE */}
      <HomeButton visible={isIPhoneSE} />

      {/* Side Buttons (subtle detail for realism) */}
      {!isNoFrame && (
        <>
          {/* Volume buttons */}
          <div
            className="absolute bg-gray-700 rounded-sm"
            style={{
              left: '-3px',
              top: `${100 * scale}px`,
              width: '3px',
              height: `${30 * scale}px`,
            }}
          />
          <div
            className="absolute bg-gray-700 rounded-sm"
            style={{
              left: '-3px',
              top: `${140 * scale}px`,
              width: '3px',
              height: `${50 * scale}px`,
            }}
          />
          {/* Power button */}
          <div
            className="absolute bg-gray-700 rounded-sm"
            style={{
              right: '-3px',
              top: `${130 * scale}px`,
              width: '3px',
              height: `${60 * scale}px`,
            }}
          />
        </>
      )}
    </div>
  );
}

export default DeviceFrame;
