import SingleDeclaration from "@/components/declarations/SingleDeclaration";
import {getExpense} from "@/firebase";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Loading from "@/components/Loading";
import SingleExpense from "@/components/expenses/SingleExpense";

export default function SingleExpensePage() {
    const router = useRouter();
    const id = router.query?.id ?? null;
    const [expense, setExpense] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!router.isReady) return;
        setIsLoading(true);

        // if we are creating a new expense
        if (!id) setExpense({
            totalAmount: 0.00,
        });
        // opening an existing expense
        else getExpense(id).then((item: any) => {
            setExpense(item);
        });

        setIsLoading(false);
    }, [id, router.isReady]);

    if (isLoading || !expense) return <Loading/>
    return <SingleExpense expense={expense}/>
}
