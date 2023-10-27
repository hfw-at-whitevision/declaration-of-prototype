import {useRouter} from "next/router";
import {useEffect} from "react";
import {App} from "@capacitor/app";

export default function AppUrlListener() {
    const router = useRouter();

    useEffect(() => {
        App.addListener('appUrlOpen', async (event) => {
            const slug = event.url.split('.app').pop();
            if (slug) {
                await router.push(slug);
            }
            // If no match, do nothing - let regular routing
            // logic take over
        });
    })
}
