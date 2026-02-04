import { Platform, platforms } from '../../data/platforms';

interface PlatformSelectorProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
}

export function PlatformSelector({ selected, onChange }: PlatformSelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
      {(Object.keys(platforms) as Platform[]).map((platform) => {
        const config = platforms[platform];
        const isSelected = selected === platform;
        
        return (
          <button
            key={platform}
            onClick={() => onChange(platform)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              isSelected
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
            }`}
            title={config.description}
          >
            {platform === 'android' ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.523 15.341c-.5 0-.91.41-.91.91s.41.91.91.91.91-.41.91-.91-.41-.91-.91-.91zm-11.046 0c-.5 0-.91.41-.91.91s.41.91.91.91.91-.41.91-.91-.41-.91-.91-.91zm11.4-6.741l1.99-3.448c.11-.19.045-.433-.145-.543-.19-.11-.433-.045-.543.145l-2.02 3.5C15.548 7.518 13.837 7.091 12 7.091c-1.837 0-3.548.427-5.159 1.163l-2.02-3.5c-.11-.19-.353-.255-.543-.145-.19.11-.255.353-.145.543l1.99 3.448C2.677 10.443.5 13.954.5 18h23c0-4.046-2.177-7.557-5.623-9.4z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            )}
            {config.name}
          </button>
        );
      })}
    </div>
  );
}

export default PlatformSelector;
