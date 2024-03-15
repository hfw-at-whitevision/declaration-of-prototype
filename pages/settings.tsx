import dynamic from "next/dynamic";

const SettingsScreen = dynamic(async () => await import('@/components/settings/SettingsScreen'), {ssr: false});

export default function SettingsPage() {
    return <SettingsScreen />
}
