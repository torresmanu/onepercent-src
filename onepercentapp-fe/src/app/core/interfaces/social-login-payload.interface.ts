export interface SocialLoginPayload {
    idToken?: string, 
    email?: string | null;
    displayName?: string | null;
    phoneNumber?: string | null;
    imageProfile?: string | null
}