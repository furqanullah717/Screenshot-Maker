import { useCallback, useRef, useState, useEffect } from 'react';
import { useScreenshotStore, PhoneConfig } from './hooks/useScreenshots';
import { ScreenshotCard } from './components/Canvas/ScreenshotCard';
import { PhoneControlBar } from './components/Canvas/PhoneControlBar';
import { DeviceSelector } from './components/Sidebar/DeviceSelector';
import { LayoutSelector } from './components/Sidebar/LayoutSelector';
import { ColorPicker } from './components/Sidebar/ColorPicker';
import { FontControls } from './components/Sidebar/FontControls';
import { ImageControls } from './components/Sidebar/ImageControls';
import { TextInputs } from './components/Sidebar/TextInputs';
import { FeaturePillsEditor } from './components/Sidebar/FeaturePillsEditor';
import { StatsEditor } from './components/Sidebar/StatsEditor';
import { PhoneControls } from './components/Sidebar/PhoneControls';
import { TextControls } from './components/Sidebar/TextControls';
import { ProjectControls } from './components/Toolbar/ProjectControls';
import { ExportButton } from './components/Toolbar/ExportButton';
import { ExportSize, ExportFormat } from './data/exportSizes';
import { getLayoutById } from './data/layoutTemplates';
import { exportAndDownload, downloadBlob, exportScreenshot } from './utils/exportUtils';

