export interface FraudResult {
  score: number;
  status: 'safe' | 'caution' | 'fraud';
  reasons: string[];
}

const SUSPICIOUS_KEYWORDS = [
  'verify', 'alert', 'free', 'update', 'secure', 'login', 'confirm',
  'suspend', 'blocked', 'urgent', 'winner', 'prize', 'lottery', 'claim',
  'expire', 'limited', 'offer', 'bonus', 'reward', 'congratulations',
  'click-here', 'act-now', 'reset-password', 'account-locked',
];

const SUSPICIOUS_TLDS = [
  '.xyz', '.top', '.click', '.info', '.gq', '.ml', '.cf', '.tk',
  '.buzz', '.club', '.work', '.life', '.loan', '.win', '.bid',
  '.racing', '.review', '.date', '.accountant', '.science',
];

const TRUSTED_DOMAINS = [
  'google.com', 'paytm.com', 'phonepe.com', 'gpay.com',
  'razorpay.com', 'paypal.com', 'stripe.com', 'upi.org',
  'npci.org.in', 'sbi.co.in', 'hdfcbank.com', 'icicibank.com',
  'axisbank.com', 'amazon.in', 'flipkart.com', 'github.com',
];

const BLACKLISTED_PATTERNS = [
  /bit\.ly/i, /tinyurl\.com/i, /goo\.gl/i, /t\.co\//i, /ow\.ly/i, /rb\.gy/i,
  /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, // raw IP
  /@.*@/, // double @ signs
  /xn--/i, // punycode (homoglyph attacks)
  /(paytm|phonepe|gpay|sbi|hdfc|icici|axis|kotak)[-.][a-z]{2,}\.(xyz|top|click|info|gq|ml|cf|tk|buzz)/i,
  /(verify|kyc|update|secure|refund|reward)-?(account|wallet|bank|upi)/i,
];

// Known fraud reports cached locally — extendable via community feed
const KNOWN_FRAUD_DOMAINS = [
  'sbi-verify.xyz', 'paytm-kyc.top', 'hdfc-secure.click', 'upi-reward.gq',
];

export function analyzeUrl(url: string): FraudResult {
  const reasons: string[] = [];
  let score = 0;

  const trimmed = url.trim().toLowerCase();

  // Check protocol
  if (trimmed.startsWith('http://')) {
    score += 20;
    reasons.push('Uses insecure HTTP instead of HTTPS');
  } else if (!trimmed.startsWith('https://') && !trimmed.startsWith('upi://')) {
    score += 10;
    reasons.push('Missing secure protocol');
  }

  // Check suspicious keywords
  const foundKeywords = SUSPICIOUS_KEYWORDS.filter(k => trimmed.includes(k));
  if (foundKeywords.length > 0) {
    score += Math.min(foundKeywords.length * 10, 30);
    reasons.push(`Suspicious keywords: ${foundKeywords.slice(0, 3).join(', ')}`);
  }

  // Check TLD
  const hasSuspiciousTld = SUSPICIOUS_TLDS.some(tld => trimmed.includes(tld));
  if (hasSuspiciousTld) {
    score += 25;
    reasons.push('Suspicious domain extension detected');
  }

  // Check blacklisted patterns
  const matchesBlacklist = BLACKLISTED_PATTERNS.some(p => p.test(trimmed));
  if (matchesBlacklist) {
    score += 30;
    reasons.push('URL matches known suspicious pattern');
  }

  // Check for IP-based URL
  if (/https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(trimmed)) {
    score += 25;
    reasons.push('Uses IP address instead of domain name');
  }

  // Check for excessive subdomains
  try {
    const urlObj = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    const parts = urlObj.hostname.split('.');
    if (parts.length > 4) {
      score += 15;
      reasons.push('Excessive subdomains detected');
    }

    if (KNOWN_FRAUD_DOMAINS.some(d => urlObj.hostname.includes(d))) {
      score += 50;
      reasons.push('Domain found in known fraud list');
    }

    if (/[0o]{2,}|rn|vv|1l|l1/i.test(urlObj.hostname) && !TRUSTED_DOMAINS.some(d => urlObj.hostname.endsWith(d))) {
      score += 15;
      reasons.push('Possible lookalike domain (homoglyph) detected');
    }

    const isTrusted = TRUSTED_DOMAINS.some(d => urlObj.hostname.endsWith(d));
    if (isTrusted) {
      score = Math.max(0, score - 30);
      reasons.push('Domain belongs to a trusted provider');
    }
  } catch {
    score += 15;
    reasons.push('Unable to parse URL properly');
  }

  // Check URL length
  if (trimmed.length > 200) {
    score += 10;
    reasons.push('Unusually long URL');
  }

  // Check for encoded characters
  if (/%[0-9a-f]{2}/i.test(trimmed) && trimmed.split('%').length > 5) {
    score += 10;
    reasons.push('Excessive URL encoding detected');
  }

  score = Math.min(100, Math.max(0, score));

  if (reasons.length === 0) {
    reasons.push('No suspicious patterns detected');
  }

  return {
    score,
    status: score <= 30 ? 'safe' : score <= 60 ? 'caution' : 'fraud',
    reasons,
  };
}

export function analyzeQrContent(content: string): FraudResult {
  // Check if it's a UPI link
  if (content.startsWith('upi://')) {
    const reasons: string[] = [];
    let score = 0;

    // Validate UPI format
    if (!content.includes('pa=')) {
      score += 30;
      reasons.push('Missing payee address in UPI link');
    }
    if (!content.includes('pn=')) {
      score += 10;
      reasons.push('Missing payee name in UPI link');
    }
    if (content.includes('am=') && /am=\d{5,}/.test(content)) {
      score += 20;
      reasons.push('Unusually large amount in UPI link');
    }

    if (reasons.length === 0) {
      reasons.push('Valid UPI payment format detected');
    }

    return {
      score: Math.min(100, score),
      status: score <= 30 ? 'safe' : score <= 60 ? 'caution' : 'fraud',
      reasons,
    };
  }

  // If it's a URL
  if (content.startsWith('http') || content.includes('.')) {
    return analyzeUrl(content);
  }

  // Unknown QR content
  return {
    score: 40,
    status: 'caution',
    reasons: ['Unknown QR code format — not a standard payment or URL'],
  };
}
