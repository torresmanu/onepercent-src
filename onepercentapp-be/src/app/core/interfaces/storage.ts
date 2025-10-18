import { User } from './user';

/**
 * Storage Key enum
 */
export enum StorageKey {
  accessToken = 'accessToken',
  refreshToken = 'refreshToken',
  language = 'language',
  userData = 'userData',
  userAcceptsBiometry = 'userAcceptsBiometry',
  analyticsConsent = 'analyticsConsent',
  termsAccepted = 'termsAccepted',
  fcmToken = 'fcmToken',
  pushEnabled = 'pushEnabled',
  googleAccessToken = 'googleAccessToken',
  metaAccessToken = 'metaAccessToken',
}

export interface AppSkelStorage {
  /**
   * Defines a string variable to manage the authentication token
   */
  [StorageKey.accessToken]: string
  [StorageKey.googleAccessToken]: string
  [StorageKey.metaAccessToken]: string
  [StorageKey.refreshToken]: string;
  /**
   * Defines a string variable to manage the app language
   */
  [StorageKey.language]: string;
  [StorageKey.fcmToken]: string;

  /**
   * Defines a User variable to manage the user data
   */
  [StorageKey.userData]: User | null;
  /**
   * Defines a boolean variable to check whether User has opted in for biometry or not
   */
  [StorageKey.userAcceptsBiometry]: boolean | null;

  [StorageKey.analyticsConsent]: boolean | null;

  [StorageKey.termsAccepted]: boolean | null;

  /**
   * Defines a boolean variable to manage push notifications status
   */
  [StorageKey.pushEnabled]: boolean | null;
}
