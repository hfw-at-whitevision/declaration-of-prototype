import {Capacitor} from "@capacitor/core";
import {App} from "@capacitor/app";
import {useEffect} from "react";

export default function useSwipeBack() {
    const handleSwipeBack = async () => {
        if (!Capacitor.isNativePlatform()) return;
        App.addListener("backButton", () => {
            if (window.location.pathname === "/") {
                App.exitApp();
            } else {
                window.history.back();
            }
        });
    };

    useEffect(() => {
        handleSwipeBack();
    }, []);
}
