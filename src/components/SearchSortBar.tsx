import { declarationsAtom, searchQueryAtom } from "@/store/atoms";
import { BsSearch, BsSortUp } from "react-icons/bs";
import { useAtom } from 'jotai'

let timer: any = null;

export default function SearchSortBar() {
    const [declarations, setDeclarations] = useAtom(declarationsAtom);
    const [, setSearchQuery] = useAtom(searchQueryAtom);

    const handleSortingClick = (e) => {
        e.preventDefault();
        setDeclarations([...declarations].reverse());
    }

    const handleOnInputChange = (e) => {
        const {name, value} = e.target;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => setSearchQuery(value), 250);
    }

    return <>
        <section className="flex flex-row justify-between items-center gap-4">
            <div className="flex flex-row py-4 px-8 relative items-center bg-black/5 gap-4 w-full">
                <BsSearch
                    className="w-8 h-8 text-black/50"
                />
                <input
                    type="text"
                    className="w-full bg-transparent outline-none"
                    placeholder="Zoek op naam"
                    onChange={handleOnInputChange}
                />
            </div>

            <BsSortUp
                className="w-12 h-12 cursor-pointer"
                onClick={handleSortingClick}
            />
        </section>
    </>
}
