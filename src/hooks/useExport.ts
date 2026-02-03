import { useRef, useCallback } from 'react';
import { ExportSize, ExportFormat, exportSizes, getDefaultExportOptions } from '../data/exportSizes';
import { exportAndDownload, batchExport, downloadBlob } from '../utils/exportUtils';

export interface UseExportOptions {
  size: ExportSize;
  format: ExportFormat;
  quality: number;
  filenamePattern: string;
}

export function useExport() {
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const defaultOptions = getDefaultExportOptions();

  const registerCardRef = useCallback((id: string, ref: HTMLDivElement | null) => {
    if (ref) {
      cardRefs.current.set(id, ref);
    } else {
      cardRefs.current.delete(id);
    }
  }, []);

  const exportSingle = useCallback(async (
    id: string,
    options: Partial<UseExportOptions> = {}
  ): Promise<void> => {
    const element = cardRefs.current.get(id);
    if (!element) {
      throw new Error(`Screenshot element not found: ${id}`);
    }

    const { size, format, quality, filenamePattern } = { ...defaultOptions, ...options };
    const filename = filenamePattern.replace('{index}', '1');
    
    await exportAndDownload(element, size, format, quality, filename);
  }, [defaultOptions]);

  const exportAll = useCallback(async (
    ids: string[],
    options: Partial<UseExportOptions> = {}
  ): Promise<void> => {
    const elements: HTMLElement[] = [];
    
    for (const id of ids) {
      const element = cardRefs.current.get(id);
      if (element) {
        elements.push(element);
      }
    }

    if (elements.length === 0) {
      throw new Error('No screenshot elements found');
    }

    const { size, format, quality, filenamePattern } = { ...defaultOptions, ...options };
    const results = await batchExport(elements, size, format, quality, filenamePattern);
    
    for (const result of results) {
      downloadBlob(result.blob, result.filename);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }, [defaultOptions]);

  return {
    registerCardRef,
    exportSingle,
    exportAll,
    exportSizes,
    defaultOptions,
  };
}

export default useExport;
