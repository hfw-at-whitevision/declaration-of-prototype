import { App } from "@capacitor/app";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { StatusBar } from "@capacitor/status-bar";

const inter = Inter({ subsets: ["latin"] });

export default function DOPApp({ Component, pageProps }: AppProps) {
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

  const handleSetStatusBar = () => {
    StatusBar.setOverlaysWebView({ overlay: true });
  }

  useEffect(() => {
    handleSwipeBack();
    handleSetStatusBar();
  }, []);

  return (
    <div
      className={`w-full h-screen overflow-y-auto flex justify-center ${inter.className}`}
    >
      <section className="w-full flex flex-col relative bg-gray-100 border-black overflow-y-auto">
        <Component {...pageProps} />
      </section>
    </div>
  );
}
