const B62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const hexToBytes = (hex: string): number[] => {
  const bytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2) bytes.push(parseInt(hex.slice(i, i + 2), 16));
  return bytes;
};

const bytesToBase62 = (bytes: number[]): string => {
  let value = bytes.reduce((acc, byte) => acc * 256n + BigInt(byte), 0n);
  if (value === 0n) return '0'.repeat(bytes.length);
  let out = '';
  while (value > 0n) {
    out = B62[Number(value % 62n)] + out;
    value = value / 62n;
  }
  return out;
};

const base62ToBytes = (token: string): number[] => {
  let value = 0n;
  for (const char of token) value = value * 62n + BigInt(B62.indexOf(char));
  const bytes: number[] = [];
  while (value > 0n) {
    bytes.unshift(Number(value % 256n));
    value = value / 256n;
  }
  return bytes;
};

const bytesToHex = (bytes: number[]): string =>
  bytes.map(byte => byte.toString(16).padStart(2, '0')).join('');

export const slugify = (title: string): string =>
  String(title || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
    .replace(/-+$/g, '') || 'barang';

export const encodeItemToken = (id: string): string => {
  const hex = String(id || '').toLowerCase().replace(/-/g, '');
  if (!/^[0-9a-f]{32}$/.test(hex)) return '';
  return bytesToBase62(hexToBytes(hex));
};

export const decodeItemToken = (token: string): string | null => {
  if (!/^[0-9A-Za-z]{20,24}$/.test(token)) return null;
  const hex = bytesToHex(base62ToBytes(token));
  if (hex.length !== 32) return null;
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

export const inventoryDetailPath = (item: { id: string; title?: string }): string => {
  const token = encodeItemToken(item.id);
  // Trailing slash matches the site's `trailingSlash: 'always'` output so the
  // pretty URL serves the pre-rendered directory index directly.
  return `/inventory/detail/${slugify(item.title || '')}-${token || item.id}/`;
};

export const inventoryDetailIdFromPath = (pathname: string): string | null => {
  const path = pathname.replace(/\/+$/, '');
  const match = path.match(/^\/inventory\/detail\/(.+)$/);
  if (!match) return null;
  const parts = match[1].split('-');
  const token = parts[parts.length - 1];
  if (!token || token.length < 20) return null;
  return decodeItemToken(token);
};

export const marketplaceDetailPath = (item: { id: string; title?: string }): string => {
  const token = encodeItemToken(item.id);
  return `/marketplace/detail/${slugify(item.title || '')}-${token || item.id}/`;
};

export const marketplaceDetailIdFromPath = (pathname: string): string | null => {
  const path = pathname.replace(/\/+$/, '');
  const match = path.match(/^\/marketplace\/detail\/(.+)$/);
  if (!match) return null;
  const parts = match[1].split('-');
  const token = parts[parts.length - 1];
  if (!token || token.length < 20) return null;
  return decodeItemToken(token);
};
