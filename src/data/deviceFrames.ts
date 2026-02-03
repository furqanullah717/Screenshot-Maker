export type NotchType = 'dynamic-island' | 'notch' | 'punch-hole' | 'none';
export type DeviceType = 'ios' | 'android';

export interface ScreenInset {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface DeviceFrame {
  id: string;
  name: string;
  type: DeviceType;
  width: number;
  height: number;
  screenInset: ScreenInset;
  borderRadius: number;
  innerBorderRadius: number;
  notchType: NotchType;
  notchWidth?: number;
  notchHeight?: number;
  frameColor: string;
  bezelColor: string;
}

export const deviceFrames: DeviceFrame[] = [
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    type: 'ios',
    width: 393,
    height: 852,
    screenInset: { top: 12, left: 12, right: 12, bottom: 12 },
    borderRadius: 55,
    innerBorderRadius: 47,
    notchType: 'dynamic-island',
    notchWidth: 126,
    notchHeight: 37,
    frameColor: '#1a1a1a',
    bezelColor: '#2a2a2a',
  },
  {
    id: 'iphone-14',
    name: 'iPhone 14',
    type: 'ios',
    width: 390,
    height: 844,
    screenInset: { top: 12, left: 12, right: 12, bottom: 12 },
    borderRadius: 50,
    innerBorderRadius: 42,
    notchType: 'notch',
    notchWidth: 150,
    notchHeight: 34,
    frameColor: '#1a1a1a',
    bezelColor: '#2a2a2a',
  },
  {
    id: 'iphone-se',
    name: 'iPhone SE',
    type: 'ios',
    width: 375,
    height: 667,
    screenInset: { top: 20, left: 12, right: 12, bottom: 20 },
    borderRadius: 40,
    innerBorderRadius: 0,
    notchType: 'none',
    frameColor: '#1a1a1a',
    bezelColor: '#2a2a2a',
  },
  {
    id: 'pixel-8',
    name: 'Pixel 8',
    type: 'android',
    width: 412,
    height: 915,
    screenInset: { top: 10, left: 10, right: 10, bottom: 10 },
    borderRadius: 40,
    innerBorderRadius: 32,
    notchType: 'punch-hole',
    notchWidth: 24,
    notchHeight: 24,
    frameColor: '#1a1a1a',
    bezelColor: '#2a2a2a',
  },
  {
    id: 'samsung-s24',
    name: 'Samsung S24',
    type: 'android',
    width: 412,
    height: 892,
    screenInset: { top: 8, left: 8, right: 8, bottom: 8 },
    borderRadius: 36,
    innerBorderRadius: 30,
    notchType: 'punch-hole',
    notchWidth: 20,
    notchHeight: 20,
    frameColor: '#0f0f0f',
    bezelColor: '#1f1f1f',
  },
  {
    id: 'generic-android',
    name: 'Generic Android',
    type: 'android',
    width: 412,
    height: 892,
    screenInset: { top: 8, left: 8, right: 8, bottom: 8 },
    borderRadius: 24,
    innerBorderRadius: 18,
    notchType: 'none',
    frameColor: '#1a1a1a',
    bezelColor: '#2a2a2a',
  },
  {
    id: 'no-frame',
    name: 'No Frame',
    type: 'android',
    width: 412,
    height: 892,
    screenInset: { top: 0, left: 0, right: 0, bottom: 0 },
    borderRadius: 0,
    innerBorderRadius: 0,
    notchType: 'none',
    frameColor: 'transparent',
    bezelColor: 'transparent',
  },
];

export function getDeviceById(id: string): DeviceFrame | undefined {
  return deviceFrames.find(device => device.id === id);
}

export function getDevicesByType(type: DeviceType): DeviceFrame[] {
  return deviceFrames.filter(device => device.type === type);
}
