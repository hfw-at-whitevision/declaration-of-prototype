import {notificationsAtom, showNewDeclarationOverlayAtom, showNotificationsScreenAtom} from "@/store/atoms";
import {BsPlusLg, BsBell} from "react-icons/bs";
import NotificationsScreen from "../screens/NotificationsScreen";
import {useAtom} from "jotai";
import Tabs from "@/components/Tabs";
import {GiHamburgerMenu} from "react-icons/gi";

export const tabs = [
    "concept",
    "afgekeurd",
    "ingediend",
]

export default function DashboardHeader() {
    const [, setShowNotificationsScreen] = useAtom(showNotificationsScreenAtom);
    const [, setShowNewDeclarationOverlay] = useAtom(showNewDeclarationOverlayAtom);
    const [notifications] = useAtom(notificationsAtom);

    const handleNewDeclarationClick = (e: any) => {
        e.preventDefault();
        setShowNewDeclarationOverlay(true);
    }

    const urgentNotifications = notifications
        ?.filter((notification: any) => notification.type === 'warning' || notification.type === 'success')
        ?.length;

    return <>
        <NotificationsScreen/>

        <header className="flex sticky top-0 flex-row justify-between bg-amber-400 p-4 py-8 pt-16 gap-4 z-10">
            <div className="flex-1">
                <button className="bg-black/5 rounded-full p-2 w-10 h-10 flex items-center justify-center">
                    <GiHamburgerMenu className="text-white w-5 h-5"/>
                </button>
            </div>

            <div className="flex flex-row justify-center items-center flex-1">
                <img
                    src={'/images/whitevision.svg'}
                    alt="WhiteVision"
                    className="w-[150px]"
                />
            </div>

            <div className="flex-1">

            </div>
        </header>
    </>
}
