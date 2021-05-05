declare global {
  interface Window {
    config: any;
  }
}

const appSettings = {
  API_URL: window.config.API_URL,
  ENV: window.config.ENV
};

export default appSettings;
