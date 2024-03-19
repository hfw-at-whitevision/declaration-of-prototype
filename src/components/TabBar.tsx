import {useAtom} from "jotai";
import {currentTabIndexAtom, primaryColorAtom} from "@/store/generalAtoms";
import {motion} from 'framer-motion';
import {useRouter} from "next/router";

export default function TabBar({tabs}: any) {
    const [currentTabIndex, setCurrentTabIndex] = useAtom(currentTabIndexAtom);
    const [primaryColor] = useAtom(primaryColorAtom);
    const color = primaryColor.split('-')[1];
    const router = useRouter();

    const handleClick = (inputTabIndex: any) => {
        setCurrentTabIndex(inputTabIndex);
        router.push(`/declarations?tabIndex=${inputTabIndex}`);
    }

    return <nav
        className="bg-white p-[2px] flex flex-row gap-2 justify-between rounded-full"
    >
        {
            tabs.map((tab: any, tabIndex: number) => (
                <button
                    key={`tab-${tabIndex}`}
                    className="flex-1 p-4 text-xs text-center cursor-pointer capitalize rounded-full relative"
                    onClick={() => handleClick(tabIndex)}
                >
                    <span className={`z-[2] relative ${currentTabIndex === tabIndex ? 'font-bold text-white' : `text-${color}-500`}`}>
                        {tab}
                    </span>
                    {currentTabIndex === tabIndex &&
                        <motion.span
                            layoutId="bubble"
                            className={ primaryColor + " absolute inset-0 z-[1] rounded-full"}
                            transition={{
                                type: 'spring',
                                bounce: 0.2,
                                duration: 0.4,
                            }}
                        />
                    }
                </button>
            ))
        }
    </nav>
}
