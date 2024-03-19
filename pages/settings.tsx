import dynamic from "next/dynamic";
import {useAtom} from "jotai";
import {primaryColorAtom} from "@/store/generalAtoms";
import {useEffect} from "react";

const SettingsScreen = dynamic(async () => await import('@/components/settings/SettingsScreen'), {ssr: false});

export default function SettingsPage() {
    const [primaryColor, setPrimaryColor] = useAtom(primaryColorAtom);
    useEffect(() => {
        setPrimaryColor('bg-gray-700');
    }, []);

    return <SettingsScreen />
}
