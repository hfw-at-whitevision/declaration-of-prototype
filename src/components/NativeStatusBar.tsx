import { StatusBar } from "@capacitor/status-bar";
import { useEffect } from "react";

export default function NativeStatusBar() {
    const handleSetStatusBar = () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    }

    useEffect(() => {
        handleSetStatusBar();
    }, []);

    return null;
}