import {CiBookmarkCheck, CiFileOn, CiHome, CiReceipt, CiSettings} from "react-icons/ci";
import {useRouter} from "next/router";
import Link from "next/link";

const tabs = [
    {
        icon: CiHome,
        label: 'Dashboard',
        path: '/'
    },
    {
        icon: CiFileOn,
        label: 'Documenten',
        // path: '/documents',
    },
    {
        icon: CiReceipt,
        label: 'Declaraties',
        path: '/declarations'
    },
    // {
    //     icon: CiBookmarkCheck,
    //     label: 'Goedkeuren',
    //     path: '/approve'
    // },
    {
        icon: CiSettings,
        label: 'Instellingen',
        // path: '/settings'
    }
]

export default function TabBar() {
    const router = useRouter();
    return <>
        <div id="tab-bar-spacer" className="h-20"/>
        <section
            className="fixed bottom-0 left-0 right-0 bg-white h-20 border-t border-gray-200 flex items-center justify-between gap-8 px-8 text-[10px]"
        >
            {tabs.map((tab, index) => {
                const isActiveTab = router.pathname === tab.path;
                return (
                    <Link
                        key={index}
                        className={`
                            flex flex-1 flex-col items-center gap-1 p-2 rounded-lg
                            ${isActiveTab ? 'bg-black/5 font-bold' : ''}
                        `}
                        href={tab.path ?? ''}
                    >
                        <tab.icon
                            className="w-8 h-8"
                            strokeWidth={
                                isActiveTab ? 0.5 : 0.1
                            }
                        />
                        {tab.label}
                    </Link>
                )
            })}
        </section>
    </>
}
