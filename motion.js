export const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

// The timeline is bounded by the actual sticky interval, including mobile layout.
export function scrollProgress(scrollY, start, sectionHeight, viewportHeight) {
  const distance = sectionHeight - viewportHeight;
  return distance > 0 ? clamp((scrollY - start) / distance) : 0;
}

// One reversible handoff: the exhibition arrives as the shirt leaves the hero.
export function workArrival(scrollY, workStart, viewportHeight) {
  if (viewportHeight <= 0) return 1;
  const progress = clamp((viewportHeight * 0.88 - (workStart - scrollY)) / (viewportHeight * 0.63));
  return progress * progress * (3 - 2 * progress);
}

export function approach(current, target, elapsed) {
  const next = current + (target - current) * (1 - Math.exp(-elapsed / 85));
  return Math.abs(target - next) < 0.0001 ? target : next;
}
