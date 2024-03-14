import {PublicClientApplication} from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        clientId: 'cc2d54f2-e3d3-435a-a804-eddb3ff2ac02',
        authority: 'https://login.microsoftonline.com/common', // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
        redirectUri: '/login',
    },
    cache: {
        cacheLocation: 'sessionStorage', // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
    scopes: ['User.Read', 'Mail.Send'],
};

export const msalInstance = new PublicClientApplication(msalConfig);
