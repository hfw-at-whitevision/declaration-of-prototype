import {CiFileOn, CiHome, CiReceipt, CiSettings} from "react-icons/ci";
import {useRouter} from "next/router";
import {motion} from "framer-motion";

const tabs = [
    {
        icon: CiHome,
        label: 'Dashboard',
        path: '/'
    },
    {
        icon: CiFileOn,
        label: 'Facturen',
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

export default function TabNavigation() {
    const router = useRouter();
    const isActiveTab = (tab) => router.pathname === tab.path;
    return <>
        <div id="tab-bar-spacer" className="h-20"/>
        <section
            className="fixed bottom-0 left-0 right-0 bg-white h-20 border-t border-gray-200 flex items-center justify-between gap-8 px-2 text-[10px]"
        >
            {tabs.map((tab, index) => (
                <motion.button
                    key={index}
                    className={`
                        flex flex-1 flex-col items-center gap-1 p-2 rounded-lg relative
                        transition-all duration-500
                        ${isActiveTab(tab) ? 'font-bold text-blue-600' : ''}
                    `}
                    onClick={() => tab?.path ? router.push(tab.path) : null}
                >
                    {isActiveTab(tab) &&
                        <motion.span
                            layoutId="navigationTabsBubble"
                            transition={{
                                type: 'spring',
                                bounce: 0.2,
                                duration: 0.4,
                            }}
                            className="absolute inset-0 rounded-lg bg-black/5"
                        />
                    }
                    <tab.icon
                        className="w-8 h-8"
                        strokeWidth={0.1}
                    />
                    {tab.label}
                </motion.button>
            ))}
        </section>
    </>
}
