export interface ResponseAppleSignIn {
    additionalUserInfo: AdditionalUserInfo;
    credential:         Credential;
    user:               User;
}

export interface AdditionalUserInfo {
    providerId: string;
    profile:    Profile;
    isNewUser:  boolean;
}

export interface Profile {
    email:           string;
    iat:             number;
    iss:             string;
    c_hash:          string;
    email_verified:  boolean;
    nonce:           string;
    auth_time:       number;
    sub:             string;
    aud:             string;
    exp:             number;
    nonce_supported: boolean;
}

export interface Credential {
    providerId:        string;
    nonce:             string;
    authorizationCode: string;
    idToken:           string;
}

export interface User {
    metadata:      Metadata;
    providerData:  ProviderDatum[];
    uid:           string;
    emailVerified: boolean;
    photoUrl:      null;
    displayName:   null;
    phoneNumber:   null;
    isAnonymous:   boolean;
    providerId:    string;
    email:         string;
    tenantId:      null;
}

export interface Metadata {
    creationTime:   number;
    lastSignInTime: number;
}

export interface ProviderDatum {
    providerId:  string;
    photoUrl:    null;
    uid:         string;
    phoneNumber: null;
    email:       string;
    displayName: null;
}
