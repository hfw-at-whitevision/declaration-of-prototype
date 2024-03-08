import Button from "@/components/Button";
import {BsArrowLeft} from "react-icons/bs";
import {useRouter} from "next/router";

export default function SingleDeclarationHeader({status = 'concept'}) {
    const router = useRouter();
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
            className={`
                        ${status === 'ingediend' ? '!bg-green-600' : undefined}
                        ${status === 'afgekeurd' ? '!bg-red-600' : undefined}
                        h-full !rounded-full
                    `}>
            {status}
        </Button>
    </div>
}
