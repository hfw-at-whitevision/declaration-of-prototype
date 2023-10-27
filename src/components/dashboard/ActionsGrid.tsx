import {BsSend} from "react-icons/bs";

export default function ActionsGrid() {
    return <section className="grid grid-cols-2 w-full gap-2">
        <div className="bg-white rounded-lg shadow-md p-8 flex flex-col justify-center items-center gap-2">
            <BsSend className="w-12 h-12 text-sky-400" strokeWidth={0.1} />
            Facturen
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 flex flex-col justify-center items-center gap-2">
            <BsSend className="w-12 h-12 text-amber-400" strokeWidth={0.1} />
            Declaratie indienen
        </div>
    </section>
}
