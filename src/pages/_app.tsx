import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`w-full h-screen overflow-y-auto flex justify-center ${inter.className}`}>
      <section className="w-full flex flex-col gap-4 relative bg-gray-100 border-black overflow-y-auto">
        <Component {...pageProps} />
      </section>
    </div>
  )
}
