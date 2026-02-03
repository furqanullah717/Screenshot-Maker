import html2canvas from 'html2canvas';
import { ExportSize, ExportFormat } from '../data/exportSizes';

export interface ExportResult {
  blob: Blob;
  filename: string;
}

export async function exportScreenshot(
  element: HTMLElement,
  size: ExportSize,
  format: ExportFormat,
  quality: number = 0.92,
  filename: string = 'screenshot'
): Promise<ExportResult> {
  const scale = size.width / element.offsetWidth;
  
  const canvas = await html2canvas(element, {
    scale: scale * 2,
    useCORS: true,
    backgroundColor: null,
    logging: false,
    allowTaint: true,
  });

  const targetCanvas = document.createElement('canvas');
  targetCanvas.width = size.width;
  targetCanvas.height = size.height;
  
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(canvas, 0, 0, size.width, size.height);

  return new Promise((resolve, reject) => {
    targetCanvas.toBlob(
      (blob) => {
        if (blob) {
          const extension = format === 'jpeg' ? 'jpg' : 'png';
          resolve({
            blob,
            filename: `${filename}.${extension}`,
          });
        } else {
          reject(new Error('Failed to create blob'));
        }
      },
      `image/${format}`,
      format === 'jpeg' ? quality : undefined
    );
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportAndDownload(
  element: HTMLElement,
  size: ExportSize,
  format: ExportFormat,
  quality: number,
  filename: string
): Promise<void> {
  const result = await exportScreenshot(element, size, format, quality, filename);
  downloadBlob(result.blob, result.filename);
}

export async function batchExport(
  elements: HTMLElement[],
  size: ExportSize,
  format: ExportFormat,
  quality: number,
  filenamePattern: string = 'screenshot-{index}'
): Promise<ExportResult[]> {
  const results: ExportResult[] = [];
  
  for (let i = 0; i < elements.length; i++) {
    const filename = filenamePattern.replace('{index}', String(i + 1));
    const result = await exportScreenshot(elements[i], size, format, quality, filename);
    results.push(result);
  }
  
  return results;
}

export async function batchExportAsZip(
  elements: HTMLElement[],
  size: ExportSize,
  format: ExportFormat,
  quality: number,
  filenamePattern: string = 'screenshot-{index}'
): Promise<void> {
  const results = await batchExport(elements, size, format, quality, filenamePattern);
  
  for (const result of results) {
    downloadBlob(result.blob, result.filename);
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}
