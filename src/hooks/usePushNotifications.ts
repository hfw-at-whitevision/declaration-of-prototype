import {PushNotifications} from "@capacitor/push-notifications";
import {useEffect, useState} from "react";

export default function usePushNotifications() {
    const [pushNotificationsAllowed, setPushNotificationsAllowed] = useState(false);
    const addListeners = async () => {
        await PushNotifications.addListener('registration', token => {
            // called when push notification registration is finished successfully
            console.info('Push notifications registration token: ', token.value);
        });

        await PushNotifications.addListener('registrationError', err => {
            console.error('Push notifications registration error: ', err.error);
        });

        // called when the device receives a push notification
        await PushNotifications.addListener('pushNotificationReceived', notification => {
            console.log('Push notification received: ', notification);
        });

        // called when the user opens a push notification
        await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
            console.log('Push notification action performed: ', notification.actionId, notification.inputValue);
        });
    }

    const registerNotifications = async () => {
        let permStatus = await PushNotifications.checkPermissions();

        if (permStatus.receive === 'prompt') {
            permStatus = await PushNotifications.requestPermissions();
        }

        if (permStatus.receive !== 'granted') {
            throw new Error('User denied push notifications permissions');
        }
        setPushNotificationsAllowed(true);
        await PushNotifications.register();
    }

    const getDeliveredNotifications = async () => {
        const notificationList = await PushNotifications.getDeliveredNotifications();
        console.log('Delivered push notifications: ', notificationList);
    }

    useEffect(() => {
        addListeners();
    }, []);

    useEffect(() => {
        if (pushNotificationsAllowed) return;
        registerNotifications();
    }, [pushNotificationsAllowed]);

    return null;
}
