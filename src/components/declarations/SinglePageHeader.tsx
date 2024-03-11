import Button from "@/components/Button";
import {BsArrowLeft} from "react-icons/bs";
import {useRouter} from "next/router";
import {useParseStatus} from "@/hooks/useParseStatus";

export default function SingleDeclarationHeader({status = '100'}) {
    const router = useRouter();
    const parsedStatus = useParseStatus(status);
    let statusColor = 'bg-amber-400';

    switch (status) {
        case '100':
            statusColor = 'bg-amber-400';
            break;
        case '200':
            statusColor = 'bg-red-500';
            break;
        case '300':
            statusColor = 'bg-green-500';
            break;
    }

    return <div className="w-full justify-between items-center flex">
        <Button
            secondary
            padding='small'
            onClick={() => router.back()}
            className="!rounded-full"
        >
            <BsArrowLeft className="w-4 h-4"/>
            Terug
        </Button>

        <Button
            primary
            padding='small'
            className={`${statusColor} h-full !rounded-full`}>
            {parsedStatus}
        </Button>
    </div>
}
