import axios from 'axios';

const PRODUCTION_URL = 'https://local-business-ebon.vercel.app';
const LOCALTUNNEL_URL = 'https://thin-kings-cough.loca.lt';

// DETECTION: Check if we are running inside the Capacitor Android/iOS App
const isNativeApp = window.location.protocol === 'capacitor:' || 
                   window.location.protocol === 'http:' && window.location.hostname === 'localhost';

const API_BASE_URL = (
  process.env.REACT_APP_API_URL || 
  (isNativeApp ? PRODUCTION_URL : PRODUCTION_URL) // Force Production for now to be 100% sure
).replace(/\/$/, '');

// Guarantee every generic axios call universally injects the LocalTunnel Bypass
axios.defaults.headers.common['Bypass-Tunnel-Reminder'] = 'true';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
export { API_BASE_URL };
