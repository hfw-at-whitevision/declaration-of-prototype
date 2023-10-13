import { getNotifications } from '@/firebase';
import parse from 'html-react-parser'
import { useEffect } from 'react'
import { BsCheckLg, BsExclamationDiamond } from 'react-icons/bs'
import { useAtom } from "jotai";
import { notificationsAtom, showNotificationsScreenAtom } from "@/store/atoms";

export default function NotificationsScreen() {
    const [notifications, setNotifications] = useAtom(notificationsAtom);
    const [showNotificationsScreen] = useAtom(showNotificationsScreenAtom);

    useEffect(() => {
        getNotifications().then((res) => {
            setNotifications(res);
        });
    }, []);

    const notificationIcon = (type: string) => {
        switch (type) {
            case 'warning':
                return <BsExclamationDiamond className="text-red-500 w-6 h-6" />;
            case 'success':
                return <BsCheckLg className="w-6 h-6 text-green-500" />;
            default:
                return null;
        }
    }

    if (!showNotificationsScreen) return null;
    return <div className="absolute inset-0 bg-gray-100 z-10 p-2 text-xs">

        <h1 className="text-lg font-extrabold h-16">Notificaties</h1>

        <section className="w-full flex flex-col space-y-1">

            {
                notifications
                    .sort((a: any, b: any) => b.timestamp - a.timestamp)
                    .map((notification: any) => (
                        <div
                            key={JSON.stringify(notification)}
                            className="p-4 bg-white flex flex-row gap-4"
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
