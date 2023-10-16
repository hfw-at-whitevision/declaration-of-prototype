import { App } from '@capacitor/app'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'

const inter = Inter({ subsets: ['latin'] })

export default function DOPApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (Capacitor.getPlatform() === 'web') {
      App.addListener('backButton', () => {
        if (window.location.pathname === '/') {
          App.exitApp();
        } else {
          window.history.back();
        }
      });
    }
  }, []);

  return (
    <div className={`w-full h-screen overflow-y-auto flex justify-center ${inter.className}`}>
      <section className="w-full flex flex-col relative bg-gray-100 border-black overflow-y-auto">
        <Component {...pageProps} />
      </section>
    </div>
  )
}
