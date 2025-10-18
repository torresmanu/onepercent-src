import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'app.onepercent.app',
  appName: 'onepercent',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000, // o el tiempo que quieras
      launchAutoHide: true,
      launchFadeOutDuration: 500,
      backgroundColor: '#000000', // o el color de fondo que prefieras
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: 'launch_screen',
      useDialog: true,
    },
    Keyboard: {
      resize: KeyboardResize.Native,
      style: KeyboardStyle.Default,
      resizeOnFullScreen: false,
    },
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['google.com', 'apple.com', 'facebook.com'],
    },
    FirebaseAnalytics: {
      collectEnabled: false,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    FirebaseMessaging: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    EdgeToEdge: {
      backgroundColor: '#00000000',
    },
  },
};

export default config;