function App() {
  const {
    screenshots,
    selectedId,
    addScreenshot,
    updateScreenshot,
    updatePhoneConfig,
    selectPhone,
    removeScreenshot,
    duplicateScreenshot,
    selectScreenshot,
  } = useScreenshotStore();

  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  
  const [previewZoom, setPreviewZoom] = useState(1);
  
  const selectedScreenshot = screenshots.find(s => s.id === selectedId);
  const selectedLayout = selectedScreenshot ? getLayoutById(selectedScreenshot.layout) : null;
  const isPairedLayout = selectedLayout?.isPairedLayout || false;
  
  const zoomLevels = [0.5, 0.75, 1, 1.25, 1.5];
  const zoomIn = () => {
    const currentIndex = zoomLevels.indexOf(previewZoom);
    if (currentIndex < zoomLevels.length - 1) {
      setPreviewZoom(zoomLevels[currentIndex + 1]);
    }
  };
  const zoomOut = () => {
    const currentIndex = zoomLevels.indexOf(previewZoom);
    if (currentIndex > 0) {
      setPreviewZoom(zoomLevels[currentIndex - 1]);
    }
  };

  const registerCardRef = useCallback((id: string, ref: HTMLDivElement | null) => {
    if (ref) {
      cardRefs.current.set(id, ref);
    } else {
      cardRefs.current.delete(id);
    }
  }, []);

  const handleImageUpload = (file: File) => {
    if (selectedId) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateScreenshot(selectedId, { image: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    if (selectedId) {
      updateScreenshot(selectedId, { image: null });
    }
  };

  const handleTextChange = (field: 'title' | 'subtitle' | 'badge', value: string) => {
    if (selectedId) {
      updateScreenshot(selectedId, { [field]: value });
    }
  };

  const handlePhoneSelect = (phoneIndex: number | null) => {
    if (selectedId) {
      selectPhone(selectedId, phoneIndex);
    }
  };

  const handlePhoneConfigUpdate = (phoneIndex: number, updates: Partial<import('./hooks/useScreenshots').PhoneConfig>) => {
    if (selectedId) {
      updatePhoneConfig(selectedId, phoneIndex, updates);
    }
  };

  const handleCanvasClick = () => {
    if (selectedId && selectedScreenshot?.selectedPhoneIndex !== null) {
      selectPhone(selectedId, null);
    }
  };

  // Handle Escape key to deselect phone
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedId && selectedScreenshot?.selectedPhoneIndex !== null) {
        selectPhone(selectedId, null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, selectedScreenshot?.selectedPhoneIndex, selectPhone]);

  // Get selected phone config for the control bar
  const selectedPhoneConfig = selectedScreenshot?.selectedPhoneIndex !== null && selectedScreenshot?.selectedPhoneIndex !== undefined
    ? selectedScreenshot.phoneConfigs[selectedScreenshot.selectedPhoneIndex]
    : null;

  const handleControlBarImageUpload = (file: File) => {
    if (selectedId && selectedScreenshot?.selectedPhoneIndex !== null && selectedScreenshot?.selectedPhoneIndex !== undefined) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updatePhoneConfig(selectedId, selectedScreenshot.selectedPhoneIndex!, { image: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportCurrent = async (size: ExportSize, format: ExportFormat, quality: number) => {
    if (!selectedId) return;
    
    if (isPairedLayout) {
      // Export both variants for paired layouts
      if (leftCardRef.current) {
        await exportAndDownload(leftCardRef.current, size, format, quality, `screenshot-left-${Date.now()}`);
      }
      await new Promise(resolve => setTimeout(resolve, 300));
      if (rightCardRef.current) {
        await exportAndDownload(rightCardRef.current, size, format, quality, `screenshot-right-${Date.now()}`);
      }
    } else {
      const element = cardRefs.current.get(selectedId);
      if (!element) return;
      await exportAndDownload(element, size, format, quality, `screenshot-${Date.now()}`);
    }
  };

  const handleExportAll = async (size: ExportSize, format: ExportFormat, quality: number) => {
    let exportIndex = 1;
    
    for (const screenshot of screenshots) {
      const layout = getLayoutById(screenshot.layout);
      
      if (layout?.isPairedLayout) {
        // For paired layouts, we need to render both variants
        // This is a simplified version - in production you'd use a hidden render target
        const element = cardRefs.current.get(screenshot.id);
        if (element) {
          const result = await exportScreenshot(element, size, format, quality, `screenshot-${exportIndex}`);
          downloadBlob(result.blob, result.filename);
          exportIndex++;
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      } else {
        const element = cardRefs.current.get(screenshot.id);
        if (element) {
          const result = await exportScreenshot(element, size, format, quality, `screenshot-${exportIndex}`);
          downloadBlob(result.blob, result.filename);
          exportIndex++;
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      {/* Toolbar */}
      <header className="h-14 border-b border-gray-700 flex items-center justify-between px-4 shrink-0">
        <ProjectControls
          onAdd={addScreenshot}
          onDuplicate={() => selectedId && duplicateScreenshot(selectedId)}
          onDelete={() => selectedId && removeScreenshot(selectedId)}
          hasSelection={!!selectedId}
          screenshotCount={screenshots.length}
        />
        
        <div className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Screenshot Maker
        </div>
        
        <ExportButton
          onExport={handleExportCurrent}
          onExportAll={handleExportAll}
          screenshotCount={screenshots.length}
          disabled={!selectedId}
        />
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Sidebar - scrollable */}
        <aside className="w-80 border-r border-gray-700 overflow-y-auto shrink-0 h-full">
          <div className="p-4 space-y-6">
            {selectedScreenshot ? (
              <>
                {/* Device Frame - at the top, shows selected phone's device or global */}
                {selectedScreenshot.selectedPhoneIndex !== null ? (
                  <DeviceSelector
                    selectedDevice={selectedScreenshot.phoneConfigs[selectedScreenshot.selectedPhoneIndex]?.deviceFrame || selectedScreenshot.deviceFrame}
                    onChange={(deviceFrame) => handlePhoneConfigUpdate(selectedScreenshot.selectedPhoneIndex!, { deviceFrame })}
                  />
                ) : (
                  <DeviceSelector
                    selectedDevice={selectedScreenshot.deviceFrame}
                    onChange={(deviceFrame) => updateScreenshot(selectedId!, { deviceFrame })}
                  />
                )}

                {/* Layout Template */}
                <div className="border-t border-gray-700 pt-4">
                  <LayoutSelector
                    selectedLayout={selectedScreenshot.layout}
                    onChange={(layout) => updateScreenshot(selectedId!, { layout })}
                  />
                </div>

                {/* Phone Selection Indicator */}
                {selectedScreenshot.selectedPhoneIndex !== null && (
                  <div className="border-t border-gray-700 pt-4">
                    <div className="bg-blue-600/20 border border-blue-600/40 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                            {selectedScreenshot.selectedPhoneIndex + 1}
                          </div>
                          <span className="text-sm font-medium text-blue-200">
                            Editing Phone {selectedScreenshot.selectedPhoneIndex + 1}
                          </span>
                        </div>
                        <button
                          onClick={() => handlePhoneSelect(null)}
                          className="text-xs text-blue-400 hover:text-blue-300"
                        >
                          Deselect
                        </button>
                      </div>
                      <p className="text-xs text-blue-300/70 mt-1.5">
                        Click on the phone in the preview to edit, or use the toolbar above the phone.
                      </p>
                    </div>
                  </div>
                )}

                {/* Screenshot Image - shows selected phone's image controls or global */}
                <div className="border-t border-gray-700 pt-4">
                  {selectedScreenshot.selectedPhoneIndex !== null ? (
                    <ImageControls
                      imageTransform={selectedScreenshot.phoneConfigs[selectedScreenshot.selectedPhoneIndex]?.imageTransform || { zoom: 1, x: 0, y: 0 }}
                      hasImage={!!selectedScreenshot.phoneConfigs[selectedScreenshot.selectedPhoneIndex]?.image}
                      onChange={(transform) => handlePhoneConfigUpdate(selectedScreenshot.selectedPhoneIndex!, { imageTransform: transform })}
                      onImageUpload={(file) => {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          handlePhoneConfigUpdate(selectedScreenshot.selectedPhoneIndex!, { image: event.target?.result as string });
                        };
                        reader.readAsDataURL(file);
                      }}
                      onImageRemove={() => handlePhoneConfigUpdate(selectedScreenshot.selectedPhoneIndex!, { image: null })}
                    />
                  ) : (
                    <ImageControls
                      imageTransform={selectedScreenshot.imageTransform}
                      hasImage={!!selectedScreenshot.image}
                      onChange={(transform) => updateScreenshot(selectedId!, { imageTransform: transform })}
                      onImageUpload={handleImageUpload}
                      onImageRemove={handleImageRemove}
                    />
                  )}
                </div>

                {/* Phone Position Controls - shows selected phone's transform or global */}
                <div className="border-t border-gray-700 pt-4">
                  {selectedScreenshot.selectedPhoneIndex !== null ? (
                    <PhoneControls
                      transform={selectedScreenshot.phoneConfigs[selectedScreenshot.selectedPhoneIndex]?.phoneTransform ?? { x: 0, y: 0, scale: 1, rotation: 0 }}
                      onChange={(phoneTransform) => handlePhoneConfigUpdate(selectedScreenshot.selectedPhoneIndex!, { phoneTransform })}
                    />
                  ) : (
                    <PhoneControls
                      transform={selectedScreenshot.phoneTransform ?? { x: 0, y: 0, scale: 1, rotation: 0 }}
                      onChange={(phoneTransform) => updateScreenshot(selectedId!, { phoneTransform })}
                    />
                  )}
                </div>

                {/* Text Content */}
                <div className="border-t border-gray-700 pt-4">
                  <TextInputs
                    title={selectedScreenshot.title}
                    subtitle={selectedScreenshot.subtitle}
                    badge={selectedScreenshot.badge}
                    onChange={handleTextChange}
                  />
                </div>

                {/* Text Position Controls */}
                <div className="border-t border-gray-700 pt-4">
                  <TextControls
                    transform={selectedScreenshot.textTransform ?? { x: 0, y: 0, scale: 1 }}
                    onChange={(textTransform) => updateScreenshot(selectedId!, { textTransform })}
                  />
                </div>

                {/* Feature Pills */}
                {(selectedLayout?.showFeaturePills || selectedLayout?.isPairedLayout) && (
                  <div className="border-t border-gray-700 pt-4">
                    <FeaturePillsEditor
                      pills={selectedScreenshot.featurePills}
                      onChange={(featurePills) => updateScreenshot(selectedId!, { featurePills })}
                      enabled={selectedScreenshot.showFeaturePills !== false}
                      onToggle={(show) => updateScreenshot(selectedId!, { showFeaturePills: show })}
                      isPairedLayout={selectedLayout?.isPairedLayout}
                      position={selectedScreenshot.featurePillsPosition ?? 'first'}
                      onPositionChange={(pos) => updateScreenshot(selectedId!, { featurePillsPosition: pos })}
                      offset={selectedScreenshot.featurePillsOffset ?? { x: 0, y: 0, scale: 1 }}
                      onOffsetChange={(offset) => updateScreenshot(selectedId!, { featurePillsOffset: offset })}
                    />
                  </div>
                )}

                {/* Stats Badges */}
                {(selectedLayout?.showStats || selectedLayout?.isPairedLayout) && (
                  <div className="border-t border-gray-700 pt-4">
                    <StatsEditor
                      stats={selectedScreenshot.stats}
                      onChange={(stats) => updateScreenshot(selectedId!, { stats })}
                      enabled={selectedScreenshot.showStats !== false}
                      onToggle={(show) => updateScreenshot(selectedId!, { showStats: show })}
                      isPairedLayout={selectedLayout?.isPairedLayout}
                      position={selectedScreenshot.statsPosition ?? 'second'}
                      onPositionChange={(pos) => updateScreenshot(selectedId!, { statsPosition: pos })}
                      offset={selectedScreenshot.statsOffset ?? { x: 0, y: 0, scale: 1 }}
                      onOffsetChange={(offset) => updateScreenshot(selectedId!, { statsOffset: offset })}
                    />
                  </div>
                )}

                {/* Typography */}
                <div className="border-t border-gray-700 pt-4">
                  <FontControls
                    textStyle={selectedScreenshot.textStyle}
                    onChange={(textStyle) => updateScreenshot(selectedId!, { textStyle })}
                  />
                </div>

                {/* Background */}
                <div className="border-t border-gray-700 pt-4">
                  <ColorPicker
                    background={selectedScreenshot.background}
                    onChange={(background) => updateScreenshot(selectedId!, { background })}
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="text-gray-500 mb-2">No screenshot selected</p>
                <p className="text-gray-600 text-sm">Click "Add" to create your first screenshot</p>
              </div>
            )}
          </div>
        </aside>

        {/* Canvas Area - fixed with zoom */}
        <main className="flex-1 bg-gray-800 h-full flex flex-col overflow-hidden">
          {/* Phone Control Bar - appears when a phone is selected */}
          {selectedScreenshot && selectedPhoneConfig && selectedScreenshot.selectedPhoneIndex !== null && (
            <PhoneControlBar
              phoneConfig={selectedPhoneConfig}
              phoneIndex={selectedScreenshot.selectedPhoneIndex}
              onUpdate={(updates: Partial<PhoneConfig>) => updatePhoneConfig(selectedId!, selectedScreenshot.selectedPhoneIndex!, updates)}
              onImageUpload={handleControlBarImageUpload}
              onClose={() => selectPhone(selectedId!, null)}
            />
          )}

          {/* Zoom Controls */}
          {selectedScreenshot && (
            <div className="shrink-0 flex items-center justify-center gap-2 py-2 bg-gray-800 border-b border-gray-700">
              <button
                onClick={zoomOut}
                disabled={previewZoom === zoomLevels[0]}
                className="p-1.5 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Zoom out"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <div className="flex items-center gap-1">
                {zoomLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setPreviewZoom(level)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      previewZoom === level
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    {Math.round(level * 100)}%
                  </button>
                ))}
              </div>
              <button
                onClick={zoomIn}
                disabled={previewZoom === zoomLevels[zoomLevels.length - 1]}
                className="p-1.5 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Zoom in"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          )}
          
          {/* Preview Area */}
          <div className="flex-1 overflow-auto p-4" onClick={handleCanvasClick}>
            <div 
              className="flex items-center justify-center min-h-full"
              style={{ transform: `scale(${previewZoom})`, transformOrigin: 'center top' }}
            >
              {!selectedScreenshot ? (
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 mb-4">No screenshots yet</p>
                  <button
                    onClick={addScreenshot}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                  >
                    Create your first screenshot
                  </button>
                </div>
              ) : isPairedLayout ? (
                // Paired layout preview - show both variants side by side
                <div className="flex gap-4" onClick={(e) => e.stopPropagation()}>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-2">Left Image</p>
                    <div className="shadow-2xl">
                      <ScreenshotCard
                        ref={leftCardRef}
                        screenshot={selectedScreenshot}
                        width={320}
                        height={640}
                        pairedVariant="left"
                        selectedPhoneIndex={selectedScreenshot.selectedPhoneIndex}
                        onPhoneSelect={handlePhoneSelect}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-2">Right Image</p>
                    <div className="shadow-2xl">
                      <ScreenshotCard
                        ref={rightCardRef}
                        screenshot={selectedScreenshot}
                        width={320}
                        height={640}
                        pairedVariant="right"
                        selectedPhoneIndex={selectedScreenshot.selectedPhoneIndex}
                        onPhoneSelect={handlePhoneSelect}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="shadow-2xl" onClick={(e) => e.stopPropagation()}>
                  <ScreenshotCard
                    ref={(ref) => registerCardRef(selectedScreenshot.id, ref)}
                    screenshot={selectedScreenshot}
                    width={400}
                    height={800}
                    selectedPhoneIndex={selectedScreenshot.selectedPhoneIndex}
                    onPhoneSelect={handlePhoneSelect}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Screenshot Tabs */}
      {screenshots.length > 0 && (
        <div className="h-16 bg-gray-900 border-t border-gray-700 flex items-center px-4 gap-2 overflow-x-auto shrink-0">
          {screenshots.map((screenshot, index) => {
            const layout = getLayoutById(screenshot.layout);
            return (
              <button
                key={screenshot.id}
                onClick={() => selectScreenshot(screenshot.id)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 group ${
                  selectedId === screenshot.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  {screenshot.image && (
                    <div 
                      className="w-6 h-10 rounded bg-cover bg-center border border-white/20"
                      style={{ backgroundImage: `url(${screenshot.image})` }}
                    />
                  )}
                  <span>
                    Screenshot {index + 1}
                    {layout?.isPairedLayout && <span className="text-xs opacity-60 ml-1">(×2)</span>}
                  </span>
                </div>
              </button>
            );
          })}
          
          <button
            onClick={addScreenshot}
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300 transition-colors shrink-0"
            title="Add new screenshot"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
