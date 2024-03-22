import {useAtom} from "jotai";
import {primaryColorAtom} from "@/store/generalAtoms";
import {useEffect} from "react";
import SettingsScreen from "@/components/settings/SettingsScreen";

export default function SettingsPage() {
    const [primaryColor, setPrimaryColor] = useAtom(primaryColorAtom);
    useEffect(() => {
        setPrimaryColor('bg-gray-900');
    }, []);

    return <SettingsScreen />
}
