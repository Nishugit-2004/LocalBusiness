import axios from 'axios';

const isLocalhost = window.location.hostname === 'localhost';

// Use your LIVE Vercel Backend URL as the permanent master address
const PRODUCTION_URL = 'https://local-business-ebon.vercel.app';
const LOCALTUNNEL_URL = 'https://thin-kings-cough.loca.lt';

const API_BASE_URL = (
  process.env.REACT_APP_API_URL || 
  (isLocalhost ? LOCALTUNNEL_URL : PRODUCTION_URL)
).replace(/\/$/, '');

// Guarantee every generic axios call universally injects the LocalTunnel Bypass
axios.defaults.headers.common['Bypass-Tunnel-Reminder'] = 'true';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
export { API_BASE_URL };
