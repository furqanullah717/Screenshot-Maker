export type TextPosition = 'top' | 'bottom' | 'left' | 'right' | 'overlay' | 'top-left' | 'bottom-left';

export interface PhonePosition {
  x: number;
  y: number;
  scale: number;
  rotation?: number;
  clipLeft?: number;
  clipRight?: number;
}

export interface FeaturePill {
  text: string;
  icon?: string;
  x: number;
  y: number;
}

export interface StatBadge {
  value: string;
  label: string;
  x: number;
  y: number;
  showLaurel?: boolean;
}

export interface LayoutTemplate {
  id: string;
  name: string;
  description: string;
  phonePosition: PhonePosition;
  textPosition: TextPosition;
  textAlignment: 'left' | 'center' | 'right';
  showBadge: boolean;
  decorations: boolean;
  phoneCount: 1 | 2;
  secondPhonePosition?: PhonePosition;
  showFeaturePills?: boolean;
  featurePillPositions?: { x: number; y: number }[];
  showStats?: boolean;
  statPositions?: { x: number; y: number }[];
  isPairedLayout?: boolean;
  pairedVariant?: 'left' | 'right';
  showText?: boolean;
}

export interface PairedLayoutOverrides {
  rotation?: number;
  scale?: number;
}

export function getPairedLayoutConfig(
  variant: 'left' | 'right',
  overrides?: PairedLayoutOverrides
): Partial<LayoutTemplate> {
  // Phone is split in the middle:
  // Left image: phone center at right edge (100%) - shows LEFT half of phone
  // Right image: phone center at left edge (0%) - shows RIGHT half of phone
  // BOTH phones rotate in the SAME direction so frames align when placed together
  
  const commonY = 52;
  const scale = overrides?.scale ?? 0.85;
  const rotation = overrides?.rotation ?? 8;
  
  if (variant === 'left') {
    // Left image: phone center at right edge, shows LEFT half of phone
    // Title and description shown here
    return {
      phonePosition: { x: 100, y: commonY, scale: scale, rotation: rotation },
      textPosition: 'top-left',
      showText: true,
      featurePillPositions: [
        { x: 18, y: 50 },
        { x: 30, y: 60 },
        { x: 18, y: 70 },
        { x: 30, y: 80 },
      ],
      statPositions: [
        { x: 22, y: 35 },
        { x: 22, y: 52 },
        { x: 22, y: 69 },
      ],
    };
  } else {
    // Right image: phone center at left edge, shows RIGHT half of phone
    // No title/description on this one - only features/stats
    return {
      phonePosition: { x: 0, y: commonY, scale: scale, rotation: rotation },
      textPosition: 'top-left',
      showText: false,
      featurePillPositions: [
        { x: 70, y: 50 },
        { x: 82, y: 60 },
        { x: 70, y: 70 },
        { x: 82, y: 80 },
      ],
      statPositions: [
        { x: 78, y: 35 },
        { x: 78, y: 52 },
        { x: 78, y: 69 },
      ],
    };
  }
}

