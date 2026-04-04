import axios from 'axios';

const API_BASE_URL = (process.env.REACT_APP_API_URL || 'https://thin-kings-cough.loca.lt').replace(/\/$/, '');

// Guarantee every generic axios call universally injects the LocalTunnel Bypass
axios.defaults.headers.common['Bypass-Tunnel-Reminder'] = 'true';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
export { API_BASE_URL };
