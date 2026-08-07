export interface Slider {
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  index: number;
}

/**
 * Wires a horizontal sliding carousel inside `root`.
 *
 * Expected markup:
 *   [data-slide-track]        flex row of slides, each 100% wide and shrink-0.
 *                             The translateX is applied here; give it an inline
 *                             transition for the slide animation.
 *   [data-slide-prev]         optional previous button
 *   [data-slide-next]         optional next button
 *   [data-slide-thumb]        optional thumbnail buttons, `data-slide-thumb="{i}"`
 *   [data-slide-count]        optional counter span, updated to "{i+1}/{total}"
 *
 * `onIndexChange` lets the caller reflect the active slide (lightbox index,
 * thumbnail highlight, etc.).
 */
export function initSlider(
  root: Element,
  options: { initialIndex?: number; onIndexChange?: (index: number) => void } = {}
): Slider | null {
  const track = root.querySelector<HTMLElement>('[data-slide-track]');
  if (!track || track.children.length === 0) return null;
  const total = track.children.length;
  let index = Math.min(Math.max(options.initialIndex ?? 0, 0), total - 1);

  const render = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
    root.querySelectorAll<HTMLElement>('[data-slide-count]').forEach(counter => {
      counter.textContent = `${index + 1}/${total}`;
    });
    root.querySelectorAll<HTMLElement>('[data-slide-thumb]').forEach(thumb => {
      if (Number(thumb.dataset.slideThumb) === index) thumb.setAttribute('aria-current', 'true');
      else thumb.removeAttribute('aria-current');
    });
    options.onIndexChange?.(index);
  };

  const goTo = (nextIndex: number) => {
    index = ((nextIndex % total) + total) % total;
    render();
  };
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  root.querySelectorAll<HTMLElement>('[data-slide-prev]').forEach(button => {
    button.addEventListener('click', event => { event.stopPropagation(); prev(); });
  });
  root.querySelectorAll<HTMLElement>('[data-slide-next]').forEach(button => {
    button.addEventListener('click', event => { event.stopPropagation(); next(); });
  });
  root.querySelectorAll<HTMLElement>('[data-slide-thumb]').forEach(thumb => {
    thumb.addEventListener('click', () => goTo(Number(thumb.dataset.slideThumb)));
  });

  render();
  return { goTo, next, prev, get index() { return index; } };
}
