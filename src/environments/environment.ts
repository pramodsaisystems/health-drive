// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  version: new Date().getTime(),
  production: false,
  backend: 'https://navigatehrdevapi-a4gecsfga6fnaxef.eastus-01.azurewebsites.net/api/',
  // backend: 'https://navigatehrv2025prodapi.azurewebsites.net/api/'
  hdAPI: 'http://localhost:22863/api/',
  hdAPI2: 'http://localhost:5133/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
