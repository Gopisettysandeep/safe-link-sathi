// QR classification & UPI parsing utilities

export type QrCategory =
  | 'upi'
  | 'url'
  | 'wifi'
  | 'contact'
  | 'sms'
  | 'tel'
  | 'geo'
  | 'whatsapp'
  | 'social'
  | 'text'
  | 'unknown';

export interface UpiInfo {
  payeeAddress?: string; // pa
  payeeName?: string;    // pn
  amount?: string;       // am
  currency?: string;     // cu
  note?: string;         // tn
  merchantCode?: string; // mc
  platform?: 'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'upi';
}

export interface QrClassification {
  category: QrCategory;
  isTransaction: boolean;
  label: string;       // Human friendly
  description: string;
  upi?: UpiInfo;
}

function detectPlatformFromUpi(content: string, pa: string | undefined): UpiInfo['platform'] {
  const lc = content.toLowerCase();
  if (lc.includes('mc=5411') || pa?.endsWith('@okhdfcbank') || pa?.endsWith('@okaxis') || pa?.endsWith('@okicici') || pa?.endsWith('@oksbi')) return 'gpay';
  if (pa?.endsWith('@ybl') || pa?.endsWith('@ibl') || pa?.endsWith('@axl')) return 'phonepe';
  if (pa?.endsWith('@paytm')) return 'paytm';
  if (pa?.endsWith('@upi')) return 'bhim';
  return 'upi';
}

export function parseUpi(content: string): UpiInfo | undefined {
  if (!content.toLowerCase().startsWith('upi://')) return undefined;
  try {
    const q = content.split('?')[1] || '';
    const params = new URLSearchParams(q);
    const pa = params.get('pa') || undefined;
    return {
      payeeAddress: pa,
      payeeName: params.get('pn') || undefined,
      amount: params.get('am') || undefined,
      currency: params.get('cu') || undefined,
      note: params.get('tn') || undefined,
      merchantCode: params.get('mc') || undefined,
      platform: detectPlatformFromUpi(content, pa),
    };
  } catch {
    return undefined;
  }
}

export function classifyQr(content: string): QrClassification {
  const raw = content.trim();
  const lc = raw.toLowerCase();

  if (lc.startsWith('upi://')) {
    const upi = parseUpi(raw);
    return {
      category: 'upi',
      isTransaction: true,
      label: 'UPI Payment QR',
      description: upi?.payeeName ? `Pay to ${upi.payeeName}` : 'UPI payment request',
      upi,
    };
  }
  if (lc.startsWith('wifi:')) {
    return { category: 'wifi', isTransaction: false, label: 'Wi-Fi Network QR', description: 'This QR connects you to a Wi-Fi network. Not a payment.' };
  }
  if (lc.startsWith('begin:vcard') || lc.startsWith('mecard:')) {
    return { category: 'contact', isTransaction: false, label: 'Contact Card QR', description: 'This QR shares contact info. Not a payment.' };
  }
  if (lc.startsWith('sms:') || lc.startsWith('smsto:')) {
    return { category: 'sms', isTransaction: false, label: 'SMS QR', description: 'This QR opens an SMS draft. Not a payment.' };
  }
  if (lc.startsWith('tel:')) {
    return { category: 'tel', isTransaction: false, label: 'Phone Number QR', description: 'This QR dials a number. Not a payment.' };
  }
  if (lc.startsWith('geo:')) {
    return { category: 'geo', isTransaction: false, label: 'Location QR', description: 'This QR opens a map location. Not a payment.' };
  }
  if (lc.includes('wa.me') || lc.includes('whatsapp.com')) {
    return { category: 'whatsapp', isTransaction: false, label: 'WhatsApp QR', description: 'This QR opens a WhatsApp chat. Not a payment.' };
  }
  if (lc.includes('instagram.com') || lc.includes('facebook.com') || lc.includes('twitter.com') || lc.includes('youtube.com') || lc.includes('tiktok.com')) {
    return { category: 'social', isTransaction: false, label: 'Social Media QR', description: 'This QR opens a social media link. Not a payment.' };
  }
  if (lc.startsWith('http://') || lc.startsWith('https://')) {
    // Could still be a payment URL — let fraud engine decide, but mark as URL
    return { category: 'url', isTransaction: false, label: 'Website URL QR', description: 'This QR opens a website. We will still check it for fraud.' };
  }
  if (/^[\w.\-]+\.[a-z]{2,}/i.test(raw)) {
    return { category: 'url', isTransaction: false, label: 'Website URL QR', description: 'This QR points to a website.' };
  }
  return { category: lc.length > 0 ? 'text' : 'unknown', isTransaction: false, label: 'Plain Text QR', description: 'This QR contains plain text. Not a payment.' };
}

export function buildDeepLink(platform: UpiInfo['platform'], upi: UpiInfo): string {
  const params = new URLSearchParams();
  if (upi.payeeAddress) params.set('pa', upi.payeeAddress);
  if (upi.payeeName) params.set('pn', upi.payeeName);
  if (upi.amount) params.set('am', upi.amount);
  if (upi.currency) params.set('cu', upi.currency);
  if (upi.note) params.set('tn', upi.note);
  const qs = params.toString();
  switch (platform) {
    case 'gpay': return `tez://upi/pay?${qs}`;
    case 'phonepe': return `phonepe://pay?${qs}`;
    case 'paytm': return `paytmmp://pay?${qs}`;
    case 'bhim': return `upi://pay?${qs}`;
    default: return `upi://pay?${qs}`;
  }
}
