import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BackgroundConfig, getDefaultBackground } from '../data/gradientPresets';
import { Platform } from '../data/platforms';

export interface ImageTransform {
  zoom: number;
  x: number;
  y: number;
}

export interface TextStyleConfig {
  fontFamily: string;
  titleSize: number;
  subtitleSize: number;
  fontWeight: number;
  color: string;
  shadowEnabled: boolean;
  shadowColor: string;
  shadowBlur: number;
}

export interface FeaturePillData {
  text: string;
  icon?: string;
}

export interface StatBadgeData {
  value: string;
  label: string;
  showLaurel?: boolean;
}

export type PairedPosition = 'first' | 'second' | 'both';

export interface ElementPosition {
  x: number;
  y: number;
  scale: number;
}

export interface PhoneTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface TextTransform {
  x: number;
  y: number;
  scale: number;
}

export interface PhoneConfig {
  image: string | null;
  imageTransform: ImageTransform;
  phoneTransform: PhoneTransform;
  deviceFrame: string;
}

export interface Screenshot {
  id: string;
  image: string | null;
  title: string;
  subtitle: string;
  badge: string;
  deviceFrame: string;
  layout: string;
  background: BackgroundConfig;
  imageTransform: ImageTransform;
  textStyle: TextStyleConfig;
  featurePills: FeaturePillData[];
  stats: StatBadgeData[];
  showFeaturePills: boolean;
  showStats: boolean;
  phoneRotation: number;
  phoneScale: number;
  featurePillsPosition: PairedPosition;
  statsPosition: PairedPosition;
  featurePillsOffset: ElementPosition;
  statsOffset: ElementPosition;
  phoneTransform: PhoneTransform;
  textTransform: TextTransform;
  phoneConfigs: PhoneConfig[];
  selectedPhoneIndex: number | null;
}

interface ScreenshotStore {
  screenshots: Screenshot[];
  selectedId: string | null;
  platform: Platform;
  setPlatform: (platform: Platform) => void;
  addScreenshot: () => void;
  updateScreenshot: (id: string, updates: Partial<Screenshot>) => void;
  updatePhoneConfig: (screenshotId: string, phoneIndex: number, updates: Partial<PhoneConfig>) => void;
  selectPhone: (screenshotId: string, phoneIndex: number | null) => void;
  removeScreenshot: (id: string) => void;
  duplicateScreenshot: (id: string) => void;
  selectScreenshot: (id: string | null) => void;
  reorderScreenshots: (fromIndex: number, toIndex: number) => void;
  getSelectedScreenshot: () => Screenshot | undefined;
  clearAll: () => void;
  importScreenshots: (screenshots: Screenshot[]) => void;
}

