import {useAtom} from "jotai";
import {currentTabIndexAtom} from "@/store/atoms";

export default function Tabs({tabs}: any) {
    const [currentTabIndex, setCurrentTabIndex] = useAtom(currentTabIndexAtom);

    return <nav className="bg-black/5 p-1 flex flex-row gap-2 justify-between rounded-md">
        {
            tabs.map((tab: any, tabIndex: number) => (
                <button
                    key={`tab-${tabIndex}`}
                    className={`
                        flex-1 p-2 text-xs text-center cursor-pointer
                        ${tabIndex === 0 ? 'rounded-l-md' : ''}
                        ${tabIndex === tabs.length - 1 ? 'rounded-r-md' : ''}
                        ${currentTabIndex === tabIndex ? "bg-white text-black font-extrabold" : ""}
                    `}
                    onClick={() => setCurrentTabIndex(tabIndex)}
                >
                    {tab}
                </button>
            ))
        }
    </nav>
}
