/**
 * Environment interface
 */
export interface Environment {
  /**
   * Defines a boolean variable to manage the production environment
   */
  production: boolean;

  /**
   * Defines a string variable to manage the assetsBaseUrl field
   */
  assetsBaseUrl?: string;

  /**
   * Defines a string variable to manage the apiBaseUrl field
   */
  apiBaseUrl: string;

  /**
   * Defines a boolean variable to show storage logs in console
   */
  logStorageOnStartup: boolean;

  /**
   * Defines a string variable to manage the data base name
   */
  dbName: string;

  /**
   * Defines a RegExp variable to manage the emailRegex field
   */
  emailRegex: RegExp;

  /**
   * Defines a RegExp variable to manage the passwordRegex field
   */
  passwordRegex: RegExp;

  /**
   * Defines a RegExp variable to manage the phoneRegex field
   */
  phoneRegex: RegExp;

  /**
   * Defines a Stripe object to manage the publishableKey and secretKey fields
   */
  stripe: {
    /**
     * Defines a string variable to manage the publishableKey field
     */
    publishableKey: string;

    /**
     * Defines a string variable to manage the secretKey field
     */
    secretKey: string;
  };

  firebase: any;
}
