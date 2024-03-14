import TabBar from "@/components/TabBar";
import {tabs} from "@/constants/defaults";
import {primaryColorAtom} from "@/store/atoms";
import {useAtom} from "jotai";

export default function DeclarationsTabBar() {
    const [primaryColor] = useAtom(primaryColorAtom);
    return (
        <section className={`sticky top-0 ${primaryColor} px-4 py-4 z-10 transition-all duration-500 ease-in-out`}>
            <TabBar tabs={tabs} />
        </section>
    )
}
