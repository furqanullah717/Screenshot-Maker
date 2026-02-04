export type Platform = 'android' | 'ios';

export interface PlatformConfig {
  id: Platform;
  name: string;
  width: number;
  height: number;
  description: string;
}

export const platforms: Record<Platform, PlatformConfig> = {
  android: {
    id: 'android',
    name: 'Android',
    width: 1080,
    height: 1920,
    description: 'Play Store (1080×1920)',
  },
  ios: {
    id: 'ios',
    name: 'iOS',
    width: 1290,
    height: 2796,
    description: 'App Store 6.7" (1290×2796)',
  },
};

export function getPlatformConfig(platform: Platform): PlatformConfig {
  return platforms[platform];
}

export function getCanvasDisplaySize(platform: Platform, maxHeight: number = 700): { width: number; height: number; scale: number } {
  const config = platforms[platform];
  const scale = maxHeight / config.height;
  return {
    width: Math.round(config.width * scale),
    height: Math.round(config.height * scale),
    scale,
  };
}
