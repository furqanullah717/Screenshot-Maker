export interface ExportSize {
  id: string;
  name: string;
  platform: 'play-store' | 'app-store' | 'custom';
  width: number;
  height: number;
  description: string;
}

export const exportSizes: ExportSize[] = [
  {
    id: 'play-store',
    name: 'Play Store',
    platform: 'play-store',
    width: 1080,
    height: 1920,
    description: 'Standard 9:16 portrait',
  },
  {
    id: 'play-store-feature',
    name: 'Play Store Feature',
    platform: 'play-store',
    width: 1024,
    height: 500,
    description: 'Feature graphic ~2:1',
  },
  {
    id: 'app-store-6.7',
    name: 'App Store 6.7"',
    platform: 'app-store',
    width: 1290,
    height: 2796,
    description: 'iPhone 15 Pro Max, 15 Plus, 14 Pro Max',
  },
  {
    id: 'app-store-6.5',
    name: 'App Store 6.5"',
    platform: 'app-store',
    width: 1242,
    height: 2688,
    description: 'iPhone 11 Pro Max, XS Max',
  },
  {
    id: 'app-store-5.5',
    name: 'App Store 5.5"',
    platform: 'app-store',
    width: 1242,
    height: 2208,
    description: 'iPhone 8 Plus, 7 Plus, 6s Plus',
  },
  {
    id: 'app-store-6.1',
    name: 'App Store 6.1"',
    platform: 'app-store',
    width: 1179,
    height: 2556,
    description: 'iPhone 15, 15 Pro, 14 Pro',
  },
  {
    id: 'app-store-ipad-12.9',
    name: 'iPad Pro 12.9"',
    platform: 'app-store',
    width: 2048,
    height: 2732,
    description: 'iPad Pro 12.9-inch',
  },
  {
    id: 'app-store-ipad-11',
    name: 'iPad Pro 11"',
    platform: 'app-store',
    width: 1668,
    height: 2388,
    description: 'iPad Pro 11-inch, iPad Air',
  },
];

export type ExportFormat = 'png' | 'jpeg';

export interface ExportOptions {
  size: ExportSize;
  format: ExportFormat;
  quality: number;
  filenamePattern: string;
}

export function getExportSizeById(id: string): ExportSize | undefined {
  return exportSizes.find(size => size.id === id);
}

export function getExportSizesByPlatform(platform: ExportSize['platform']): ExportSize[] {
  return exportSizes.filter(size => size.platform === platform);
}

export function getDefaultExportOptions(): ExportOptions {
  return {
    size: exportSizes[0],
    format: 'png',
    quality: 0.92,
    filenamePattern: 'screenshot-{index}',
  };
}
