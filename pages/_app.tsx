import type {AppProps} from "next/app";
import InputModal from "@/components/modals/InputModal";
import {useAtom} from "jotai";
import {inputModalAtom, primaryColorAtom} from "@/store/generalAtoms";
import {defineCustomElements} from '@ionic/pwa-elements/loader';
import useSplashScreen from "@/hooks/useSplashscreen";
import useSwipeBack from "@/hooks/useSwipeBack";
import usePushNotifications from "@/hooks/usePushNotifications";
import useNativeStatusBar from "@/hooks/useNativeStatusBar";
import useApp from "@/hooks/useApp";
import AppUrlListener from "@/components/AppUrlListener";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {displayFont} from "@/components/layout/DisplayHeading";
import {useIsAuthenticated} from "@azure/msal-react";
import "@/styles/globals.css";
import dynamic from "next/dynamic";
import Loading from "@/components/layout/Loading";
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const LoginPage = dynamic(async () => await import('@/components/login/LoginPage'), {ssr: false});

// const defaultFont = Inter({subsets: ["latin"]});

// @ts-ignore
process.browser ? defineCustomElements(window) : null;

export const queryClient = new QueryClient();

export default function DOPApp({Component, pageProps}: AppProps) {
    useSplashScreen();
    useSwipeBack();
    // usePushNotifications();
    useNativeStatusBar();
    useApp();

    const [inputModal, setInputModal] = useAtom(inputModalAtom);
    const [primaryColor] = useAtom(primaryColorAtom);
    const bgDotsImage = (primaryColor === 'bg-gray-100') ? 'bg-dots.png' : 'bg-dots-white.png';

    return (
        <QueryClientProvider client={queryClient}>
            <div
                className={`w-full h-screen overflow-y-auto flex justify-center ${displayFont.className}`}
            >
                <section
                    className={`
                    w-full flex flex-col relative border-black overflow-y-auto bg-no-repeat bg-bottom bg-[url('/${bgDotsImage}')] bg-[length:100%]
                    ${primaryColor} transition-all duration-500 ease-in-out overflow-x-hidden
                `}>
                    {/*<BackgroundInset className="z-40" />*/}
                    <div id="content" className="z-[1] h-full overflow-x-hidden">
                        <LoginPage>
                            <Component {...pageProps} />
                        </LoginPage>
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

                <Loading />

                <AppUrlListener/>
            </div>
        </QueryClientProvider>
    );
}
