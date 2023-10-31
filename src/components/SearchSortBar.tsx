import { declarationsAtom, searchQueryAtom } from "@/store/atoms";
import { BsSearch, BsSortUp } from "react-icons/bs";
import { useAtom } from 'jotai'

let timer: any = null;

export default function SearchSortBar() {
    const [declarations, setDeclarations] = useAtom(declarationsAtom);
    const [, setSearchQuery] = useAtom(searchQueryAtom);

    const handleSortingClick = (e: any) => {
        e.preventDefault();
        setDeclarations([...declarations].reverse());
    }

    const handleOnInputChange = (e: any) => {
        const {name, value} = e.target;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => setSearchQuery(value), 250);
    }

    return <>
        <section className="flex flex-row justify-between items-center gap-4">
            <div className="rounded-md flex flex-row py-2 px-4 relative items-center bg-gray-200 gap-4 w-full">
                <BsSearch
                    className="w-4 h-4 text-black/50"
                />
                <input
                    type="text"
                    className="w-full bg-transparent outline-none text-sm"
                    placeholder="Zoek op naam"
                    onChange={handleOnInputChange}
                />
            </div>

            <BsSortUp
                className="w-6 h-6 cursor-pointer"
                onClick={handleSortingClick}
            />
        </section>
    </>
}
