import "@/styles/globals.css";
import type {AppProps} from "next/app";
import {Inter} from "next/font/google";
import InputModal from "@/components/modals/InputModal";
import {useAtom} from "jotai";
import {inputModalAtom} from "@/store/atoms";
import {defineCustomElements} from '@ionic/pwa-elements/loader';
import useSplashScreen from "@/hooks/useSplashscreen";
import useSwipeBack from "@/hooks/useSwipeBack";
import usePushNotifications from "@/hooks/usePushNotifications";
import useNativeStatusBar from "@/hooks/useNativeStatusBar";
import useApp from "@/hooks/useApp";
import AppUrlListener from "@/components/AppUrlListener";

const inter = Inter({subsets: ["latin"]});

process.browser ? defineCustomElements(window) : null;

export default function DOPApp({Component, pageProps}: AppProps) {
    useSplashScreen();
    useSwipeBack();
    // usePushNotifications();
    useNativeStatusBar();
    useApp();

    const [inputModal, setInputModal] = useAtom(inputModalAtom);

    return (
        <div
            className={`w-full h-screen overflow-y-auto flex justify-center ${inter.className}`}
        >
            <section
                className="w-full flex flex-col relative bg-gray-100 border-black overflow-y-auto bg-no-repeat bg-bottom bg-[url('/bg-dots.png')] bg-[length:100%]">
                <div
                    id="bg-inset"
                    className="fixed left-0 right-0 bottom-0 h-[360px] bg-gradient-to-b from-zinc/0 to-zinc/25 pointer-events-none z-0"
                />
                <div id="content" className="z-[1] h-full">
                    <Component {...pageProps} />
                </div>
            </section>

            <InputModal
                show={inputModal?.show}
                title={inputModal?.title}
                type={inputModal?.type}
                defaultValue={inputModal?.defaultValue ? inputModal?.defaultValue : ''}
                options={inputModal?.options}
                onConfirm={inputModal?.onConfirm}
            />

            <AppUrlListener />
        </div>
    );
}
