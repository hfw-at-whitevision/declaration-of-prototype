import Button from "@/components/Button";
import {BsArrowLeft} from "react-icons/bs";
import {useRouter} from "next/router";
import {useParseStatus} from "@/hooks/useParseStatus";

export default function SingleDeclarationHeader({backToDeclarations = false, backToExpenses = false, status = '100'}) {
    const router = useRouter();
    const parsedStatus = useParseStatus(status);
    let statusColor = 'bg-amber-400';

    switch (status) {
        case '100':
            statusColor = '!border-amber-400 !text-amber-400';
            break;
        case '200':
            statusColor = '!border-red-500 !text-red-500';
            break;
        case '300':
            statusColor = '!border-green-500 !text-green-500';
            break;
    }

    const handleBack = (e) => {
        e.preventDefault();
        if (backToDeclarations) router.push('/declarations?tabIndex=1');
        else if (backToExpenses) router.push('/declarations');
        else router.back();
    }

    return <div className="w-full justify-between items-center flex">
        <Button
            secondary
            padding='small'
            onClick={handleBack}
            rounded="full"
            className="h-12"
        >
            <BsArrowLeft className="w-4 h-4"/>
            Terug
        </Button>

        <Button
            primary
            outline
            padding='small'
            rounded="full"
            className={`${statusColor} h-12 px-8`}>
            {parsedStatus}
        </Button>
    </div>
}
