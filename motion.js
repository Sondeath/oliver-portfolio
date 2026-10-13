export const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

// The timeline is bounded by the actual sticky interval, including mobile layout.
export function scrollProgress(scrollY, start, sectionHeight, viewportHeight) {
  const distance = sectionHeight - viewportHeight;
  return distance > 0 ? clamp((scrollY - start) / distance) : 0;
}

export function approach(current, target, elapsed) {
  const next = current + (target - current) * (1 - Math.exp(-elapsed / 85));
  return Math.abs(target - next) < 0.0001 ? target : next;
}
