import Card from "@/components/primitives/Card";
import {useParseStatus} from "@/hooks/useParseStatus";


export default function DeclarationCard({
                                            selected,
                                            declaration,
                                            className = '',
                                            ...props
                                        }: any) {
    const parsedStatus = useParseStatus(declaration?.status);
    let statusColor = "bg-amber-400";
    switch (declaration?.status) {
        case "100":
            statusColor = "bg-amber-400";
            break;
        case "200":
            statusColor = "bg-red-500";
            break;
        case "300":
            statusColor = "bg-green-500";
            break;
        default:
            statusColor = "bg-amber-400";
    }

    return (
        <Card
            className={`grid grid-cols-2 justify-between relative ${className}`}
            selected={selected}
            {...props}
        >
            <div className={"absolute top-0 left-0 bottom-0 w-[4px] " + statusColor} />

            <span className="flex-1 font-bold text-left">
                {declaration?.title}
            </span>

            <span className="text-right">
                {declaration?.totalAmount ?? 0}
            </span>

            <span className="flex-1 text-left">
                {parsedStatus}
            </span>

            <span className="text-right">
                {new Date(declaration?.date).toLocaleDateString("nl-NL") ?? "Geen datum"}
            </span>
        </Card>
    )
}
