export function setThemeColors({ bg, text, surface, border } = {}) {
  const root = document.documentElement;
  if (bg) root.style.setProperty('--color-bg', bg);
  if (text) root.style.setProperty('--color-text', text);
  if (surface) root.style.setProperty('--color-surface', surface);
  if (border) root.style.setProperty('--color-border', border);
}
