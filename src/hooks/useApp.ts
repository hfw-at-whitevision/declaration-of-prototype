import {App} from '@capacitor/app';
import {useEffect} from "react";

// App.addListener('appStateChange', ({ isActive }) => {
//     console.log('useApp: App state changed. Is active?', isActive);
//     });
//
// App.addListener('appUrlOpen', data => {
//     console.log('useApp: App opened with URL:', data);
// });
//
// App.addListener('appRestoredResult', data => {
//     console.log('useApp: Restored state:', data);
// });

const checkAppLaunchUrl = async () => {
    const { url } = await App.getLaunchUrl();

    console.log('App opened with URL: ' + url);
};

export default function useApp() {
    useEffect(() => {
        checkAppLaunchUrl();
    }, []);

    return {
        checkAppLaunchUrl,
    }
}
