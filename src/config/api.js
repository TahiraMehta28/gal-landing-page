const isLocal =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.') ||
    window.location.hostname.startsWith('10.'));

export const BACKEND_URL =
  import.meta.env.VITE_API_URL ||
  (isLocal ? 'http://localhost:5000' : 'https://gal-backend-2psp.onrender.com');

export const AUTH_API_URL = `${BACKEND_URL}/api/auth`;
export const TELL_GAL_API_URL = `${BACKEND_URL}/api/tell-gal`;
