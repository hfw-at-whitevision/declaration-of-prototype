import {PublicClientApplication} from "@azure/msal-browser";

// export const msalConfig = {
//     auth: {
//         clientId: 'cc2d54f2-e3d3-435a-a804-eddb3ff2ac02',
//         authority: 'https://login.microsoftonline.com/common', // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
//         redirectUri: '/login',
//     },
//     cache: {
//         cacheLocation: 'sessionStorage', // This configures where your cache will be stored
//         storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
//     },
// };

export const msalConfig = {
    auth: {
        clientId: 'a468fdc4-dd90-4300-a896-42add09bd2e3',
        authority: 'https://login.microsoftonline.com/common',
        // redirectUri: '/login',
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