import OverviewHeader from "@/components/layout/OverviewHeader";
import Content from "@/components/Content";
import TabNavigation from "@/components/TabNavigation";
import React from "react";
import useAuth from "@/hooks/useAuth";
import {Dialog} from "@capacitor/dialog";
import {useAtom} from "jotai";
import TilesGrid from "@/components/dashboard/TilesGrid";
import {environmentCodeAtom} from "@/store/authAtoms";
import {BsFillQuestionCircleFill, BsGeoFill, BsPower} from "react-icons/bs";
import useDocbase from "@/hooks/useDocbase";

export default function SettingsScreen() {
    const {logout} = useAuth();
    const {switchEnvironment} = useDocbase();
    const {user} = useAuth();
    const [environmentCode] = useAtom(environmentCodeAtom);

    const truncatedEmailAddress = (!!user?.emailAddress)
        ? user.emailAddress.substring(0, 10) + '...'
        : '';

    const handleLogout = async (e) => {
        e.preventDefault();

        const {value: confirmed} = await Dialog.confirm({
            title: 'Uitloggen',
            message: 'Weet je zeker dat je wilt uitloggen?',
        });

        if (!confirmed) return;
        await logout();
    }

    const handleSwitchEnvironment = async () => {
        const {value, cancelled} = await Dialog.prompt({
            title: 'Omgeving',
            message: 'Voer de nieuwe omgevingscode in:',
        });
        if (cancelled) return;
        const res = await switchEnvironment(value);
        if (res) {
            await Dialog.confirm({
                title: 'Omgeving',
                message: 'Omgeving succesvol gewijzigd naar ' + value,
            });
        }
        else await Dialog.alert({
            title: 'Omgeving',
            message: 'Oops! Het wijzigen van de omgeving is niet gelukt..',
        });
    }

    return <>
        <OverviewHeader title="Instellingen"/>

        <Content className="bg-white rounded-3xl mb-32 mt-4" vAlign="center">

            <TilesGrid items={[
                {
                    Icon: BsGeoFill,
                    onClick: handleSwitchEnvironment,
                    color: 'gray',
                    label: 'Omgeving',
                    value: environmentCode,
                },
                {
                    Icon: BsFillQuestionCircleFill,
                    color: 'emerald',
                    label: 'Support',
                },
                {
                    Icon: BsPower,
                    onClick: handleLogout,
                    color: 'red',
                    label: 'Uitloggen',
                    value: truncatedEmailAddress,
                },
            ]}
            />
        </Content>

        <TabNavigation/>
    </>
}
