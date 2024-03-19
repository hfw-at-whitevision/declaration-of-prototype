import {declarationsAtom, searchQueryAtom} from "@/store/generalAtoms";
import {BsSearch, BsSortUp, BsXLg} from "react-icons/bs";
import {useAtom} from 'jotai'
import {useRef} from "react";

let timer: any = null;

export default function SearchSortBar() {
    const [declarations, setDeclarations]: any = useAtom(declarationsAtom);
    const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);

    const handleSortingClick = (e: any) => {
        e.preventDefault();
        setDeclarations([...declarations].reverse());
    }

    const handleOnInputChange = (e: any) => {
        const {name, value} = e.target;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => setSearchQuery(value), 250);
    }

    const handleClearSearch = () => {
        setSearchQuery('');
        inputRef.current.value = '';
    }

    const inputRef = useRef(null);

    return <>
        <section className="flex flex-row justify-between items-center gap-4">
            <div className="rounded-md flex flex-row p-1 h-12 relative items-center bg-gray-100 gap-4 w-full">
                <BsSearch
                    className="w-4 h-4 text-black/50 ml-2"
                />
                <input
                    ref={inputRef}
                    type="text"
                    className="w-full bg-transparent outline-none text-sm"
                    placeholder="Zoeken..."
                    onChange={handleOnInputChange}
                />
                {searchQuery?.length > 0 &&
                    <button
                        className="bg-white/50 h-full p-2 flex flex-row items-center justify-center text-xs rounded-md font-bold"
                        onClick={handleClearSearch}
                    >
                        <BsXLg className="w-2 h-2 mr-1 text-black/50"/>
                        Wissen
                    </button>
                }
            </div>

            <BsSortUp
                className="w-6 h-6 cursor-pointer"
                onClick={handleSortingClick}
            />
        </section>
    </>
}
