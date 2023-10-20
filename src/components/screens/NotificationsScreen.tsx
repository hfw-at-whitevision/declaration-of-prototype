import { getNotifications } from '@/firebase';
import parse from 'html-react-parser'
import { useEffect } from 'react'
import { BsCheckLg, BsExclamationDiamond } from 'react-icons/bs'
import { useAtom } from "jotai";
import { notificationsAtom, showNotificationsScreenAtom } from "@/store/atoms";
import { AiOutlineClose } from 'react-icons/ai';

export default function NotificationsScreen() {
    const [notifications, setNotifications] = useAtom(notificationsAtom);
    const [showNotificationsScreen, setShowNotificationsScreen] = useAtom(showNotificationsScreenAtom);

    useEffect(() => {
        getNotifications().then((res) => {
            setNotifications(res);
        });
    }, []);

    const notificationIcon = (type: string) => {
        switch (type) {
            case 'warning':
                return <BsExclamationDiamond className="text-red-500 w-8 h-8" />;
            case 'success':
                return <BsCheckLg className="w-8 h-8 text-green-500" />;
            default:
                return null;
        }
    }

    if (!showNotificationsScreen) return null;
    return <div className="absolute inset-0 bg-gray-100 z-20 p-4 py-8 text-sm">

        <div className="flex flex-row justify-end w-full">
            <AiOutlineClose className="bg-black/10 cursor-pointer rounded-full w-8 h-8 p-1 opacity-50" strokeWidth={1} onClick={() => setShowNotificationsScreen(false)} />
        </div>

        <section className="w-full flex flex-col space-y-2 mt-4">

            {
                notifications
                    .sort((a: any, b: any) => b.timestamp - a.timestamp)
                    .map((notification: any) => (
                        <div
                            key={JSON.stringify(notification)}
                            className="p-4 bg-white flex flex-row gap-4 rounded-lg shadow-xl shadow-gray-500/10"
                        >
                            {notificationIcon(notification.type)}

                            <span className="flex-1">
                                {parse(notification.message ?? '')}
                            </span>
                        </div>
                    ))
            }

        </section>
    </div>
}
