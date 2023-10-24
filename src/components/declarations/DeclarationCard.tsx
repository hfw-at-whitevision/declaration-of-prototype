import Card from "@/components/primitives/Card";



export default function DeclarationCard({
    selected,
    declaration,
    ...props
}: any) {
    return (
        <Card
            className={`grid grid-cols-2 justify-between`}
            selected={selected}
            {...props}
        >
            <span className="flex-1 font-bold text-left">
                {declaration.name}
            </span>

            <span className="text-right">
                €{declaration.amount}
            </span>

            <span className="flex-1 text-left">
                {declaration.status}
            </span>

            <span className="text-right">
                {declaration.date}
            </span>
        </Card>
    )
}
