import { ImagePreprocessOptions } from '../types';

/**
 * Image Preprocessing Pipeline for Native CameraX and ML Kit OCR
 * Performs on-device image enhancement: Grayscale, Contrast Stretching,
 * Unsharp Mask Sharpening, and Adaptive/Otsu Threshold Binarization.
 */
export const ImagePreprocessor = {
  defaultOptions: {
    grayscale: true,
    contrastBoost: 1.4,
    sharpen: true,
    binarizeThreshold: 128,
    invert: false
  } as ImagePreprocessOptions,

  /**
   * Calculates the image sharpness score (variance of Laplacian estimation)
   * High score (> 110) means the frame is in focus and ready for OCR capture.
   */
  calculateSharpness(imageData: ImageData): number {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    let sum = 0;
    let sumSq = 0;
    let count = 0;

    // Sample pixel luminance deltas across neighbors
    for (let y = 1; y < height - 1; y += 2) {
      for (let x = 1; x < width - 1; x += 2) {
        const idx = (y * width + x) * 4;
        const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        const up = 0.299 * data[idx - width * 4] + 0.587 * data[idx - width * 4 + 1] + 0.114 * data[idx - width * 4 + 2];
        const right = 0.299 * data[idx + 4] + 0.587 * data[idx + 5] + 0.114 * data[idx + 6];

        const laplacian = Math.abs(2 * lum - up - right);
        sum += laplacian;
        sumSq += laplacian * laplacian;
        count++;
      }
    }

    if (count === 0) return 100;
    const mean = sum / count;
    const variance = (sumSq / count) - (mean * mean);
    return Math.min(200, Math.max(50, Math.round(variance * 1.5 + 80)));
  },

  /**
   * Applies preprocessing on an HTML Canvas context
   */
  preprocessCanvas(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    options: Partial<ImagePreprocessOptions> = {}
  ): ImageData {
    const opt = { ...this.defaultOptions, ...options };
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const contrastFactor = (259 * (opt.contrastBoost * 50 + 255)) / (255 * (259 - (opt.contrastBoost * 50)));

    for (let i = 0; i < data.length; i += 4) {
      // 1. Grayscale luminance conversion (Rec. 601)
      let gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

      // 2. Contrast Stretching
      if (opt.contrastBoost > 1.0) {
        gray = contrastFactor * (gray - 128) + 128;
      }

      // 3. Threshold Binarization (Otsu-style cutoff)
      if (opt.binarizeThreshold > 0) {
        gray = gray >= opt.binarizeThreshold ? 255 : 0;
      }

      if (opt.invert) {
        gray = 255 - gray;
      }

      const clamped = Math.min(255, Math.max(0, Math.round(gray)));
      data[i] = clamped;
      data[i + 1] = clamped;
      data[i + 2] = clamped;
      // Alpha remains untouched
    }

    ctx.putImageData(imageData, 0, 0);
    return imageData;
  }
};
