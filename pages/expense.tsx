import SingleDeclaration from "@/components/declarations/SingleDeclaration";
import {getExpense} from "@/firebase";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Loading from "@/components/Loading";
import SingleExpense from "@/components/expenses/SingleExpense";
import {useAtom} from "jotai";
import {primaryColorAtom} from "@/store/atoms";

export default function SingleExpensePage() {
    const router = useRouter();
    const id = router.query?.id ?? null;
    const [expense, setExpense] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [primaryColor, setPrimaryColor]  = useAtom(primaryColorAtom);

    const isCreatingNewExpense = !id;

    useEffect(() => {
        if (!router.isReady) return;
        setIsLoading(true);

        // if we are creating a new expense
        if (isCreatingNewExpense) setExpense({
            totalAmount: 0.00,
            date: new Date().toDateString(),
        });
        // opening an existing expense
        else getExpense(id).then((item: any) => {
            setExpense(item);
        });

        setIsLoading(false);
    }, [id, router.isReady]);

    useEffect(() => {
        setPrimaryColor('bg-gray-50');

        return () => {
            setPrimaryColor('bg-amber-400');
        }
    }, []);

    if (isLoading || !expense) return <Loading/>
    return <SingleExpense expense={expense}/>
}
