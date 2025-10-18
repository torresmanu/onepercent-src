/**
 * User interface
 */
export interface User {
  /**
   * Defines a number variable to manage the id field
   */
  id: number;

  /**
   * Defines a string variable to manage the email field
   */
  email: string;

  /**
   * Defines a string variable to manage the firstname field
   */
  firstname: string;

  /**
   * Defines a string or null variable to manage the lastname field
   */
  lastname: string | null;

  password: string;
  imageProfile: string | null;
  phone: string | null;
  isSocialUser: boolean | null;
  address: string | null;
  location: string | null;
  province: string | null;
  cp: string | null;
  country: string | null;
  gender: string;
  weight: number | null;
  unit: string;
  height: number | null;
  birthdate: string | null;
  deviceToken: string | null;
  resetPasswordToken: string | null;
  resetPasswordExpires: string | null;
  refreshToken: string | null;
  refreshTokenExpires: string | null;
  validatedEmail: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  roleId: number;
  userStatusId: number;
  userStatus: {
    id: number;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
  };
  role: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  userLicenses: Array<{
    id: number;
    active: boolean;
    invitationCode: string | null;
    stripeSubscriptionId: string | null;
    createdAt: string;
    updatedAt: string;
    licenseId: number;
    userId: number;
    license: {
      id: number;
      title: string;
      description: string;
      price: number;
      stripePriceId: string;
      createdAt: string;
      updatedAt: string;
    };
  }>;
  token: string;
}
