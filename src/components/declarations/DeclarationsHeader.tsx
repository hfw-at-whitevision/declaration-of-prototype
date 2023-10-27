import { notificationsAtom, showNewDeclarationOverlayAtom, showNotificationsScreenAtom } from "@/store/atoms";
import { BsBell } from "react-icons/bs";
import NotificationsScreen from "../screens/NotificationsScreen";
import { useAtom } from "jotai";
import TabBar from "@/components/TabBar";

export const tabs = [
    "concept",
    "afgekeurd",
    "ingediend",
]

export default function DeclarationsHeader() {
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

    const handleFileImportClick = () => {
        fileInputRef.current.click();
    }

    return <>
        <NotificationsScreen />

        <header className="flex sticky top-0 flex-col bg-amber-400 p-4 py-8 pt-16 gap-4 z-10">
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-white font-extrabold text-xl">
                    Uitgaven
                </h1>

                <div className="flex flex-row gap-2 text-white">
                    {/*<button*/}
                    {/*    className="bg-black/5 rounded-full p-2"*/}
                    {/*    onClick={handleNewDeclarationClick}*/}
                    {/*>*/}
                    {/*    <BsPlusLg className="w-5 h-5" />*/}
                    {/*</button>*/}

                    <button
                        className="bg-black/5 rounded-full p-2 z-20 relative"
                        onClick={() => setShowNotificationsScreen(prev => !prev)}
                    >
                        <BsBell className="w-5 h-5" />

                        {urgentNotifications
                            ? <span
                                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center p-1"
                            >
                                {urgentNotifications}
                            </span>
                            : null
                        }
                    </button>
                </div>
            </div>

            <TabBar tabs={tabs} />
        </header>
    </>
}
