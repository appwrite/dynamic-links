/**
 * @param {string} url
 * @returns {URL | null}
 */
export function parseUrl(url) {
  try {
    return new URL(url)
  } catch {
    return null
  }
}
