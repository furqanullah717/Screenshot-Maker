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
  selectedPhoneIndex?: number | null;
  onPhoneSelect?: (phoneIndex: number | null) => void;
}

export const ScreenshotCard = forwardRef<HTMLDivElement, ScreenshotCardProps>(
  ({ screenshot, width = 400, height = 800, secondImage, pairedVariant, selectedPhoneIndex, onPhoneSelect }, ref) => {
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
    const textTransform = screenshot.textTransform ?? { x: 0, y: 0, scale: 1 };

    const phoneConfigs = screenshot.phoneConfigs || [];
    const primaryPhone = phoneConfigs[0];
    const secondaryPhone = phoneConfigs[1];

    // Get individual phone transforms
    const primaryPhoneTransform = primaryPhone?.phoneTransform ?? { x: 0, y: 0, scale: 1, rotation: 0 };
    const secondaryPhoneTransform = secondaryPhone?.phoneTransform ?? { x: 0, y: 0, scale: 1, rotation: 0 };

    const getPrimaryPhoneScale = () => layout.phonePosition.scale * 0.8 * primaryPhoneTransform.scale;
    const getSecondaryPhoneScale = () => (layout.secondPhonePosition?.scale ?? layout.phonePosition.scale) * 0.8 * secondaryPhoneTransform.scale;

    const getPhoneStyle = (position: PhonePosition, phoneIndex: number): React.CSSProperties => {
      const transform = phoneIndex === 0 ? primaryPhoneTransform : secondaryPhoneTransform;
      const baseRotation = position.rotation || 0;
      const finalRotation = baseRotation + transform.rotation;
      const finalX = position.x + transform.x;
      const finalY = position.y + transform.y;
      
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

    const handlePhoneClick = (phoneIndex: number) => {
      if (onPhoneSelect) {
        onPhoneSelect(phoneIndex);
      }
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
        
        <div style={getPhoneStyle(layout.phonePosition, 0)} className="relative">
          <DeviceFrame
            deviceId={primaryPhone?.deviceFrame || screenshot.deviceFrame}
            screenshot={primaryPhone?.image ?? screenshot.image}
            imageTransform={primaryPhone?.imageTransform || screenshot.imageTransform}
            scale={getPrimaryPhoneScale()}
            isSelected={selectedPhoneIndex === 0}
            phoneIndex={0}
            onClick={onPhoneSelect ? handlePhoneClick : undefined}
          />
        </div>
        
        {layout.phoneCount === 2 && layout.secondPhonePosition && (
          <div style={getPhoneStyle(layout.secondPhonePosition, 1)} className="relative">
            <DeviceFrame
              deviceId={secondaryPhone?.deviceFrame || screenshot.deviceFrame}
              screenshot={secondaryPhone?.image ?? secondImage ?? screenshot.image}
              imageTransform={secondaryPhone?.imageTransform || screenshot.imageTransform}
              scale={getSecondaryPhoneScale()}
              isSelected={selectedPhoneIndex === 1}
              phoneIndex={1}
              onClick={onPhoneSelect ? handlePhoneClick : undefined}
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