export const layoutTemplates: LayoutTemplate[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Text top, phone center-bottom',
    phonePosition: { x: 50, y: 60, scale: 0.75 },
    textPosition: 'top',
    textAlignment: 'center',
    showBadge: true,
    decorations: true,
    phoneCount: 1,
  },
  {
    id: 'hero',
    name: 'Hero',
    description: 'Large phone, small text overlay',
    phonePosition: { x: 50, y: 55, scale: 0.85 },
    textPosition: 'overlay',
    textAlignment: 'center',
    showBadge: false,
    decorations: false,
    phoneCount: 1,
  },
  {
    id: 'side-by-side',
    name: 'Side by Side',
    description: 'Two phones horizontally',
    phonePosition: { x: 30, y: 55, scale: 0.55 },
    secondPhonePosition: { x: 70, y: 55, scale: 0.55 },
    textPosition: 'top',
    textAlignment: 'center',
    showBadge: true,
    decorations: true,
    phoneCount: 2,
  },
  {
    id: 'text-bottom',
    name: 'Text Bottom',
    description: 'Phone top, text below',
    phonePosition: { x: 50, y: 40, scale: 0.7 },
    textPosition: 'bottom',
    textAlignment: 'center',
    showBadge: true,
    decorations: true,
    phoneCount: 1,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Phone only, no text',
    phonePosition: { x: 50, y: 50, scale: 0.8 },
    textPosition: 'overlay',
    textAlignment: 'center',
    showBadge: false,
    decorations: false,
    phoneCount: 1,
  },
  {
    id: 'feature-focus',
    name: 'Feature Focus',
    description: 'Phone with feature callouts',
    phonePosition: { x: 50, y: 55, scale: 0.7 },
    textPosition: 'top',
    textAlignment: 'center',
    showBadge: true,
    decorations: true,
    phoneCount: 1,
  },
  {
    id: 'left-aligned',
    name: 'Left Aligned',
    description: 'Phone on left, text on right',
    phonePosition: { x: 35, y: 50, scale: 0.7 },
    textPosition: 'right',
    textAlignment: 'left',
    showBadge: true,
    decorations: true,
    phoneCount: 1,
  },
  {
    id: 'right-aligned',
    name: 'Right Aligned',
    description: 'Phone on right, text on left',
    phonePosition: { x: 65, y: 50, scale: 0.7 },
    textPosition: 'left',
    textAlignment: 'right',
    showBadge: true,
    decorations: true,
    phoneCount: 1,
  },
  {
    id: 'split-pair',
    name: 'Split Pair',
    description: 'Generates 2 images that combine into one phone',
    phonePosition: { x: 100, y: 52, scale: 0.85, rotation: 8 },
    textPosition: 'top-left',
    textAlignment: 'left',
    showBadge: false,
    decorations: true,
    phoneCount: 1,
    showFeaturePills: true,
    showStats: true,
    featurePillPositions: [
      { x: 18, y: 50 },
      { x: 30, y: 60 },
      { x: 18, y: 70 },
      { x: 30, y: 80 },
    ],
    statPositions: [
      { x: 22, y: 35 },
      { x: 22, y: 52 },
      { x: 22, y: 69 },
    ],
    isPairedLayout: true,
  },
  {
    id: 'stats-right',
    name: 'Stats Right',
    description: 'Phone on left with stats on right side',
    phonePosition: { x: 35, y: 55, scale: 0.8 },
    textPosition: 'top-left',
    textAlignment: 'left',
    showBadge: false,
    decorations: true,
    phoneCount: 1,
    showStats: true,
    statPositions: [
      { x: 75, y: 25 },
      { x: 75, y: 45 },
      { x: 75, y: 65 },
    ],
  },
  {
    id: 'showcase',
    name: 'Showcase',
    description: 'Large centered phone with floating pills around',
    phonePosition: { x: 50, y: 50, scale: 0.75 },
    textPosition: 'overlay',
    textAlignment: 'center',
    showBadge: false,
    decorations: false,
    phoneCount: 1,
    showFeaturePills: true,
    featurePillPositions: [
      { x: 15, y: 35 },
      { x: 85, y: 35 },
      { x: 15, y: 55 },
      { x: 85, y: 55 },
      { x: 15, y: 75 },
      { x: 85, y: 75 },
    ],
  },
  {
    id: 'tilted-left',
    name: 'Tilted Left',
    description: 'Phone rotated -15 degrees with text on right',
    phonePosition: { x: 40, y: 50, scale: 0.7, rotation: -15 },
    textPosition: 'right',
    textAlignment: 'left',
    showBadge: true,
    decorations: true,
    phoneCount: 1,
  },
  {
    id: 'tilted-right',
    name: 'Tilted Right',
    description: 'Phone rotated +15 degrees with text on left',
    phonePosition: { x: 60, y: 50, scale: 0.7, rotation: 15 },
    textPosition: 'left',
    textAlignment: 'right',
    showBadge: true,
    decorations: true,
    phoneCount: 1,
  },
  {
    id: 'floating',
    name: 'Floating',
    description: 'Phone centered with slight tilt, text at top',
    phonePosition: { x: 50, y: 55, scale: 0.75, rotation: 5 },
    textPosition: 'top',
    textAlignment: 'center',
    showBadge: false,
    decorations: true,
    phoneCount: 1,
  },
  {
    id: 'bottom-heavy',
    name: 'Bottom Heavy',
    description: 'Large phone at bottom, small text overlay at top',
    phonePosition: { x: 50, y: 70, scale: 0.9 },
    textPosition: 'overlay',
    textAlignment: 'center',
    showBadge: false,
    decorations: false,
    phoneCount: 1,
  },
  {
    id: 'card-style',
    name: 'Card Style',
    description: 'Phone at top with text in card-like bottom section',
    phonePosition: { x: 50, y: 35, scale: 0.65 },
    textPosition: 'bottom',
    textAlignment: 'center',
    showBadge: true,
    decorations: false,
    phoneCount: 1,
  },
  {
    id: 'stacked',
    name: 'Stacked',
    description: 'Two phones overlapping vertically with depth',
    phonePosition: { x: 55, y: 55, scale: 0.65 },
    secondPhonePosition: { x: 45, y: 45, scale: 0.55, rotation: -5 },
    textPosition: 'top',
    textAlignment: 'center',
    showBadge: true,
    decorations: true,
    phoneCount: 2,
  },
  {
    id: 'fan',
    name: 'Fan',
    description: 'Two phones spread like a fan',
    phonePosition: { x: 35, y: 52, scale: 0.6, rotation: -10 },
    secondPhonePosition: { x: 65, y: 52, scale: 0.6, rotation: 10 },
    textPosition: 'top',
    textAlignment: 'center',
    showBadge: true,
    decorations: true,
    phoneCount: 2,
  },
  {
    id: 'perspective-row',
    name: 'Perspective Row',
    description: 'Two phones in perspective, one larger and forward',
    phonePosition: { x: 35, y: 55, scale: 0.7 },
    secondPhonePosition: { x: 70, y: 50, scale: 0.5, rotation: 5 },
    textPosition: 'top',
    textAlignment: 'center',
    showBadge: true,
    decorations: true,
    phoneCount: 2,
  },
];

export function getLayoutById(id: string): LayoutTemplate | undefined {
  return layoutTemplates.find(layout => layout.id === id);
}
