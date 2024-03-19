import {useRouter} from "next/router";
import {motion} from "framer-motion";
import {useAtom} from "jotai";
import {primaryColorAtom} from "@/store/generalAtoms";
import {BsCreditCard2FrontFill, BsFillGearFill, BsFillHouseFill, BsFillPatchCheckFill} from "react-icons/bs";

const tabs = [
    {
        icon: BsFillHouseFill,
        label: 'Dashboard',
        path: '/'
    },
    {
        icon: BsFillPatchCheckFill,
        label: 'Goedkeuren',
        path: '/advice',
    },
    {
        icon: BsCreditCard2FrontFill,
        label: 'Declaraties',
        path: '/declarations'
    },
    {
        icon: BsFillGearFill,
        label: 'Instellingen',
        path: '/settings'
    }
]

export default function TabNavigation() {
    const router = useRouter();
    const isActiveTab = (tab: any) => router.pathname === tab.path;
    const primaryColor = useAtom(primaryColorAtom);
    return <>
        <div id="tab-bar-spacer" className="h-16"/>
        <section
            className="fixed bg-black bottom-4 left-4 right-4 h-16 border-0 border-gray-200 flex items-center justify-between gap-8 px-4 text-[10px] rounded-full"
        >
            {tabs.map((tab, index) => (
                <motion.button
                    key={index}
                    className={`
                        flex flex-1 flex-col items-center gap-1 p-2 rounded-full relative
                        transition-all duration-500
                        ${isActiveTab(tab) ? 'font-bold text-black' : 'text-white'}
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
                            className={`absolute inset-0 bg-white z-0 rounded-full`}
                        />
                    }
                    <tab.icon
                        className="w-6 h-6 z-10"
                        strokeWidth={0.1}
                    />
                    {/*{tab.label}*/}
                </motion.button>
            ))}
        </section>
    </>
}
