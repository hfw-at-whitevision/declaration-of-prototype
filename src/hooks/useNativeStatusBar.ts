import { StatusBar } from "@capacitor/status-bar";
import { useEffect } from "react";
import {Capacitor} from "@capacitor/core";

export default function useNativeStatusBar() {
    const handleSetStatusBar = async () => {
      await StatusBar.setOverlaysWebView({ overlay: true });
    }

    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return;
        handleSetStatusBar();
    }, []);

    return null;
}
