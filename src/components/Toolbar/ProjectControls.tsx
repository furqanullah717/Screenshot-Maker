interface ProjectControlsProps {
  onAdd: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  hasSelection: boolean;
  screenshotCount: number;
}

export function ProjectControls({ 
  onAdd, 
  onDuplicate, 
  onDelete, 
  hasSelection,
  screenshotCount 
}: ProjectControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onAdd}
        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add
      </button>
      
      {hasSelection && (
        <>
          <button
            onClick={onDuplicate}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
            title="Duplicate screenshot"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Duplicate
          </button>
          
          <button
            onClick={onDelete}
            disabled={screenshotCount <= 1}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              screenshotCount <= 1
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-red-600/20 hover:bg-red-600/40 text-red-400'
            }`}
            title={screenshotCount <= 1 ? 'Cannot delete last screenshot' : 'Delete screenshot'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </>
      )}
    </div>
  );
}

export default ProjectControls;
