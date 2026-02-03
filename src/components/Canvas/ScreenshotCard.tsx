import { forwardRef } from 'react';
import { Screenshot } from '../../hooks/useScreenshots';
import { getLayoutById, getPairedLayoutConfig, PhonePosition } from '../../data/layoutTemplates';
import { BackgroundLayer } from './BackgroundLayer';
import { Decorations } from './Decorations';
import { TextOverlay } from './TextOverlay';
import { DeviceFrame } from './DeviceFrame';
import { FeaturePills } from './FeaturePills';
import { StatsBadges } from './StatsBadges';

interface ScreenshotCardProps {
  screenshot: Screenshot;
  width?: number;
  height?: number;
  secondImage?: string | null;
  pairedVariant?: 'left' | 'right';
}

export const ScreenshotCard = forwardRef<HTMLDivElement, ScreenshotCardProps>(
  ({ screenshot, width = 400, height = 800, secondImage, pairedVariant }, ref) => {
    const baseLayout = getLayoutById(screenshot.layout);
    
    if (!baseLayout) {
      return (
        <div className="flex items-center justify-center p-8 bg-gray-800 rounded-lg">
          <span className="text-gray-400">Layout not found</span>
        </div>
      );
    }

    const userRotation = screenshot.phoneRotation ?? 8;
    const userScale = screenshot.phoneScale ?? 0.85;
    
    const layout = baseLayout.isPairedLayout && pairedVariant
      ? { ...baseLayout, ...getPairedLayoutConfig(pairedVariant, { rotation: userRotation, scale: userScale }) }
      : baseLayout;

    // Get user transform overrides
    const phoneTransform = screenshot.phoneTransform ?? { x: 0, y: 0, scale: 1, rotation: 0 };
    const textTransform = screenshot.textTransform ?? { x: 0, y: 0, scale: 1 };

    const phoneScale = layout.phonePosition.scale * 0.8 * phoneTransform.scale;

    const getPhoneStyle = (position: PhonePosition): React.CSSProperties => {
      const baseRotation = position.rotation || 0;
      const finalRotation = baseRotation + phoneTransform.rotation;
      const finalX = position.x + phoneTransform.x;
      const finalY = position.y + phoneTransform.y;
      
      return {
        position: 'absolute',
        left: `${finalX}%`,
        top: `${finalY}%`,
        transform: `translate(-50%, -50%) rotate(${finalRotation}deg)`,
      };
    };

    const featurePills = screenshot.featurePills || [];
    const stats = screenshot.stats || [];
    
    const screenshotShowPills = screenshot.showFeaturePills !== false;
    const screenshotShowStats = screenshot.showStats !== false;
    
    const featurePillsPosition = screenshot.featurePillsPosition ?? 'first';
    const statsPosition = screenshot.statsPosition ?? 'second';
    
    const featurePillsOffset = screenshot.featurePillsOffset ?? { x: 0, y: 0, scale: 1 };
    const statsOffset = screenshot.statsOffset ?? { x: 0, y: 0, scale: 1 };

    const shouldShowPillsForVariant = () => {
      if (!pairedVariant) return true;
      if (featurePillsPosition === 'both') return true;
      if (featurePillsPosition === 'first' && pairedVariant === 'left') return true;
      if (featurePillsPosition === 'second' && pairedVariant === 'right') return true;
      return false;
    };

    const shouldShowStatsForVariant = () => {
      if (!pairedVariant) return true;
      if (statsPosition === 'both') return true;
      if (statsPosition === 'first' && pairedVariant === 'left') return true;
      if (statsPosition === 'second' && pairedVariant === 'right') return true;
      return false;
    };

    const showFeaturePills = layout.showFeaturePills && 
      layout.featurePillPositions && 
      featurePills.length > 0 &&
      screenshotShowPills &&
      shouldShowPillsForVariant();

    const showStats = layout.showStats && 
      layout.statPositions && 
      stats.length > 0 &&
      screenshotShowStats &&
      shouldShowStatsForVariant();

    return (
      <div
        ref={ref}
        className="relative overflow-hidden"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          borderRadius: '16px',
        }}
      >
        <BackgroundLayer background={screenshot.background} />
        
        <Decorations visible={layout.decorations} variant="circles" />
        
        <TextOverlay
          title={screenshot.title}
          subtitle={screenshot.subtitle}
          badge={screenshot.badge}
          textStyle={screenshot.textStyle}
          layout={layout}
          transform={textTransform}
        />
        
        <div style={getPhoneStyle(layout.phonePosition)}>
          <DeviceFrame
            deviceId={screenshot.deviceFrame}
            screenshot={screenshot.image}
            imageTransform={screenshot.imageTransform}
            scale={phoneScale}
          />
        </div>
        
        {layout.phoneCount === 2 && layout.secondPhonePosition && (
          <div style={getPhoneStyle(layout.secondPhonePosition)}>
            <DeviceFrame
              deviceId={screenshot.deviceFrame}
              screenshot={secondImage || screenshot.image}
              imageTransform={screenshot.imageTransform}
              scale={phoneScale}
            />
          </div>
        )}

        {showFeaturePills && (
          <FeaturePills
            pills={featurePills}
            positions={layout.featurePillPositions!}
            color={screenshot.background.gradientColors?.[0] || screenshot.background.solidColor}
            offset={featurePillsOffset}
          />
        )}

        {showStats && (
          <StatsBadges
            stats={stats}
            positions={layout.statPositions!}
            color={screenshot.textStyle.color}
            offset={statsOffset}
          />
        )}
      </div>
    );
  }
);

ScreenshotCard.displayName = 'ScreenshotCard';

export default ScreenshotCard;
