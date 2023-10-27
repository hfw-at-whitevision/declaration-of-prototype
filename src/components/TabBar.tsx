import {useAtom} from "jotai";
import {currentTabIndexAtom} from "@/store/atoms";
import {motion} from 'framer-motion';

export default function TabBar({tabs}: any) {
    const [currentTabIndex, setCurrentTabIndex] = useAtom(currentTabIndexAtom);

    return <nav
        className="bg-black/5 p-[2px] flex flex-row gap-2 justify-between rounded-full"
    >
        {
            tabs.map((tab: any, tabIndex: number) => (
                <button
                    key={`tab-${tabIndex}`}
                    className="flex-1 p-2 text-xs text-center cursor-pointer capitalize rounded-full relative"
                    onClick={() => setCurrentTabIndex(tabIndex)}
                >
                    <span className={`z-[2] relative ${currentTabIndex === tabIndex ? 'font-bold' : ''}`}>
                        {tab}
                    </span>
                    {currentTabIndex === tabIndex &&
                        <motion.span
                            layoutId="bubble"
                            className="absolute inset-0 z-[1] bg-white rounded-full"
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
