import { App } from "@capacitor/app";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import NativeStatusBar from "@/components/NativeStatusBar";
import InputModal from "@/components/modals/InputModal";
import {useAtom} from "jotai";
import {inputModalAtom} from "@/store/atoms";

const inter = Inter({ subsets: ["latin"] });

export default function DOPApp({ Component, pageProps }: AppProps) {
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
      <section className="w-full flex flex-col relative bg-gray-100 border-black overflow-y-auto">
        <Component {...pageProps} />
      </section>

      {Capacitor.getPlatform() !== "web" ? <NativeStatusBar /> : null}

      <InputModal
        show={inputModal?.show}
        title={inputModal?.title}
        type={inputModal?.type}
        defaultValue={inputModal?.defaultValue}
        onConfirm={inputModal?.onConfirm}
      />
    </div>
  );
}