function generateId(): string {
  return `screenshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getDefaultTextStyle(): TextStyleConfig {
  return {
    fontFamily: 'Inter',
    titleSize: 32,
    subtitleSize: 18,
    fontWeight: 600,
    color: '#ffffff',
    shadowEnabled: true,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowBlur: 4,
  };
}

function getDefaultImageTransform(): ImageTransform {
  return {
    zoom: 1,
    x: 0,
    y: 0,
  };
}

function getDefaultFeaturePills(): FeaturePillData[] {
  return [
    { text: 'Feature 1', icon: 'star' },
    { text: 'Feature 2', icon: 'heart' },
    { text: 'Feature 3', icon: 'code' },
    { text: 'Feature 4', icon: 'palette' },
  ];
}

function getDefaultStats(): StatBadgeData[] {
  return [
    { value: '1M+', label: 'Downloads', showLaurel: true },
    { value: '4.8', label: 'Rating', showLaurel: true },
    { value: '99%', label: 'Satisfaction', showLaurel: true },
  ];
}

function getDefaultElementPosition(): ElementPosition {
  return { x: 0, y: 0, scale: 1 };
}

function getDefaultPhoneTransform(): PhoneTransform {
  return { x: 0, y: 0, scale: 1, rotation: 0 };
}

function getDefaultTextTransform(): TextTransform {
  return { x: 0, y: 0, scale: 1 };
}

export function getDefaultPhoneConfig(overrides?: Partial<PhoneConfig>): PhoneConfig {
  return {
    image: null,
    imageTransform: getDefaultImageTransform(),
    phoneTransform: getDefaultPhoneTransform(),
    deviceFrame: 'iphone-15-pro',
    ...overrides,
  };
}

function getDefaultPhoneConfigs(): PhoneConfig[] {
  return [
    getDefaultPhoneConfig(),
    getDefaultPhoneConfig(),
  ];
}

export function createDefaultScreenshot(): Screenshot {
  return {
    id: generateId(),
    image: null,
    title: 'Your App Title',
    subtitle: 'Amazing feature description',
    badge: '',
    deviceFrame: 'iphone-15-pro',
    layout: 'classic',
    background: getDefaultBackground(),
    imageTransform: getDefaultImageTransform(),
    textStyle: getDefaultTextStyle(),
    featurePills: getDefaultFeaturePills(),
    stats: getDefaultStats(),
    showFeaturePills: true,
    showStats: true,
    phoneRotation: 8,
    phoneScale: 0.85,
    featurePillsPosition: 'first',
    statsPosition: 'second',
    featurePillsOffset: getDefaultElementPosition(),
    statsOffset: getDefaultElementPosition(),
    phoneTransform: getDefaultPhoneTransform(),
    textTransform: getDefaultTextTransform(),
    phoneConfigs: getDefaultPhoneConfigs(),
    selectedPhoneIndex: null,
  };
}

const STORAGE_KEY = 'screenshot-maker-data';

function migrateScreenshot(screenshot: Partial<Screenshot> & { id: string }): Screenshot {
  const defaults = createDefaultScreenshot();
  
  const hasPhoneConfigs = Array.isArray(screenshot.phoneConfigs) && screenshot.phoneConfigs.length > 0;
  
  let phoneConfigs: PhoneConfig[];
  if (hasPhoneConfigs) {
    phoneConfigs = screenshot.phoneConfigs!.map(config => ({
      ...getDefaultPhoneConfig(),
      ...config,
    }));
    while (phoneConfigs.length < 2) {
      phoneConfigs.push(getDefaultPhoneConfig());
    }
  } else {
    phoneConfigs = [
      getDefaultPhoneConfig({
        image: screenshot.image ?? null,
        imageTransform: screenshot.imageTransform ?? getDefaultPhoneConfig().imageTransform,
        phoneTransform: screenshot.phoneTransform ?? getDefaultPhoneConfig().phoneTransform,
        deviceFrame: screenshot.deviceFrame ?? 'iphone-15-pro',
      }),
      getDefaultPhoneConfig({
        deviceFrame: screenshot.deviceFrame ?? 'iphone-15-pro',
      }),
    ];
  }
  
  return {
    ...defaults,
    ...screenshot,
    phoneConfigs,
    selectedPhoneIndex: screenshot.selectedPhoneIndex ?? null,
  };
}

export const useScreenshotStore = create<ScreenshotStore>()(
  persist(
    (set, get) => ({
      screenshots: [],
      selectedId: null,
      platform: 'android' as Platform,

      setPlatform: (platform: Platform) => {
        set({ platform });
      },

      addScreenshot: () => {
        const newScreenshot = createDefaultScreenshot();
        set(state => ({
          screenshots: [...state.screenshots, newScreenshot],
          selectedId: newScreenshot.id,
        }));
      },

      updateScreenshot: (id: string, updates: Partial<Screenshot>) => {
        set(state => ({
          screenshots: state.screenshots.map(screenshot =>
            screenshot.id === id ? { ...screenshot, ...updates } : screenshot
          ),
        }));
      },

      updatePhoneConfig: (screenshotId: string, phoneIndex: number, updates: Partial<PhoneConfig>) => {
        set(state => ({
          screenshots: state.screenshots.map(screenshot => {
            if (screenshot.id !== screenshotId) return screenshot;
            const newPhoneConfigs = [...screenshot.phoneConfigs];
            if (phoneIndex >= 0 && phoneIndex < newPhoneConfigs.length) {
              newPhoneConfigs[phoneIndex] = { ...newPhoneConfigs[phoneIndex], ...updates };
            }
            return { ...screenshot, phoneConfigs: newPhoneConfigs };
          }),
        }));
      },

      selectPhone: (screenshotId: string, phoneIndex: number | null) => {
        set(state => ({
          screenshots: state.screenshots.map(screenshot =>
            screenshot.id === screenshotId
              ? { ...screenshot, selectedPhoneIndex: phoneIndex }
              : screenshot
          ),
        }));
      },

      removeScreenshot: (id: string) => {
        set(state => {
          const newScreenshots = state.screenshots.filter(s => s.id !== id);
          const wasSelected = state.selectedId === id;
          return {
            screenshots: newScreenshots,
            selectedId: wasSelected
              ? newScreenshots.length > 0
                ? newScreenshots[0].id
                : null
              : state.selectedId,
          };
        });
      },

      duplicateScreenshot: (id: string) => {
        const { screenshots } = get();
        const original = screenshots.find(s => s.id === id);
        if (!original) return;

        const duplicate: Screenshot = {
          ...original,
          id: generateId(),
          title: `${original.title} (copy)`,
        };

        set(state => {
          const index = state.screenshots.findIndex(s => s.id === id);
          const newScreenshots = [...state.screenshots];
          newScreenshots.splice(index + 1, 0, duplicate);
          return {
            screenshots: newScreenshots,
            selectedId: duplicate.id,
          };
        });
      },

      selectScreenshot: (id: string | null) => {
        set({ selectedId: id });
      },

      reorderScreenshots: (fromIndex: number, toIndex: number) => {
        set(state => {
          const newScreenshots = [...state.screenshots];
          const [removed] = newScreenshots.splice(fromIndex, 1);
          newScreenshots.splice(toIndex, 0, removed);
          return { screenshots: newScreenshots };
        });
      },

      getSelectedScreenshot: () => {
        const { screenshots, selectedId } = get();
        return screenshots.find(s => s.id === selectedId);
      },

      clearAll: () => {
        set({ screenshots: [], selectedId: null });
      },

      importScreenshots: (screenshots: Screenshot[]) => {
        set({
          screenshots,
          selectedId: screenshots.length > 0 ? screenshots[0].id : null,
        });
      },
    }),
    {
      name: STORAGE_KEY,
      version: 2,
      partialize: (state) => ({
        screenshots: state.screenshots,
        selectedId: state.selectedId,
        platform: state.platform,
      }),
      migrate: (persistedState: unknown, _version: number) => {
        const state = persistedState as { screenshots: Screenshot[]; selectedId: string | null; platform?: Platform };
        return {
          ...state,
          screenshots: state.screenshots.map(migrateScreenshot),
          platform: state.platform || 'android',
        };
      },
    }
  )
);
