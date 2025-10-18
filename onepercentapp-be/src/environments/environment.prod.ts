export const environment = {
  production: true,
  dbName: '__App_OnePercent_DEV_DB',
  logStorageOnStartup: false,
  apiBaseUrl: 'https://onepercentapp-api-int.armadilloamarillo.cloud',
  assetsUrl: "https://onepercentapp-api-int.armadilloamarillo.cloud",

  emailRegex: new RegExp(
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  ),
  passwordRegex: new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d_~@#$%^&*+=`|{}:;¡!.¿?\"()\[\]-]{8,16}$/
  ),
  phoneRegex: new RegExp(/^(?:6[\d]|7[1-9]|9[1-9])[\d]{7}$/),
  firebase: {
    apiKey: "AIzaSyDlXf8nUNxJ3lGWqkGlPnSdIlLEdvU0Ba8",
    authDomain: "onepercent-bc810.firebaseapp.com",
    projectId: "onepercent-bc810",
    storageBucket: "onepercent-bc810.firebasestorage.app",
    messagingSenderId: "157423904083",
    appId: "1:157423904083:web:e134550eaa81e4ec1a6da6",
    measurementId: "G-GN06QBQKVD"
  },
  firebaseMessagingVapidKey:
    'BMl_CzTrhRXHvV5JI8Sp8ZYSfqp4NqpBWYQXZ1pYnA1RhTbHXD7NEWY8_lrm-dASuc8uwqgbV1HYzbCySxxRCa0',
  platform: 'web',
  appScheme: 'onepercentapp'
};
