export const SITE_URL =
  import.meta.env.VITE_SITE_URL || "https://www.heritagesparrow.com";

export function absoluteUrl(path = "/") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL.replace(/\/$/, "")}${cleanPath}`;
}
