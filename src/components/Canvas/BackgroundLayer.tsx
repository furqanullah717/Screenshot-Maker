import { BackgroundConfig, createGradientCSS } from '../../data/gradientPresets';

interface BackgroundLayerProps {
  background: BackgroundConfig;
}

export function BackgroundLayer({ background }: BackgroundLayerProps) {
  const bgStyle = background.type === 'gradient'
    ? createGradientCSS(background.gradientColors, background.gradientAngle)
    : background.solidColor;

  return (
    <div
      className="absolute inset-0"
      style={{ background: bgStyle }}
    />
  );
}

export default BackgroundLayer;
