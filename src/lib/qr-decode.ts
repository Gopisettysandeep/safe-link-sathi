// Robust multi-strategy QR decoding:
// 1) Native BarcodeDetector  2) jsQR (with image enhancement passes)  3) ZXing
import jsQR from 'jsqr';

export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];

async function loadImage(src: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = src;
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });
  return img;
}

function drawToCanvas(img: HTMLImageElement, scale: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const maxSide = 1600;
  let w = img.naturalWidth * scale;
  let h = img.naturalHeight * scale;
  const longest = Math.max(w, h);
  if (longest > maxSide) {
    const k = maxSide / longest;
    w *= k;
    h *= k;
  }
  canvas.width = Math.max(1, Math.round(w));
  canvas.height = Math.max(1, Math.round(h));
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}

type Enhancement = 'none' | 'contrast' | 'threshold' | 'invert';

function enhance(data: ImageData, mode: Enhancement): ImageData {
  if (mode === 'none') return data;
  const d = data.data;
  for (let i = 0; i < d.length; i += 4) {
    let v = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    if (mode === 'contrast') v = Math.min(255, Math.max(0, (v - 128) * 1.8 + 128));
    else if (mode === 'threshold') v = v > 128 ? 255 : 0;
    else if (mode === 'invert') v = 255 - v;
    d[i] = d[i + 1] = d[i + 2] = v;
  }
  return data;
}

function tryJsQr(canvas: HTMLCanvasElement, mode: Enhancement): string | null {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  const imageData = enhance(ctx.getImageData(0, 0, canvas.width, canvas.height), mode);
  const res = jsQR(imageData.data, canvas.width, canvas.height, { inversionAttempts: 'attemptBoth' });
  return res?.data ?? null;
}

async function tryZxing(canvas: HTMLCanvasElement): Promise<string | null> {
  try {
    const { QRCodeReader, RGBLuminanceSource, HybridBinarizer, BinaryBitmap } = await import(
      '@zxing/library'
    );
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const luminances = new Uint8ClampedArray(width * height);
    for (let i = 0, p = 0; i < data.length; i += 4, p++) {
      luminances[p] = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) | 0;
    }
    const bitmap = new BinaryBitmap(
      new HybridBinarizer(new RGBLuminanceSource(luminances, width, height)),
    );
    return new QRCodeReader().decode(bitmap).getText();
  } catch {
    return null;
  }
}

export async function decodeFromCanvas(canvas: HTMLCanvasElement): Promise<string | null> {
  for (const mode of ['none', 'contrast', 'threshold', 'invert'] as Enhancement[]) {
    const value = tryJsQr(canvas, mode);
    if (value) return value;
  }
  return tryZxing(canvas);
}

/** Decode from a live <video> element — native detector first, canvas fallback. */
export async function decodeFromVideo(
  video: HTMLVideoElement,
  detector?: any,
): Promise<string | null> {
  try {
    if (detector) {
      const codes = await detector.detect(video);
      if (codes?.length) return codes[0].rawValue as string;
    }
  } catch {
    /* fall through */
  }
  if (!video.videoWidth) return null;
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  for (const mode of ['none', 'contrast'] as Enhancement[]) {
    const value = tryJsQr(canvas, mode);
    if (value) return value;
  }
  return null;
}

/** Decode a QR from an uploaded image file (screenshots, photos, PNG/JPG/WEBP/GIF). */
export async function decodeQrFromFile(file: File): Promise<string | null> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);

    // 1) Native BarcodeDetector
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
      try {
        const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
        const codes = await detector.detect(img);
        if (codes?.length) return codes[0].rawValue as string;
      } catch {
        /* continue */
      }
    }

    // 2/3) jsQR + ZXing across multiple scales (helps low-res screenshots)
    for (const scale of [1, 2, 0.5, 3]) {
      const canvas = drawToCanvas(img, scale);
      const value = await decodeFromCanvas(canvas);
      if (value) return value;
    }
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}
