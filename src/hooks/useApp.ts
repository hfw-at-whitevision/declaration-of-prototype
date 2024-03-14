import {App} from '@capacitor/app';
import {useEffect} from "react";
import {useRouter} from "next/router";

const registerListeners = () => {
    // App.addListener('appStateChange', ({isActive}) => {
    //     console.log('useApp: App state changed. Is active?', isActive);
    // });

    App.addListener('appUrlOpen', (data) => {
        console.log('useApp (appUrlOpen): App opened with URL: ', data);
    });

    // App.addListener('appRestoredResult', data => {
    //     console.log('useApp: Restored state:', data);
    // });
}

const checkAppLaunchUrl = async () => {
    const { url }: any = await App.getLaunchUrl();

    console.log('App opened with URL: ' + url);
};

export default function useApp() {
    const router = useRouter();

    useEffect(() => {
        registerListeners();
    }, []);

    // useEffect(() => {
    //     checkAppLaunchUrl();
    // }, [router.pathname, router.asPath]);

    return {
        checkAppLaunchUrl,
    }
}
