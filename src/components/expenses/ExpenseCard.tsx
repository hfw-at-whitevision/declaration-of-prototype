import Card from "@/components/primitives/Card";
import {displayFont} from "@/components/layout/DisplayHeading";

export default function ExpenseCard({
                                        selected,
                                        expense,
                                        className = '',
                                        ...props
                                    }: any) {
    return (
        <Card
            className={`grid grid-cols-10 justify-between ${className} ${displayFont.className}`}
            selected={selected}
            {...props}
        >
            <span className={`flex-1 font-bold text-left col-span-7`}>
                {expense?.title}
            </span>

            <span className="text-right col-span-3">
                {expense?.totalAmount?.toString() ?? '0.00'}
            </span>

            <span className="flex-1 text-left col-span-7">
                {expense?.category ?? 'Geen categorie'}
            </span>

            <span className="text-right col-span-3">
                {new Date(expense?.date).toLocaleDateString('nl-NL') ?? 'Geen datum'}
            </span>
        </Card>
    )
}
