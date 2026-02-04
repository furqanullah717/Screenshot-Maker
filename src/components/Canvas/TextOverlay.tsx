import { TextStyleConfig, TextTransform } from '../../hooks/useScreenshots';
import { LayoutTemplate } from '../../data/layoutTemplates';

interface TextOverlayProps {
  title: string;
  subtitle: string;
  badge: string;
  textStyle: TextStyleConfig;
  layout: LayoutTemplate;
  transform?: TextTransform;
  canvasScale?: number;
}

export function TextOverlay({ title, subtitle, badge, textStyle, layout, transform = { x: 0, y: 0, scale: 1 }, canvasScale = 1 }: TextOverlayProps) {
  const { textPosition, textAlignment } = layout;

  const getTextShadow = () => {
    if (!textStyle.shadowEnabled) return 'none';
    return `0 2px ${textStyle.shadowBlur}px ${textStyle.shadowColor}`;
  };

  const getContainerStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      zIndex: 10,
      textAlign: textAlignment,
      padding: `${2 * canvasScale}rem`,
    };

    switch (textPosition) {
      case 'top':
        return { ...base, top: 0, left: 0, right: 0 };
      case 'bottom':
        return { ...base, bottom: 0, left: 0, right: 0 };
      case 'left':
        return { 
          ...base, 
          top: '50%', 
          left: 0, 
          transform: 'translateY(-50%)',
          width: '45%',
          textAlign: 'left' as const,
        };
      case 'right':
        return { 
          ...base, 
          top: '50%', 
          right: 0, 
          transform: 'translateY(-50%)',
          width: '45%',
          textAlign: 'right' as const,
        };
      case 'top-left':
        return { 
          ...base, 
          top: 0, 
          left: 0, 
          width: '60%',
          textAlign: 'left' as const,
        };
      case 'bottom-left':
        return { 
          ...base, 
          bottom: 0, 
          left: 0, 
          width: '60%',
          textAlign: 'left' as const,
        };
      case 'overlay':
        return { 
          ...base, 
          top: '10%', 
          left: 0, 
          right: 0,
          textAlign: 'center' as const,
        };
      default:
        return base;
    }
  };

  const isMinimalLayout = layout.id === 'minimal';
  const hideText = layout.showText === false;
  
  if (hideText) return null;
  if (isMinimalLayout && !badge) return null;

  const containerStyle = getContainerStyle();
  const transformStyle: React.CSSProperties = {
    ...containerStyle,
    transform: `${containerStyle.transform || ''} translate(${transform.x}%, ${transform.y}%) scale(${transform.scale})`.trim(),
  };

  return (
    <div style={transformStyle}>
      {badge && (
        <span 
          className="inline-block bg-white/20 backdrop-blur-sm rounded-full font-semibold"
          style={{
            padding: `${0.25 * canvasScale}rem ${0.75 * canvasScale}rem`,
            fontSize: `${12 * canvasScale}px`,
            marginBottom: `${0.75 * canvasScale}rem`,
          }}
        >
          {badge}
        </span>
      )}
      {!isMinimalLayout && (
        <>
          <h2
            className="font-bold mb-2 leading-tight"
            style={{
              fontFamily: textStyle.fontFamily,
              fontSize: `${textStyle.titleSize * canvasScale}px`,
              fontWeight: textStyle.fontWeight,
              color: textStyle.color,
              textShadow: getTextShadow(),
            }}
          >
            {title}
          </h2>
          <p
            className="opacity-90 leading-relaxed"
            style={{
              fontFamily: textStyle.fontFamily,
              fontSize: `${textStyle.subtitleSize * canvasScale}px`,
              color: textStyle.color,
            }}
          >
            {subtitle}
          </p>
        </>
      )}
    </div>
  );
}

export default TextOverlay;
