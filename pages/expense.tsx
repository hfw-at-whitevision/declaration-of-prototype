import SingleDeclaration from "@/components/declarations/SingleDeclaration";
import { getExpense } from "@/firebase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import SingleExpense from "@/components/declarations/SingleExpense";

export default function SingleExpensePage() {
    const router = useRouter();
    const id = router.query?.id ?? null;
    const [expense, setExpense] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!router.isReady) return;
        getExpense(id).then((item: any) => {
            setExpense(item);
            setIsLoading(false);
        });
    }, [id, router.isReady]);

    if (isLoading) return <Loading />
    return <SingleExpense expense={expense}/>
}
