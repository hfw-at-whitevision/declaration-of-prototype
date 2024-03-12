import {
    currentTabIndexAtom, IsSelectingItemsAtom,
    notificationsAtom, primaryColorAtom, selectedItemIdsAtom,
    showNewDeclarationOverlayAtom,
    showNotificationsScreenAtom
} from "@/store/atoms";
import {BsBell, BsBellFill} from "react-icons/bs";
import NotificationsScreen from "../screens/NotificationsScreen";
import {useAtom, useAtomValue} from "jotai";
import TabBar from "@/components/TabBar";
import {useEffect, useState} from "react";
import {tabs} from "@/constants/defaults";
import DisplayHeading from "@/components/layout/DisplayHeading";

export default function DeclarationsPageHeader() {
    const [, setShowNotificationsScreen] = useAtom(showNotificationsScreenAtom);
    const [, setShowNewDeclarationOverlay] = useAtom(showNewDeclarationOverlayAtom);
    const isSelectingItems = useAtomValue(IsSelectingItemsAtom);
    const selectedItemIds = useAtomValue(selectedItemIdsAtom);
    const isInSelectionMode = selectedItemIds?.length > 0 || isSelectingItems;
    const [notifications] = useAtom(notificationsAtom);
    const [currentTabIndex, setCurrentTabIndex] = useAtom(currentTabIndexAtom);
    const [primaryColor, setPrimaryColor] = useAtom(primaryColorAtom);
    const backgroundColor = isInSelectionMode
        ? 'bg-indigo-500'
        : (currentTabIndex === 0)
            ? 'bg-amber-400'
            : 'bg-indigo-500';

    useEffect(() => {
        setPrimaryColor(backgroundColor);
    }, [backgroundColor]);

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

    const [title, setTitle] = useState(<><span className="!font-thin">Mijn</span> bonnen</>);

    useEffect(() => {
        switch (currentTabIndex) {
            case 0:
                setTitle(isInSelectionMode ? <>Selecteer <span className="!font-thin">bonnen</span></> : <><span className="!font-thin">Mijn</span> bonnen</>);
                break;
            case 1:
                setTitle(<><span className="!font-thin">Mijn</span> declaraties</>);
                break;
        }
    }, [currentTabIndex, isInSelectionMode]);

    return <>
        <NotificationsScreen />

        <header className={`flex sticky top-0 flex-col transition-all duration-500 ease-in-out bg-transparent p-4 pb-4 pt-16 gap-4 z-10`}>
            <div className="flex flex-row justify-between items-center">
                <DisplayHeading className="text-white font-extrabold text-4xl tracking-tight">
                    {title}
                </DisplayHeading>

                <div className="flex flex-row gap-2 text-white">
                    {/*<button*/}
                    {/*    className="bg-black/5 rounded-full p-2"*/}
                    {/*    onClick={handleNewDeclarationClick}*/}
                    {/*>*/}
                    {/*    <BsPlusLg className="w-5 h-5" />*/}
                    {/*</button>*/}

                    <button
                        className="bg-black/5 rounded-full p-4 z-20 relative"
                        onClick={() => setShowNotificationsScreen(prev => !prev)}
                    >
                        <BsBellFill className="w-6 h-6" />

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
