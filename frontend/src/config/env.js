// config/env.js

const env = {
  API_URL: import.meta.env.VITE_API_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME,
  USE_MOCK: import.meta.env.VITE_USE_MOCK,
  MODE: import.meta.env.MODE
};
export default env
