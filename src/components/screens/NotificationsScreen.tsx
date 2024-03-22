import {getNotifications} from '@/firebase';

import parse from 'html-react-parser'
import {useEffect} from 'react'
import {BsCheckSquareFill, BsExclamationDiamondFill, BsPatchCheckFill} from 'react-icons/bs'
import {useAtom} from "jotai";
import {notificationsAtom, showNotificationsScreenAtom} from "@/store/generalAtoms";
import {AiOutlineClose} from 'react-icons/ai';

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
                return <BsExclamationDiamondFill className="text-red-500 w-6 h-6"/>;
            case 'success':
                return <BsPatchCheckFill className="w-6 h-6 text-green-500"/>;
            default:
                return null;
        }
    }

    return <div
        className={`
            absolute inset-0 bg-gray-100 z-50 p-4 py-8 pt-16 text-sm transition-all duration-500 ease-in-out
            ${!showNotificationsScreen ? 'translate-y-[-100%] h-0 overflow-hidden' : 'translate-y-0 h-full overflow-y-auto'}
        `}
    >
        <button
            onClick={() => setShowNotificationsScreen(false)}
            className="flex flex-row justify-end ml-auto p-4 rounded-full bg-gray-900/5"
        >
            <AiOutlineClose className="cursor-pointer w-6 h-6 opacity-50 text-black/50" strokeWidth={1}/>
        </button>

        <section className="w-full flex flex-col space-y-2 mt-4">

            {
                notifications
                    .sort((a: any, b: any) => b.timestamp - a.timestamp)
                    .map((notification: any) => (
                        <div
                            key={JSON.stringify(notification)}
                            className="p-8 bg-white flex flex-row gap-4 rounded-lg items-start justify-start"
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
