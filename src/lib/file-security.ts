// Secure image upload validation for QR uploads.
// Allowlist-based: only PNG, JPG/JPEG and WEBP are accepted.
// Validates extension, MIME type, size, magic bytes (file signature) and
// performs a safe decode check (corrupted / oversized images are rejected).

export const ALLOWED_MIME = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'] as const;
export const ALLOWED_EXT = ['png', 'jpg', 'jpeg', 'webp'] as const;

export const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB
export const MAX_PIXELS = 40_000_000; // ~40 MP guards against decompression bombs

export type FileCheckResult =
  | { ok: true; kind: 'png' | 'jpeg' | 'webp'; width: number; height: number }
  | { ok: false; reason: string };

function extOf(name: string): string {
  const i = name.lastIndexOf('.');
  return i === -1 ? '' : name.slice(i + 1).toLowerCase();
}

/** Reads the first bytes and matches against known image signatures. */
async function signatureOf(file: File): Promise<'png' | 'jpeg' | 'webp' | null> {
  const buf = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const b = (i: number) => buf[i];
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (b(0) === 0x89 && b(1) === 0x50 && b(2) === 0x4e && b(3) === 0x47 && b(4) === 0x0d && b(5) === 0x0a && b(6) === 0x1a && b(7) === 0x0a) return 'png';
  // JPEG: FF D8 FF
  if (b(0) === 0xff && b(1) === 0xd8 && b(2) === 0xff) return 'jpeg';
  // WEBP: "RIFF" .... "WEBP"
  if (b(0) === 0x52 && b(1) === 0x49 && b(2) === 0x46 && b(3) === 0x46 && b(8) === 0x57 && b(9) === 0x45 && b(10) === 0x42 && b(11) === 0x50) return 'webp';
  return null;
}

/** Safely decodes the image in an isolated object URL to confirm it is a real image. */
async function safeDecode(file: File): Promise<{ width: number; height: number } | null> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    const loaded = await new Promise<boolean>((resolve) => {
      const timer = setTimeout(() => resolve(false), 10_000); // resource-exhaustion guard
      img.onload = () => { clearTimeout(timer); resolve(true); };
      img.onerror = () => { clearTimeout(timer); resolve(false); };
    });
    if (!loaded || !img.naturalWidth || !img.naturalHeight) return null;
    return { width: img.naturalWidth, height: img.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function validateImageFile(file: File): Promise<FileCheckResult> {
  if (file.size === 0) return { ok: false, reason: 'This file is empty. Please choose a QR image.' };
  if (file.size > MAX_FILE_BYTES) {
    return { ok: false, reason: `This file is too large. Maximum allowed size is ${MAX_FILE_BYTES / (1024 * 1024)} MB.` };
  }

  const ext = extOf(file.name);
  if (ext && !(ALLOWED_EXT as readonly string[]).includes(ext)) {
    return { ok: false, reason: 'Unsupported file type. Only PNG, JPG, JPEG and WEBP images are allowed.' };
  }
  if (file.type && !(ALLOWED_MIME as readonly string[]).includes(file.type)) {
    return { ok: false, reason: 'Unsupported file type. Only PNG, JPG, JPEG and WEBP images are allowed.' };
  }

  const kind = await signatureOf(file);
  if (!kind) {
    return { ok: false, reason: 'This file is not a valid image. Archives, documents and executables are blocked.' };
  }
  if (file.type === 'image/png' && kind !== 'png') return { ok: false, reason: 'File contents do not match its type. Upload blocked.' };
  if ((file.type === 'image/jpeg' || file.type === 'image/jpg') && kind !== 'jpeg') return { ok: false, reason: 'File contents do not match its type. Upload blocked.' };
  if (file.type === 'image/webp' && kind !== 'webp') return { ok: false, reason: 'File contents do not match its type. Upload blocked.' };

  const dims = await safeDecode(file);
  if (!dims) return { ok: false, reason: 'This image appears to be corrupted and could not be opened.' };
  if (dims.width * dims.height > MAX_PIXELS) {
    return { ok: false, reason: 'This image has too many pixels to process safely.' };
  }

  return { ok: true, kind, width: dims.width, height: dims.height };
}
