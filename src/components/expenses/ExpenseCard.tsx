import Card from "@/components/primitives/Card";

export default function ExpenseCard({
                                        selected,
                                        expense,
                                        className = '',
                                        ...props
                                    }: any) {
    return (
        <Card
            className={`grid grid-cols-2 justify-between ${className}`}
            selected={selected}
            {...props}
        >
            <span className="flex-1 font-bold text-left">
                {expense?.title}
            </span>

            <span className="text-right">
                {expense?.totalAmount?.toString() ?? '0.00'}
            </span>

            <span className="flex-1 text-left">
                {expense?.category ?? 'Geen categorie'}
            </span>

            <span className="text-right">
                {expense?.date}
            </span>
        </Card>
    )
}
