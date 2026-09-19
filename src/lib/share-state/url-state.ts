/**
 * Encodes an object state into a URL-safe Base64 string.
 */
export function encodeStateToUrl<T>(state: T): string {
  try {
    const jsonStr = JSON.stringify(state);
    if (typeof window !== 'undefined' && window.btoa) {
      return encodeURIComponent(window.btoa(unescape(encodeURIComponent(jsonStr))));
    }
    return encodeURIComponent(Buffer.from(jsonStr).toString('base64'));
  } catch (err) {
    console.error('Failed to encode state', err);
    return '';
  }
}

/**
 * Decodes a URL-safe Base64 string into a typed object state.
 */
export function decodeStateFromUrl<T>(encoded: string): T | null {
  try {
    const decodedUri = decodeURIComponent(encoded);
    let jsonStr: string;
    if (typeof window !== 'undefined' && window.atob) {
      jsonStr = decodeURIComponent(escape(window.atob(decodedUri)));
    } else {
      jsonStr = Buffer.from(decodedUri, 'base64').toString('utf-8');
    }
    return JSON.parse(jsonStr) as T;
  } catch (err) {
    console.warn('Failed to decode state from URL', err);
    return null;
  }
}
