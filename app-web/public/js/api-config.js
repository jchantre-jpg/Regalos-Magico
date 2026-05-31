// RegaloMágico - Config de backend (Express + PostgreSQL)
// Variables globales consumidas por admin.js y products-store.js:
// - API_BASE_URL
// - USE_API

let API_BASE_URL = '/api';
const USE_API = true;

const FRONTEND_HOST = (typeof window !== 'undefined' && window.location && window.location.hostname)
  ? window.location.hostname
  : 'localhost';
const FRONTEND_PROTOCOL = (typeof window !== 'undefined' && window.location && window.location.protocol)
  ? window.location.protocol
  : 'http:';

const API_BASE_URL_CANDIDATES = [];
if (typeof window !== 'undefined' && window.location?.origin) {
  API_BASE_URL_CANDIDATES.push(`${window.location.origin.replace(/\/$/, '')}/api`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function pingApiBaseUrl(apiBaseUrl) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 1500);
  try {
    const res = await fetch(`${apiBaseUrl}/health`, { signal: controller.signal, method: 'GET' });
    return res && res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}

const apiBaseUrlReady = (async () => {
  for (const candidate of API_BASE_URL_CANDIDATES) {
    if (await pingApiBaseUrl(candidate)) {
      API_BASE_URL = candidate;
      return;
    }
    await sleep(50);
  }
})();
