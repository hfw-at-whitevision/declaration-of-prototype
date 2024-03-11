import {useRouter} from "next/router";
import Button from "../Button";
import Content from "../Content";
import {useState} from "react";
import {
    createDeclaration,
    updateDeclaration,
    updateExpense
} from "@/firebase";
import {
    inputModalAtom,
} from "@/store/atoms";
import {useAtom} from "jotai";
import {Toast} from '@capacitor/toast';
import {LoadingSpinner} from "@/components/Loading";
import SinglePageHeader from "@/components/declarations/SinglePageHeader";
import ExpenseAccordion from "@/components/expenses/ExpenseAccordion";
import {Dialog} from "@capacitor/dialog";

export default function SingleDeclaration({declaration: inputDeclaration}: any) {
    const [declaration, setDeclaration] = useState(inputDeclaration);
    const [expenses, setExpenses] = useState(inputDeclaration?.expenses);
    const expenseIds = expenses?.length > 0 ? expenses?.map((expense: any) => expense?.id) : [];
    const declarationId = useRouter()?.query?.id ?? null;
    const status = declaration?.status ?? 'concept';
    const router = useRouter();
    const allowEdit = !declarationId;
    const containsClaimedExpenses = expenses?.some((expense: any) => expense?.claimedIn?.length > 0);

    const [title, setTitle] = useState(declaration?.title);
    const [description, setDescription] = useState(inputDeclaration?.description);
    const [totalAmount, setTotalAmount] = useState(declaration?.totalAmount);
    const [date, setDate] = useState(declaration?.date);
    const [category, setCategory] = useState(declaration?.category);

    const serializeDeclaration = (props?: any) => ({
        ...declarationId && {id: declarationId},
        ...title && {title},
        ...description && {description},
        ...totalAmount && {totalAmount: totalAmount},
        ...category && {category},
        expenses: expenseIds,
        status: props?.status ?? status,
        date: props?.date ?? date,
    });

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        // check for claimed expenses
        if (containsClaimedExpenses) {
            const {value} = await Dialog.confirm({
                title: 'Waarschuwing',
                message: 'Deze declaratie bevat bonnen die al gedeclareerd zijn. Weet je zeker dat je deze declaratie in wilt dienen?',
            });
            if (!value) return;
        }

        // update declaration
        if (declarationId) {
            await updateDeclaration(declarationId, serializeDeclaration({
                status: '100',
            }));
        }
        // posting a new declaration
        else {
            const declarationId = await createDeclaration(serializeDeclaration({
                status: '100',
                date: new Date().toLocaleDateString(),
            }));
            await handleUpdateExpenses({
                claimedInDeclarationId: declarationId,
            });
        }
        // setConfirmationOverlayTitle('Declaratie succesvol ingediend.');
        // setShowConfirmationOverlay(true);
        await Toast.show({
            text: 'Declaratie succesvol ingediend.'
        });
        await router.push('/declarations?tabIndex=1');
    }

    const handleUpdateExpenses = async ({claimedInDeclarationId}) => {
        const promises = [];
        for (const expense of expenses) {
            const claimedIn = expense?.claimedIn || [];
            promises.push(updateExpense(expense.id, {
                ...expense,
                claimedIn: expense?.claimedIn?.length > 0
                    ? [claimedInDeclarationId, ...expense?.claimedIn]
                    : [claimedInDeclarationId],
            }));
        }
        await Promise.all(promises);
    }

    return (
        <Content>
            <div className="mt-8 grid gap-2 text-xs">

                <SinglePageHeader status={declaration?.status}/>

                <div className="my-4 space-y-2 rounded-md">
                    <label
                        className="text-xl font-extrabold focus:outline-2 outline-amber-400 break-all w-full h-auto overflow-hidden text-left"
                    >
                        {title ?? <span className="opacity-25">Declaratie</span>}
                    </label>

                    <div className="flex flex-row justify-between items-center text-lg">
                        <span className="flex flex-row">
                            €{totalAmount}
                        </span>

                        <span>
                        </span>
                    </div>

                    <div className="flex flex-row justify-between items-center text-xs opacity-50">
                        {!!declarationId &&
                            <span>
                                DECL-{declarationId}
                            </span>
                        }

                        <span>
                            {date}
                        </span>
                    </div>
                </div>

                <CardInput
                    allowEdit={allowEdit}
                    value={title}
                    onConfirm={(value: string) => setTitle(value)}
                    label="Titel"
                    title='Voer een titel in:'
                />

                <CardInput
                    allowEdit={allowEdit}
                    value={description}
                    onConfirm={(value: string) => setDescription(value)}
                    label="Omschrijving"
                    title='Voer een omschrijving in:'
                />

                <CardInput
                    allowEdit={allowEdit}
                    value={totalAmount}
                    onConfirm={(value: number) => setTotalAmount(value)}
                    label="Totaalbedrag"
                    title='Voer een bedrag in:'
                    type='number'
                />

                {!allowEdit &&
                    <CardInput
                        allowEdit={allowEdit}
                        value={date}
                        onConfirm={(value) => setDate(value)}
                        label="Datum"
                        title='Datum van uitgave:'
                        type='date'
                    />
                }

                {/*<div className="bg-white rounded-md p-4 grid gap-2 grid-cols-3 relative pt-5">*/}
                <div className="bg-white rounded-md p-4 grid gap-2 grid-cols-1 relative pt-5 w-full">
                    <span className={
                        declaration?.expenses?.length
                            ? 'absolute top-1 left-4 text-[10px] flex flex-row'
                            : ''
                    }>
                        Bonnen

                        {declaration?.expenses?.length > 0 &&
                            <span
                                className="bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center w-3 h-3 ml-1">
                                {expenses?.length}
                            </span>
                        }
                    </span>

                    <section className="grid grid-cols-1 gap-2 w-full p-0">

                        {expenses?.length > 0 && expenses?.map((expense: any) => (
                            <ExpenseAccordion key={expense?.id} expense={expense}/>
                        ))}

                    </section>
                </div>

                {/* action buttons */}
                {allowEdit
                    && <div className="flex flex-row justify-between items-center gap-2">
                        {!declarationId &&
                            <Button
                                primary
                                padding='small'
                                fullWidth
                                onClick={handleSubmit}
                            >
                                Indienen
                            </Button>
                        }
                    </div>
                }
            </div>

            <pre className="break-all overflow-x-auto hidden">
                {JSON.stringify(declaration, null, 2)}
            </pre>
        </Content>
    )
}

const CardInput = (
    {
        allowEdit,
        value,
        onConfirm,
        type = 'text',
        label,
        title,
        options,
    }
) => {
    const [inputModal, setInputModal] = useAtom(inputModalAtom);
    return (
        <button
            disabled={!allowEdit}
            className="bg-white py-6 text-sm rounded-md p-4 cursor-pointer relative text-left"
            onClick={() => setInputModal({
                ...inputModal,
                show: true,
                title: title ?? label,
                type: type,
                defaultValue: value,
                onConfirm,
                options,
            })}
        >

            <span className={(value)
                ? 'absolute top-1 text-[10px] opacity-50'
                : 'opacity-50'
            }>
                {label}
            </span>
            {value}

        </button>
    )
}
