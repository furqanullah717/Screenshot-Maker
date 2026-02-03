export interface GradientPreset {
  id: string;
  name: string;
  colors: string[];
  angle: number;
}

export interface SolidColor {
  id: string;
  name: string;
  color: string;
}

export type BackgroundType = 'solid' | 'gradient';

export interface BackgroundConfig {
  type: BackgroundType;
  solidColor: string;
  gradientColors: string[];
  gradientAngle: number;
}

export const gradientPresets: GradientPreset[] = [
  { id: 'sunset', name: 'Sunset', colors: ['#f97316', '#ec4899', '#8b5cf6'], angle: 135 },
  { id: 'ocean', name: 'Ocean', colors: ['#06b6d4', '#3b82f6', '#6366f1'], angle: 135 },
  { id: 'forest', name: 'Forest', colors: ['#22c55e', '#10b981', '#14b8a6'], angle: 135 },
  { id: 'berry', name: 'Berry', colors: ['#ec4899', '#8b5cf6', '#6366f1'], angle: 135 },
  { id: 'fire', name: 'Fire', colors: ['#ef4444', '#f97316', '#eab308'], angle: 135 },
  { id: 'midnight', name: 'Midnight', colors: ['#1e3a5f', '#312e81', '#4c1d95'], angle: 135 },
  { id: 'aurora', name: 'Aurora', colors: ['#22d3ee', '#a855f7', '#ec4899'], angle: 45 },
  { id: 'lime', name: 'Lime', colors: ['#84cc16', '#22c55e', '#10b981'], angle: 135 },
  { id: 'rose', name: 'Rose', colors: ['#f43f5e', '#ec4899', '#d946ef'], angle: 135 },
  { id: 'sky', name: 'Sky', colors: ['#38bdf8', '#818cf8', '#c084fc'], angle: 135 },
  { id: 'peach', name: 'Peach', colors: ['#fb923c', '#f472b6', '#a78bfa'], angle: 135 },
  { id: 'mint', name: 'Mint', colors: ['#2dd4bf', '#34d399', '#a3e635'], angle: 135 },
  { id: 'royal', name: 'Royal', colors: ['#7c3aed', '#4f46e5', '#2563eb'], angle: 135 },
  { id: 'coral', name: 'Coral', colors: ['#fb7185', '#f472b6', '#c084fc'], angle: 135 },
  { id: 'night', name: 'Night', colors: ['#0f172a', '#1e293b', '#334155'], angle: 180 },
  { id: 'dawn', name: 'Dawn', colors: ['#fcd34d', '#fb923c', '#f87171'], angle: 135 },
  { id: 'arctic', name: 'Arctic', colors: ['#e0f2fe', '#bae6fd', '#7dd3fc'], angle: 180 },
  { id: 'lavender', name: 'Lavender', colors: ['#c4b5fd', '#a78bfa', '#8b5cf6'], angle: 135 },
  { id: 'emerald', name: 'Emerald', colors: ['#059669', '#10b981', '#34d399'], angle: 135 },
  { id: 'crimson', name: 'Crimson', colors: ['#dc2626', '#ef4444', '#f87171'], angle: 135 },
];

export const solidColors: SolidColor[] = [
  { id: 'black', name: 'Black', color: '#000000' },
  { id: 'white', name: 'White', color: '#ffffff' },
  { id: 'slate', name: 'Slate', color: '#475569' },
  { id: 'gray', name: 'Gray', color: '#6b7280' },
  { id: 'red', name: 'Red', color: '#ef4444' },
  { id: 'orange', name: 'Orange', color: '#f97316' },
  { id: 'amber', name: 'Amber', color: '#f59e0b' },
  { id: 'yellow', name: 'Yellow', color: '#eab308' },
  { id: 'lime', name: 'Lime', color: '#84cc16' },
  { id: 'green', name: 'Green', color: '#22c55e' },
  { id: 'emerald', name: 'Emerald', color: '#10b981' },
  { id: 'teal', name: 'Teal', color: '#14b8a6' },
  { id: 'cyan', name: 'Cyan', color: '#06b6d4' },
  { id: 'sky', name: 'Sky', color: '#0ea5e9' },
  { id: 'blue', name: 'Blue', color: '#3b82f6' },
  { id: 'indigo', name: 'Indigo', color: '#6366f1' },
  { id: 'violet', name: 'Violet', color: '#8b5cf6' },
  { id: 'purple', name: 'Purple', color: '#a855f7' },
  { id: 'fuchsia', name: 'Fuchsia', color: '#d946ef' },
  { id: 'pink', name: 'Pink', color: '#ec4899' },
  { id: 'rose', name: 'Rose', color: '#f43f5e' },
];

export function getGradientById(id: string): GradientPreset | undefined {
  return gradientPresets.find(g => g.id === id);
}

export function createGradientCSS(colors: string[], angle: number): string {
  return `linear-gradient(${angle}deg, ${colors.join(', ')})`;
}

export function getDefaultBackground(): BackgroundConfig {
  return {
    type: 'gradient',
    solidColor: '#3b82f6',
    gradientColors: ['#f97316', '#ec4899', '#8b5cf6'],
    gradientAngle: 135,
  };
}
