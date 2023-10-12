import {getNotifications} from '@/firebase';
import parse from 'html-react-parser'
import {useEffect} from 'react'
import {BsCheckLg, BsExclamationDiamond} from 'react-icons/bs'
import {useAtom} from "jotai";
import {notificationsAtom, showNotificationsScreenAtom} from "@/store/atoms";

export default function NotificationsScreen() {
    const [notifications, setNotifications] = useAtom(notificationsAtom);
    const [showNotificationsScreen] = useAtom(showNotificationsScreenAtom);

    useEffect(() => {
        getNotifications().then((res) => {
            setNotifications(res);
        });
    }, []);

    const notificationIcon = (type) => {
        switch (type) {
            case 'warning':
                return <BsExclamationDiamond className="w-full h-full text-red-500"/>;
                break;
            case 'success':
                return <BsCheckLg className="w-full h-full text-green-500"/>;
                break;
            default:
                return null;
        }
    }

    if (!showNotificationsScreen) return null;
    return <div className="absolute inset-0 bg-gray-100 z-10 p-8 pt-32">
        <section className="w-full flex flex-col space-y-1">

            {
                notifications
                    .sort((a, b) => {
                        return b.timestamp - a.timestamp;
                    })
                    .map((notification) => (
                        <div className="p-8 bg-white flex flex-row gap-8">
                            <span className="w-12 h-12">
                                {notificationIcon(notification.type)}
                            </span>

                            <span className="flex-1">
                                {parse(notification.message ?? '')}
                            </span>
                        </div>
                    ))
            }

        </section>
    </div>
}
