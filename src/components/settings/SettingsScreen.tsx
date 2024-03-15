import OverviewHeader from "@/components/layout/OverviewHeader";
import Content from "@/components/Content";
import TabNavigation from "@/components/TabNavigation";
import React from "react";
import useAuth from "@/hooks/useAuth";
import {Dialog} from "@capacitor/dialog";
import CardInput from "@/components/layout/CardInput";
import {useAtom} from "jotai";
import {environmentCodeAtom} from "@/store/atoms";

export default function SettingsScreen() {
    const {logout} = useAuth();
    const [environmentCode, setEnvironmentCode] = useAtom(environmentCodeAtom);

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
        setEnvironmentCode(value);
    }

    return <>
        <OverviewHeader title="Instellingen" />

        <Content className="bg-white m-4 rounded-2xl">
            <section className="grid grid-cols-1 divide-y divide-y-black/10">
                <SettingsButton onClick={handleSwitchEnvironment}>
                    Omgeving {environmentCode}
                </SettingsButton>

                <SettingsButton onClick={handleLogout}>
                    Uitloggen
                </SettingsButton>
            </section>
        </Content>

        <TabNavigation/>
    </>
}

const SettingsButton = ({className, children, ...props}: any) => (
    <button {...props} className={`p-4 ${className}`}>
        {children}
    </button>
)
