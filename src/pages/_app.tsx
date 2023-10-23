import {App} from "@capacitor/app";
import "@/styles/globals.css";
import type {AppProps} from "next/app";
import {Inter} from "next/font/google";
import {useEffect} from "react";
import {Capacitor} from "@capacitor/core";
import NativeStatusBar from "@/components/NativeStatusBar";
import InputModal from "@/components/modals/InputModal";
import {useAtom} from "jotai";
import {inputModalAtom} from "@/store/atoms";
import {defineCustomElements} from '@ionic/pwa-elements/loader';

const inter = Inter({subsets: ["latin"]});

process.browser ? defineCustomElements(window) : null;

export default function DOPApp({Component, pageProps}: AppProps) {
    const [inputModal, setInputModal] = useAtom(inputModalAtom);

    const handleSwipeBack = () => {
        if (Capacitor.getPlatform() !== "web") return;
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

    return (
        <div
            className={`w-full h-screen overflow-y-auto flex justify-center ${inter.className}`}
        >
            <section className="w-full flex flex-col relative bg-gray-100 border-black overflow-y-auto bg-no-repeat bg-bottom bg-[url('/bg-dots.png')] bg-[length:100%]">
                <div
                    id="bg-inset"
                    className="fixed left-0 right-0 bottom-0 h-[360px] bg-gradient-to-b from-zinc/0 to-zinc/25 pointer-events-none z-0"
                />
                <div id="content" className="z-[1]">
                    <Component {...pageProps} />
                </div>
            </section>

            {Capacitor.getPlatform() !== "web" ? <NativeStatusBar/> : null}

            <InputModal
                show={inputModal?.show}
                title={inputModal?.title}
                type={inputModal?.type}
                defaultValue={inputModal?.defaultValue ? inputModal?.defaultValue : ''}
                options={inputModal?.options}
                onConfirm={inputModal?.onConfirm}
            />
        </div>
    );
}
