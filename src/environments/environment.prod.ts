import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  version: new Date().getTime(),
  production: true,
  // backend: 'https://navigatehrv2025prodapi.azurewebsites.net/api/'
  backend: 'https://navigatehrdevapi-a4gecsfga6fnaxef.eastus-01.azurewebsites.net/api/'
};
