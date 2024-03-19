import { SplashScreen } from '@capacitor/splash-screen'
import { useEffect } from 'react';
import {Capacitor} from "@capacitor/core";

const showSplashScreen = async () => {
    await SplashScreen.show({
        showDuration: 2000,
        autoHide: true,
    });
}

const useSplashScreen = () => {
    const isNative = Capacitor.isNativePlatform();

    useEffect(() => {
        if (!isNative) return;
        showSplashScreen();
    }, []);

    return {
        showSplashScreen,
    }
}
export default useSplashScreen;
