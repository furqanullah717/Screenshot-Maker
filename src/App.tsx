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
import { PlatformSelector } from './components/Toolbar/PlatformSelector';
import { ExportSize, ExportFormat } from './data/exportSizes';
import { getLayoutById } from './data/layoutTemplates';
import { getPlatformConfig, getCanvasDisplaySize } from './data/platforms';
import { exportAndDownload, batchExportAsZip, exportScreenshot } from './utils/exportUtils';

function App() {
  const {
    screenshots,
    selectedId,
    platform,
    setPlatform,
    addScreenshot,
    updateScreenshot,
    updatePhoneConfig,
    selectPhone,
    removeScreenshot,
    duplicateScreenshot,
    selectScreenshot,
  } = useScreenshotStore();

  const platformConfig = getPlatformConfig(platform);
  const canvasDisplay = getCanvasDisplaySize(platform, 700);

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

  // Update device frame for all phones when global device is changed
  const handleGlobalDeviceChange = (deviceFrame: string) => {
    if (selectedId && selectedScreenshot) {
      // Update the global deviceFrame
      updateScreenshot(selectedId, { deviceFrame });
      // Also update all phoneConfigs to use the new device
      selectedScreenshot.phoneConfigs.forEach((_, index) => {
        updatePhoneConfig(selectedId, index, { deviceFrame });
      });
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
    if (!selectedId || !selectedScreenshot) return;
    
    // Use platform dimensions for export
    const exportSize: ExportSize = {
      ...size,
      width: platformConfig.width,
      height: platformConfig.height,
    };
    
    // Create a temporary container for full-resolution rendering
    const tempContainer = document.createElement('div');
    tempContainer.style.cssText = `
      position: fixed !important;
      left: 0 !important;
      top: 0 !important;
      width: ${platformConfig.width}px !important;
      height: ${platformConfig.height}px !important;
      min-width: ${platformConfig.width}px !important;
      min-height: ${platformConfig.height}px !important;
      max-width: ${platformConfig.width}px !important;
      max-height: ${platformConfig.height}px !important;
      z-index: 99999 !important;
      overflow: visible !important;
      background: transparent !important;
    `;
    document.body.appendChild(tempContainer);
    
    
    // Import ReactDOM for rendering
    const { createRoot } = await import('react-dom/client');
    
    try {
      if (isPairedLayout) {
        // Export left variant
        const leftRoot = createRoot(tempContainer);
        await new Promise<void>((resolve) => {
          leftRoot.render(
            <ScreenshotCard
              screenshot={selectedScreenshot}
              width={platformConfig.width}
              height={platformConfig.height}
              pairedVariant="left"
            />
          );
          setTimeout(resolve, 200);
        });
        
        const leftElement = tempContainer.firstElementChild as HTMLElement;
        if (leftElement) {
          await exportAndDownload(leftElement, exportSize, format, quality, `screenshot-left-${Date.now()}`);
        }
        leftRoot.unmount();
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Export right variant
        const rightRoot = createRoot(tempContainer);
        await new Promise<void>((resolve) => {
          rightRoot.render(
            <ScreenshotCard
              screenshot={selectedScreenshot}
              width={platformConfig.width}
              height={platformConfig.height}
              pairedVariant="right"
            />
          );
          setTimeout(resolve, 200);
        });
        
        const rightElement = tempContainer.firstElementChild as HTMLElement;
        if (rightElement) {
          await exportAndDownload(rightElement, exportSize, format, quality, `screenshot-right-${Date.now()}`);
        }
        rightRoot.unmount();
      } else {
        // Render at full resolution
        const root = createRoot(tempContainer);
        await new Promise<void>((resolve) => {
          root.render(
            <ScreenshotCard
              screenshot={selectedScreenshot}
              width={platformConfig.width}
              height={platformConfig.height}
            />
          );
          // Wait longer for full render at high resolution
          setTimeout(resolve, 500);
        });
        
        const element = tempContainer.firstElementChild as HTMLElement;
        if (element) {
          await exportAndDownload(element, exportSize, format, quality, `screenshot-${Date.now()}`);
        }
        root.unmount();
      }
    } finally {
      document.body.removeChild(tempContainer);
    }
  };

  const exportContainerRef = useRef<HTMLDivElement>(null);
  const [exportingScreenshot, setExportingScreenshot] = useState<typeof screenshots[0] | null>(null);
  const exportResolverRef = useRef<((element: HTMLDivElement) => void) | null>(null);

  const waitForExportRender = (): Promise<HTMLDivElement> => {
    return new Promise((resolve) => {
      exportResolverRef.current = resolve;
    });
  };

  // Effect to handle export rendering for batch export
  useEffect(() => {
    if (exportingScreenshot && exportContainerRef.current) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const wrapper = exportContainerRef.current?.querySelector('[data-export-card]');
          const element = wrapper?.firstElementChild as HTMLDivElement;
          if (element && exportResolverRef.current) {
            exportResolverRef.current(element);
            exportResolverRef.current = null;
          }
        });
      });
    }
  }, [exportingScreenshot]);

  const handleExportAll = async (size: ExportSize, format: ExportFormat, quality: number) => {
    // Use platform dimensions for pixel-perfect export
    const exportSize: ExportSize = {
      ...size,
      width: platformConfig.width,
      height: platformConfig.height,
    };
    
    const results: { blob: Blob; filename: string }[] = [];
    let exportIndex = 1;
    
    for (const screenshot of screenshots) {
      // Render the screenshot in the hidden export container
      setExportingScreenshot(screenshot);
      
      // Wait for the element to be rendered
      const element = await waitForExportRender();
      
      // Small delay to ensure full render
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const result = await exportScreenshot(element, exportSize, format, quality, `screenshot-${exportIndex}`);
      results.push(result);
      exportIndex++;
    }
    
    // Clear the export container
    setExportingScreenshot(null);
    
    // Download as zip if multiple files, otherwise download single file
    if (results.length > 1) {
      await batchExportAsZip(results, `screenshots-${Date.now()}`);
    } else if (results.length === 1) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(results[0].blob);
      link.download = results[0].filename;
      link.click();
      URL.revokeObjectURL(link.href);
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
        
        <div className="flex items-center gap-4">
          <div className="text-sm font-semibold text-gray-300 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Screenshot Maker
          </div>
          <PlatformSelector selected={platform} onChange={setPlatform} />
          <span className="text-xs text-gray-500">
            {platformConfig.width}×{platformConfig.height}
          </span>
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
                    selectedDevice={selectedScreenshot.phoneConfigs[0]?.deviceFrame || selectedScreenshot.deviceFrame}
                    onChange={handleGlobalDeviceChange}
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
                        width={canvasDisplay.width}
                        height={canvasDisplay.height}
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
                        width={canvasDisplay.width}
                        height={canvasDisplay.height}
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
                    width={canvasDisplay.width}
                    height={canvasDisplay.height}
                    selectedPhoneIndex={selectedScreenshot.selectedPhoneIndex}
                    onPhoneSelect={handlePhoneSelect}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Hidden Export Container - renders screenshots for batch export */}
      <div
        ref={exportContainerRef}
        style={{ 
          position: 'fixed',
          left: 0,
          top: 0,
          width: `${canvasDisplay.width}px`, 
          height: `${canvasDisplay.height}px`,
          transform: 'translateX(-200vw)',
          pointerEvents: 'none',
        }}
      >
        {exportingScreenshot && (
          <div data-export-card>
            <ScreenshotCard
              screenshot={exportingScreenshot}
              width={canvasDisplay.width}
              height={canvasDisplay.height}
            />
          </div>
        )}
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
