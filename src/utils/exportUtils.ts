import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { ExportSize, ExportFormat } from '../data/exportSizes';

export interface ExportResult {
  blob: Blob;
  filename: string;
}

export async function exportScreenshot(
  element: HTMLElement,
  _size: ExportSize,
  format: ExportFormat,
  quality: number = 0.92,
  filename: string = 'screenshot'
): Promise<ExportResult> {
  // Capture the element at 1:1 scale - element should already be at target resolution
  const canvas = await html2canvas(element, {
    scale: 1,
    useCORS: true,
    backgroundColor: null,
    logging: false,
    allowTaint: true,
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob(
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
  results: ExportResult[],
  zipFilename: string = 'screenshots'
): Promise<void> {
  const zip = new JSZip();
  
  for (const result of results) {
    zip.file(result.filename, result.blob);
  }
  
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(zipBlob, `${zipFilename}.zip`);
}

export async function exportAllAsZip(
  elements: HTMLElement[],
  size: ExportSize,
  format: ExportFormat,
  quality: number,
  filenamePattern: string = 'screenshot-{index}',
  zipFilename: string = 'screenshots'
): Promise<void> {
  const results = await batchExport(elements, size, format, quality, filenamePattern);
  await batchExportAsZip(results, zipFilename);
}
