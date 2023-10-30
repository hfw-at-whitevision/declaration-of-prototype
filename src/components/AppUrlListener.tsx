import {useRouter} from "next/router";
import {useEffect} from "react";
import {App} from "@capacitor/app";

export default function AppUrlListener() {
    const router = useRouter();

    useEffect(() => {
        App.addListener('appUrlOpen', (event) => {
            console.log('appUrlOpen event: ', event);
            const slug = event.url.split('.app').pop();
            if (slug) {
                router.push(slug);
            }
            // If no match, do nothing - let regular routing
            // logic take over
        });
    }, []);

    return null;
}
