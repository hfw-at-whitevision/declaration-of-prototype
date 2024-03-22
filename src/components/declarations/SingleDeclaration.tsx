import {useRouter} from "next/router";
import Button from "../Button";
import Content from "../Content";
import React, {useEffect, useState} from "react";
import {deleteDeclaration, updateDeclaration, updateExpense} from "@/firebase";
import {inputModalAtom, loadingAtom, primaryColorAtom,} from "@/store/generalAtoms";
import {useAtom} from "jotai";
import {Toast} from '@capacitor/toast';
import SinglePageHeader from "@/components/declarations/SinglePageHeader";
import ExpenseAccordion from "@/components/expenses/ExpenseAccordion";
import {Dialog} from "@capacitor/dialog";
import DisplayHeading from "@/components/layout/DisplayHeading";
import {useDeclaration} from "@/hooks/useDeclaration";
import {SpecialZoomLevel, Viewer, Worker} from "@react-pdf-viewer/core";
import {defaultLayoutPlugin} from '@react-pdf-viewer/default-layout';
import useDocbase from "@/hooks/useDocbase";
import {BsX} from "react-icons/bs";
import {useParams} from "next/navigation";

export default function SingleDeclaration({declaration: inputDeclaration}: any) {
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        sidebarTabs: (defaultTabs) => [],
    });
    const [declaration, setDeclaration] = useState(inputDeclaration);
    const [expenses, setExpenses] = useState(inputDeclaration?.expenses);
    const expenseIds = expenses?.length > 0 ? expenses?.map((expense: any) => expense?.id) : [];
    const declarationId = useRouter()?.query?.id ?? null;
    const docbaseId = declaration?.docbaseId;
    const status = declaration?.status ?? 'concept';
    const router = useRouter();
    const allowEdit = !declarationId;
    const containsClaimedExpenses = expenses?.some((expense: any) => expense?.claimedIn?.length > 0);
    const {postDeclaration} = useDeclaration();
    const {getDocbasePdf} = useDocbase();

    const [title, setTitle] = useState(declaration?.title);
    const [description, setDescription] = useState(inputDeclaration?.description);
    const [totalAmount, setTotalAmount] = useState(declaration?.totalAmount);
    const [date, setDate] = useState(declaration?.date);
    const [category, setCategory] = useState(declaration?.category);
    const [primaryColor, setPrimaryColor] = useAtom(primaryColorAtom);
    const [pdfBase64, setPdfBase64] = useState();
    const [loading, setLoading] = useAtom(loadingAtom);
    const [showPdf, setShowPdf] = useState(false);
    const params = useParams();

    useEffect(() => {
        const hash = window.location.hash;
        if (hash === '#showPdf') {
            setShowPdf(true);
        }
        else setShowPdf(false);
    }, [params]);

    const openPdf = async (e) => {
        e.preventDefault();
        // push router to same url with hash
        await router.push(router.asPath + '#showPdf');
    }

    const closePdf = async (e) => {
        e.preventDefault();
        // push router to same url without hash
        await router.push(router.asPath.replace('#showPdf', ''));
    }

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

        setLoading({
            isLoading: true,
            message: 'Declaratie wordt ingediend...'
        });

        try {
            // update declaration
            if (declarationId) {
                await updateDeclaration(declarationId, serializeDeclaration({
                    status: '100',
                }));
            }
            // posting a new declaration
            else {
                const declarationToPost = serializeDeclaration({
                    status: '100',
                    date: new Date().toDateString(),
                });
                const {declarationId} = await postDeclaration({
                    declaration: declarationToPost,
                    expenses: expenses,
                });
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
        } catch (e) {
            console.error(e);
            await Toast.show({
                text: 'Er is iets misgegaan. Probeer het opnieuw.'
            });
        } finally {
            setLoading({isLoading: false});
        }
    }

    const handleUpdateExpenses = async ({claimedInDeclarationId}: any) => {
        const promises = [];
        for (const expense of expenses) {
            promises.push(updateExpense(expense.id, {
                ...expense,
                claimedIn: expense?.claimedIn?.length > 0
                    ? [claimedInDeclarationId, ...expense?.claimedIn]
                    : [claimedInDeclarationId],
            }));
        }
        await Promise.all(promises);
    }

    const handleDeleteDeclaration = async (e: any) => {
        e.preventDefault();

        const {value} = await Dialog.confirm({
            title: 'Waarschuwing',
            message: 'Weet je zeker dat je deze declaratie wilt verwijderen?',
        });
        if (!value) return;
        await deleteDeclaration(declarationId);
        await Toast.show({
            text: 'Declaratie succesvol verwijderd.'
        });
        await router.push('/declarations?tabIndex=1');
    }

    useEffect(() => {
        setPrimaryColor('bg-gray-100');

        return () => {
            setPrimaryColor('bg-amber-400');
        }
    }, []);

    useEffect(() => {
        if (!docbaseId) return;
        getDocbasePdf({docbaseId}).then((pdfBase64: any) => {
            setPdfBase64(pdfBase64);
        });
    }, [docbaseId]);

    return (
        <Content>
            <div className="mt-8 grid gap-2 text-xs">

                <SinglePageHeader backToDeclarations status={declaration?.status}/>

                <div className="my-4 space-y-2 rounded-md">
                    <DisplayHeading
                        className="text-xl font-black focus:outline-2 outline-amber-400 break-all w-full h-auto overflow-hidden text-left"
                    >
                        {title ?? <span className="opacity-25">Declaratie</span>}
                    </DisplayHeading>

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
                                DECL-{docbaseId ?? declarationId}
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
                        onConfirm={(value: any) => setDate(value)}
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

                        {expenses?.length > 0 && expenses?.map((expense: any, index: number) => (
                            <ExpenseAccordion key={expense?.id + index} expense={expense} showStatus={allowEdit}/>
                        ))}

                    </section>
                </div>

                {pdfBase64 &&
                    <Button primary padding="small" onClick={openPdf}>
                        Toon voorblad
                    </Button>
                }

                {showPdf &&
                    <section className="pdfModal fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center">
                        <button
                            className="absolute top-4 right-4 bg-white p-4 rounded-full"
                            onClick={closePdf}
                        >
                            <BsX className="w-6 h-6"/>
                        </button>
                        <Worker workerUrl="./pdf.worker.min.js">
                            <div className="top-20 left-4 right-4 bottom-4 absolute singleDeclaration overflow-y-auto">
                                <Viewer
                                    fileUrl={pdfBase64}
                                    plugins={[
                                        defaultLayoutPluginInstance,
                                    ]}
                                    defaultScale={SpecialZoomLevel.PageFit}
                                />
                            </div>
                        </Worker>
                    </section>
                }

                {/* action buttons */}
                {allowEdit
                    && <div className="flex flex-row justify-between items-center gap-2">
                        {!declarationId &&
                            <Button
                                primary
                                padding='small'
                                fullWidth
                                rounded="full"
                                onClick={handleSubmit}
                            >
                                Indienen
                            </Button>
                        }
                    </div>
                }

                {!allowEdit &&
                    <Button
                        tertiary
                        padding='small'
                        rounded="full"
                        fullWidth
                        onClick={handleDeleteDeclaration}
                    >
                        Verwijderen
                    </Button>
                }
            </div>

            {/*<pre className="break-all overflow-x-auto">*/}
            {/*    {JSON.stringify(declaration, null, 2)}*/}
            {/*    <br/>*/}
            {/*    {JSON.stringify(expenses, null, 2)}*/}
            {/*</pre>*/}
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
    }: any
) => {
    const [inputModal, setInputModal] = useAtom(inputModalAtom);
    const isValueSet = value !== undefined && value !== null;

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

            <span className={(isValueSet)
                ? 'absolute top-1 text-[10px] opacity-50'
                : 'opacity-50'
            }>
                {label}
            </span>
            {value}

        </button>
    )
}
