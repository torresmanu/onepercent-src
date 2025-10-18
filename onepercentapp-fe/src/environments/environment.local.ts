export const environment = {
  production: false,
  dbName: '__App_OnePercent_LOCAL_DB',
  logStorageOnStartup: true,
  apiBaseUrl: 'http://localhost:3000',
  assetsUrl: 'http://localhost:3000',

  emailRegex: new RegExp(
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  ),
  passwordRegex: new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d_~@#$%^&*+=`|{}:;¡!.¿?\"()\[\]-]{8,16}$/
  ),
  phoneRegex: new RegExp(/^(?:6[\d]|7[1-9]|9[1-9])[\d]{7}$/),
  firebase: {
    apiKey: 'AIzaSyDlXf8nUNxJ3lGWqkGlPnSdIlLEdvU0Ba8',
    authDomain: 'onepercent-bc810.firebaseapp.com',
    projectId: 'onepercent-bc810',
    storageBucket: 'onepercent-bc810.firebasestorage.app',
    messagingSenderId: '157423904083',
    appId: '1:157423904083:web:e134550eaa81e4ec1a6da6',
    measurementId: 'G-GN06QBQKVD',
  },
  firebaseMessagingVapidKey:
    'BMl_CzTrhRXHvV5JI8Sp8ZYSfqp4NqpBWYQXZ1pYnA1RhTbHXD7NEWY8_lrm-dASuc8uwqgbV1HYzbCySxxRCa0',
  platform: 'web',
  appScheme: 'onepercentapp'
};

/*
 * Local development environment configuration
 * Uses local backend running on port 3000
 */

