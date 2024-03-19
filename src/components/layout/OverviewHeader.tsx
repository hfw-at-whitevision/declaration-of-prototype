import {
    currentTabIndexAtom, IsSelectingItemsAtom,
    notificationsAtom, primaryColorAtom, selectedItemIdsAtom,
    showNewDeclarationOverlayAtom,
    showNotificationsScreenAtom
} from "@/store/generalAtoms";
import {BsBell, BsBellFill} from "react-icons/bs";
import NotificationsScreen from "../screens/NotificationsScreen";
import {useAtom, useAtomValue} from "jotai";
import {useEffect, useState} from "react";
import DisplayHeading from "@/components/layout/DisplayHeading";

export default function OverviewHeader({title}: any) {
    const [, setShowNotificationsScreen] = useAtom(showNotificationsScreenAtom);
    const isSelectingItems = useAtomValue(IsSelectingItemsAtom);
    const selectedItemIds = useAtomValue(selectedItemIdsAtom);
    const isInSelectionMode = selectedItemIds?.length > 0 || isSelectingItems;
    const [notifications] = useAtom(notificationsAtom);
    const [currentTabIndex, setCurrentTabIndex] = useAtom(currentTabIndexAtom);
    const [primaryColor, setPrimaryColor] = useAtom(primaryColorAtom);
    const backgroundColor = isInSelectionMode
        ? 'bg-amber-500'
        : (currentTabIndex === 0)
            ? 'bg-amber-400'
            : 'bg-indigo-500';

    useEffect(() => {
        setPrimaryColor(backgroundColor);
    }, [backgroundColor]);

    const urgentNotifications = notifications
        ?.filter((notification: any) => notification.type === 'warning' || notification.type === 'success')
        ?.length;

    return <>
        <NotificationsScreen />

        <header className={`flex flex-col transition-all duration-500 ease-in-out bg-transparent p-4 pb-0 pt-16 gap-4 z-10`}>
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
                        className="bg-black/5 rounded-full p-4 z-10 relative"
                        onClick={() => setShowNotificationsScreen((prev: any) => !prev)}
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
        </header>
    </>
}
