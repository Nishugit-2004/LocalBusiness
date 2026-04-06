import axios from 'axios';

const isLocalhost = window.location.hostname === 'localhost';
const defaultURL = 'https://thin-kings-cough.loca.lt';

// Prioritize environment variable, then fallback to current origin if in production, otherwise LocalTunnel
const API_BASE_URL = (
  process.env.REACT_APP_API_URL || 
  (isLocalhost ? defaultURL : window.location.origin)
).replace(/\/$/, '');

// Guarantee every generic axios call universally injects the LocalTunnel Bypass
axios.defaults.headers.common['Bypass-Tunnel-Reminder'] = 'true';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
export { API_BASE_URL };
