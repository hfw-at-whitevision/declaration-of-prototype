import {useAtom} from "jotai";
import {currentTabIndexAtom} from "@/store/atoms";

export default function Tabs({tabs}) {
    const [currentTabIndex, setCurrentTabIndex] = useAtom(currentTabIndexAtom);

    return <nav className="bg-black/5 p-4 flex flex-row gap-2 justify-between">
        {
            tabs.map((tab, tabIndex) => (
                <button
                    key={tab}
                    className={`
                        flex-1 p-4 text-center cursor-pointer
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
