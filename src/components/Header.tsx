import {showNewDeclarationOverlayAtom, showNotificationsScreenAtom} from "@/store/atoms";
import {BsPlusLg, BsBell} from "react-icons/bs";
import NotificationsScreen from "./screens/NotificationsScreen";
import {useAtom} from "jotai";
import Tabs from "@/components/Tabs";

export const tabs = [
    "concept",
    "afgekeurd",
    "ingediend",
]

export default function Header() {
    const [, setShowNotificationsScreen] = useAtom(showNotificationsScreenAtom);
    const [, setShowNewDeclarationOverlay] = useAtom(showNewDeclarationOverlayAtom);

    const handleNewDeclarationClick = (e: any) => {
        e.preventDefault();
        setShowNewDeclarationOverlay(true);
    }

    return <>
        <NotificationsScreen/>

        <header className="flex flex-col bg-amber-400 p-4 gap-2">
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-white font-extrabold text-xl">
                    Bonnen
                </h1>

                <div className="flex flex-row gap-2 text-white">
                    <button
                        className="bg-black/5 rounded-full p-2"
                        onClick={handleNewDeclarationClick}
                    >
                        <BsPlusLg className="w-4 h-4"/>
                    </button>

                    <button
                        className="bg-black/5 rounded-full p-2 z-20"
                        onClick={() => setShowNotificationsScreen(prev => !prev)}
                    >
                        <BsBell className="w-4 h-4"/>
                    </button>
                </div>
            </div>

            <Tabs tabs={tabs}/>
        </header>
    </>
}