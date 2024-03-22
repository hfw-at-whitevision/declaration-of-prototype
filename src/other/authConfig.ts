export const msalConfig = {
    auth: {
        clientId: 'a468fdc4-dd90-4300-a896-42add09bd2e3',
        authority: 'https://login.microsoftonline.com/common',
        redirectUri: 'https://declaration-of-prototype.firebaseapp.com/__/auth/handler',
    },
    cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: true,
    },
}

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
    scopes: ['User.Read', 'Mail.Send'],
};

// export const msalApp = new PublicClientApplication(msalConfig);
// export const msalInstance = await PublicClientApplication.createPublicClientApplication(msalConfig);