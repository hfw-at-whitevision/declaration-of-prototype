import SingleDeclaration from "@/components/declarations/SingleDeclaration";
import {getDeclaration, getExpense} from "@/firebase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

export default function DeclarationScreenPage() {
    const router = useRouter();
    const id = router.query?.id ?? null;
    const [declaration, setDeclaration]: any = useState(null);
    const { createFromExpenses } = router.query;
    const isCreatingFromExpenses = (createFromExpenses) ? createFromExpenses?.length > 0 : true;

    useEffect(() => {
        // if we are creating a declaration from selected expenses
        if (isCreatingFromExpenses) {
            const expensesArray = createFromExpenses?.toString()?.split(',') ?? [];
            let declarationToCreate = {
                title: 'Nieuwe declaratie',
                description: '',
                expenses: [],
                totalAmount: 0,
            };

            // get the expenses
            const promises = expensesArray?.map((id: string) => getExpense(id));
            Promise.all(promises).then((expensesResponse: any) => {
                let totalAmount = 0;
                expensesResponse.map((expense: any) => (expense?.totalAmount) ? totalAmount += expense?.totalAmount : null);
                declarationToCreate.expenses = expensesResponse;
                declarationToCreate.description = expensesResponse.map((expense: any) => expense?.title).join(', ');
                declarationToCreate.totalAmount = totalAmount;
                console.log('Creating a new declaration from expenses', declarationToCreate);
                setDeclaration(declarationToCreate);
            });
            return;
        }

        if (!id || !router.isReady) return;
        getDeclaration(id).then((declaration: any) => {
            const expensePromises = declaration?.expenses?.map((expenseId: any) => getExpense(expenseId));
            Promise.all(expensePromises).then((expenses: any) => {
                setDeclaration({
                    ...declaration,
                    expenses,
                });
            });
        });
    }, [id, router.isReady, createFromExpenses]);

    if (!declaration || !createFromExpenses && !id) return <Loading />
    return <SingleDeclaration declaration={declaration} />
}
