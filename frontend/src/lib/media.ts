// Shared video rendering + global mute behavior for media carousels.
//
// Product media is stored as opaque keys in the inventory item's `photos`
// array. The photos backend transcodes every video to MP4, so a `.mp4` key
// identifies a video; everything else renders as an <img>.

let videoMuted = true;
let syncing = false;
let installed = false;

export function isVideoKey(key: string | null | undefined): boolean {
  return typeof key === 'string' && /\.(mp4|webm|m4v|ogv|mov|3gp)([?#].*)?$/i.test(key);
}

/**
 * Storage URL for a content key, e.g. `inventory/<id>/<uuid>.webp`.
 * Pass the photos API base (`.../api`) as `base`.
 */
export function storageContentUrl(base: string, key?: string | null): string {
  if (!key) return '';
  return `${base.replace(/\/+$/, '')}/storage/content/${key.split('/').map(encodeURIComponent).join('/')}`;
}

/**
 * Thumbnail storage URL for an image key. The photos backend stores a
 * `-thumb.webp` sibling for every image; videos/documents have none, so for
 * those this returns the original key URL (callers render video thumbs / files
 * differently anyway). Images uploaded before thumbnails existed have no
 * `-thumb.webp` object — callers should fall back to the full URL on error.
 */
export function thumbnailContentUrl(base: string, key?: string | null): string {
  if (!key || isVideoKey(key)) return storageContentUrl(base, key);
  const thumbKey = key.replace(/\.[a-z0-9]+$/i, '-thumb.webp');
  return storageContentUrl(base, thumbKey);
}

/** `<img>` src with onerror fallback to the full image (for legacy items). */
export function thumbImageSrc(base: string, key: string, alt: string, className = ''): string {
  const thumb = thumbnailContentUrl(base, key);
  const full = storageContentUrl(base, key);
  return `<img src="${thumb}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${full}'" alt="${alt.replace(/"/g, '&quot;')}"${className ? ` class="${className}"` : ''} />`;
}

export function getVideoMuted(): boolean {
  return videoMuted;
}

export function setVideoMuted(muted: boolean): void {
  videoMuted = muted;
}

/**
 * HTML for a video slide. Videos are muted by default so they can autoplay;
 * unmuting one is a global preference applied to every other video on the
 * page until one is muted again. `controls` gives native play/pause, mute,
 * and fullscreen.
 */
export function videoMarkup(options: {
  src: string;
  className?: string;
  label?: string;
  controls?: boolean;
}): string {
  const { src, className = '', label = '', controls = true } = options;
  const muted = videoMuted ? ' muted' : '';
  const alt = label ? ` aria-label="${label.replace(/"/g, '&quot;')}"` : '';
  const attrs = controls ? ' controls' : '';
  return `<video src="${src}"${muted}${attrs} autoplay playsinline loop preload="metadata"${alt} data-video class="${className}"></video>`;
}

/** Compact tile for a video thumbnail: a play badge, no second video decode. */
export function videoThumbMarkup(label = 'Video'): string {
  return `<span class="flex size-full items-center justify-center bg-navy-950" aria-hidden="true"><svg class="size-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m10 8 6 4-6 4V8Z" /></svg><span class="sr-only">${label}</span></span>`;
}

/** Idempotent: wires the global mute sync once per page load. */
export function installVideoBehaviors(): void {
  if (installed) return;
  installed = true;
  // Any native mute/unmute interaction updates the global preference and is
  // applied to every video already on the page.
  document.addEventListener(
    'volumechange',
    (event) => {
      if (syncing) return;
      const video = event.target;
      if (!(video instanceof HTMLVideoElement)) return;
      const next = video.muted;
      if (videoMuted === next) return;
      videoMuted = next;
      applyMuteToAll();
    },
    true
  );
}

/** Push the current global mute preference onto every rendered video. */
export function applyMuteToAll(): void {
  syncing = true;
  document.querySelectorAll<HTMLVideoElement>('video[data-video]').forEach((video) => {
    if (video.muted !== videoMuted) video.muted = videoMuted;
  });
  syncing = false;
}
