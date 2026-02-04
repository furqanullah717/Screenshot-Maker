import html2canvas from 'html2canvas';
import JSZip from 'jszip';
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
  // Calculate scale to match target size
  const scaleX = size.width / element.offsetWidth;
  const scaleY = size.height / element.offsetHeight;
  const scale = Math.max(scaleX, scaleY);
  
  const canvas = await html2canvas(element, {
    scale: scale,
    useCORS: true,
    backgroundColor: null,
    logging: false,
    allowTaint: true,
    width: element.offsetWidth,
    height: element.offsetHeight,
  });

  // Create target canvas with exact export dimensions
  const targetCanvas = document.createElement('canvas');
  targetCanvas.width = size.width;
  targetCanvas.height = size.height;
  
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Clear and fill with background
  ctx.clearRect(0, 0, size.width, size.height);

  // Calculate how to draw the source to fill the target
  const sourceAspect = canvas.width / canvas.height;
  const targetAspect = size.width / size.height;

  let sourceX = 0;
  let sourceY = 0;
  let sourceW = canvas.width;
  let sourceH = canvas.height;

  if (sourceAspect > targetAspect) {
    // Source is wider - crop sides
    sourceW = canvas.height * targetAspect;
    sourceX = (canvas.width - sourceW) / 2;
  } else if (sourceAspect < targetAspect) {
    // Source is taller - crop top/bottom
    sourceH = canvas.width / targetAspect;
    sourceY = (canvas.height - sourceH) / 2;
  }

  // Draw cropped and scaled to fill target exactly
  ctx.drawImage(
    canvas,
    sourceX, sourceY, sourceW, sourceH,
    0, 0, size.width, size.height
  );

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
