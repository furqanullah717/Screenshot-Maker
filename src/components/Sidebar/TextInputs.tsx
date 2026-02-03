interface TextInputsProps {
  title: string;
  subtitle: string;
  badge: string;
  onChange: (field: 'title' | 'subtitle' | 'badge', value: string) => void;
  disabled?: boolean;
}

export function TextInputs({ title, subtitle, badge, onChange, disabled }: TextInputsProps) {
  return (
    <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        Text Content
      </h3>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onChange('title', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter title..."
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Subtitle</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => onChange('subtitle', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter subtitle..."
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Badge</label>
          <input
            type="text"
            value={badge}
            onChange={(e) => onChange('badge', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., NEW, PRO, FREE..."
          />
          <p className="text-[10px] text-gray-600 mt-1">
            Leave empty to hide the badge
          </p>
        </div>
      </div>
    </div>
  );
}

export default TextInputs;
