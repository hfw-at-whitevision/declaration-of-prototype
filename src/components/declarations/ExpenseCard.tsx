import Card from "@/components/primitives/Card";

export default function ExpenseCard({
                                            selected,
                                            expense,
                                            ...props
                                        }: any) {
    return (
        <Card
            className={`grid grid-cols-2 justify-between`}
            selected={selected}
            {...props}
        >
            <span className="flex-1 font-bold text-left">
                {expense?.title}
            </span>

            <span className="text-right">
                {expense?.totalAmount ?? '0'} totaal
            </span>

            <span className="flex-1 text-left">
                {expense?.category}
            </span>

            <span className="text-right">
                {expense?.date}
            </span>
        </Card>
    )
}
