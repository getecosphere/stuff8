type LightboxPhoto = { src: string; alt: string };

let activeIndex = 0;
let photos: LightboxPhoto[] = [];
let overlay: HTMLElement | null = null;
let image: HTMLImageElement | null = null;
let counter: HTMLElement | null = null;
let caption: HTMLElement | null = null;
let restoreFocus: Element | null = null;
let touchStartX = 0;

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function render() {
  const photo = photos[activeIndex];
  if (!photo || !image || !counter) return;
  image.src = photo.src;
  image.alt = photo.alt;
  counter.textContent = `${activeIndex + 1} / ${photos.length}`;
  if (caption) caption.textContent = photos.length > 1 ? photo.alt : '';
  image.classList.remove('lb-img-swap');
  if (!prefersReducedMotion()) {
    void image.offsetWidth;
    image.classList.add('lb-img-swap');
  }
}

function close() {
  if (!overlay) return;
  const toRemove = overlay;
  overlay = null;
  toRemove.classList.add('lb-leave');
  toRemove.addEventListener('animationend', () => toRemove.remove(), { once: true });
  document.body.style.overflow = '';
  document.removeEventListener('keydown', onKeydown);
  if (restoreFocus instanceof HTMLElement) restoreFocus.focus();
}

function step(delta: number) {
  if (!photos.length) return;
  activeIndex = (activeIndex + delta + photos.length) % photos.length;
  render();
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close();
  else if (event.key === 'ArrowLeft') step(-1);
  else if (event.key === 'ArrowRight') step(1);
}

export function openLightbox(source: LightboxPhoto[], startIndex = 0) {
  if (!source.length) return;
  photos = source;
  activeIndex = Math.max(0, Math.min(photos.length - 1, startIndex));
  restoreFocus = document.activeElement;

  overlay = document.createElement('div');
  overlay.className = 'lb-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Pratinjau foto barang');

  const figure = document.createElement('figure');
  figure.className = 'lb-figure';
  image = document.createElement('img');
  image.className = 'lb-img';
  image.alt = '';
  figure.append(image);

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'lb-close';
  closeButton.setAttribute('aria-label', 'Tutup pratinjau');
  closeButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" d="M6 6l12 12M18 6L6 18"/></svg>';

  const prevButton = document.createElement('button');
  prevButton.type = 'button';
  prevButton.className = 'lb-nav lb-nav-prev';
  prevButton.setAttribute('aria-label', 'Foto sebelumnya');
  prevButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>';

  const nextButton = document.createElement('button');
  nextButton.type = 'button';
  nextButton.className = 'lb-nav lb-nav-next';
  nextButton.setAttribute('aria-label', 'Foto berikutnya');
  nextButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>';

  counter = document.createElement('div');
  counter.className = 'lb-counter';

  caption = document.createElement('figcaption');
  caption.className = 'lb-caption';

  overlay.append(closeButton, prevButton, figure, nextButton, counter, caption);

  const onCloseClick = (event: MouseEvent) => {
    if (event.target === overlay || event.target === figure) close();
  };
  overlay.addEventListener('click', onCloseClick);
  closeButton.addEventListener('click', close);
  prevButton.addEventListener('click', () => step(-1));
  nextButton.addEventListener('click', () => step(1));

  overlay.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0]?.clientX ?? 0;
  }, { passive: true });
  overlay.addEventListener('touchend', (event) => {
    const delta = (event.changedTouches[0]?.clientX ?? touchStartX) - touchStartX;
    if (Math.abs(delta) > 40) step(delta > 0 ? -1 : 1);
  }, { passive: true });

  document.addEventListener('keydown', onKeydown);

  document.body.append(overlay);
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => overlay?.classList.add('lb-open'));
  closeButton.focus();
  render();
}
