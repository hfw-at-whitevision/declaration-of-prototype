import {useRouter} from "next/router";
import {BsArrowLeft} from "react-icons/bs";
import Button from "../Button";
import Content from "../Content";
import {useEffect, useState} from "react";
import {createDeclaration, deleteDeclaration, getDeclarationAttachments, updateDeclaration} from "@/firebase";
import {
    inputModalAtom,
    scannedImagesAtom,
} from "@/store/atoms";
import {useAtom} from "jotai";
import {Toast} from '@capacitor/toast';
import {LoadingSpinner} from "@/components/Loading";
import SingleDeclarationHeader from "@/components/declarations/SingleDeclarationHeader";

export default function SingleDeclaration({declaration: inputDeclaration}: any) {
    const [declaration, setDeclaration] = useState(inputDeclaration);
    const [scannedImages, setScannedImages] = useAtom(scannedImagesAtom);
    const [inputModal, setInputModal] = useAtom(inputModalAtom);
    const declarationId = useRouter()?.query?.id ?? null;
    const status = declaration?.status ?? 'concept';
    const router = useRouter();
    const allowEdit =
        status !== 'goedgekeurd'
        && status !== 'ingediend';

    const [name, setName] = useState(declaration?.name);
    const [description, setDescription] = useState(declaration?.description);
    const [amount, setAmount] = useState(declaration?.amount);
    const [currency, setCurrency] = useState(declaration?.currency);
    const [category, setCategory] = useState(declaration?.category);
    const [vat, setVat] = useState(declaration?.vat);
    const [paymentMethod, setPaymentMethod] = useState(declaration?.paymentMethod);
    const [attachments, setAttachments] = useState(declaration?.attachments);

    const serializeDeclaration = (props?: any) => ({
        ...declarationId
            ? {
                // edit declaration
                id: declarationId,
                attachments: declaration?.attachments,
            }
            : {
                // new declaration
                attachments: declaration?.attachments,
            },
        ...name && {name},
        ...description && {description},
        ...amount && {amount},
        ...currency && {currency},
        ...category && {category},
        ...vat && {vat},
        ...paymentMethod && {paymentMethod},
        status: props?.status ?? status,
    });

    const [isSaving, setIsSaving] = useState(false);
    const handleSave = async (e: any) => {
        e.preventDefault();
        setIsSaving(true);

        // update
        if (declarationId) {
            const res = await updateDeclaration(declarationId, serializeDeclaration());
        }
        // create
        else {
            const res = await createDeclaration(serializeDeclaration());
        }
        // setConfirmationOverlayTitle('Bon opgeslagen.');
        // setShowConfirmationOverlay(true);
        await Toast.show({
            text: 'Declaratie opgeslagen.',
        });

        setIsSaving(false);
        await router.push('/');
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (declarationId) {
            await updateDeclaration(declarationId, serializeDeclaration({
                status: 'ingediend',
            }));
        } else {
            await createDeclaration(serializeDeclaration({
                status: 'ingediend',
            }));
        }
        // setConfirmationOverlayTitle('Declaratie succesvol ingediend.');
        // setShowConfirmationOverlay(true);
        await Toast.show({
            text: 'Declaratie succesvol ingediend.'
        });
        setScannedImages([]);
        await router.push('/');
    }

    const handleDelete = async (e: any) => {
        e.preventDefault();
        await deleteDeclaration(declarationId);
        await Toast.show({
            text: 'Declaratie verwijderd.',
        });
        await router.push('/');
    }

    useEffect(() => {
        if (!scannedImages?.length || !router.isReady) return;
        setDeclaration((oldDeclaration: any) => ({
            ...oldDeclaration,
            attachments: scannedImages,
        }));

        return () => {
            setScannedImages([]);
        }
    }, [router.pathname, router.asPath, scannedImages, router.isReady]);

    useEffect(() => {
        if (!declarationId) return;
        getDeclarationAttachments(declarationId, declaration?.attachments)
            .then((attachments: any) => {
                setScannedImages(attachments);
            });
    }, [declarationId]);

    return (
        <Content>
            <div className="mt-8 grid gap-2 text-xs">

                <SingleDeclarationHeader declaration={declaration}/>

                <div className="bg-white p-4 space-y-2 rounded-md">
                    <button
                        disabled={!allowEdit}
                        className="text-xl font-extrabold focus:outline-2 outline-amber-400 break-all w-full h-auto overflow-hidden cursor-pointer text-left"
                        onClick={() => setInputModal({
                            show: true,
                            title: 'Voer een naam in:',
                            type: 'text',
                            defaultValue: name,
                            onConfirm: (value: string) => setName(value),
                        })}
                    >
                        {name ?? <span className="opacity-25">Nieuwe uitgave</span>}
                    </button>

                    <div className="flex flex-row justify-between items-center text-lg">
                        <span className="flex flex-row">
                            {amount} {currency}
                        </span>

                        <span>
                        </span>
                    </div>

                    <div className="flex flex-row justify-between items-center text-xs opacity-50">
                        <span>
                            DECL-18992/565
                        </span>

                        <span>
                            08-06-1992
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-md p-4 grid gap-2 grid-cols-3 relative pt-5">
                    <span className={
                        declaration?.attachments?.length
                            ? 'absolute top-1 left-4 text-[10px] opacity-50'
                            : 'Bijlagen'
                    }>
                        Bijlagen
                    </span>

                    {declaration?.attachments?.map((image: any) => (
                        <img
                            key={image}
                            src={image}
                            className="w-full h-[100px] p-2 object-contain rounded-md border-2 border-amber-400"
                            fetchPriority="high"
                        />
                    ))}
                </div>

                <CardInput
                    allowEdit={allowEdit}
                    value={description}
                    onConfirm={(value: string) => setDescription(value)}
                    label="Omschrijving"
                    title='Voer een omschrijving in:'
                />

                <CardInput
                    allowEdit={allowEdit}
                    value={category}
                    onConfirm={(value: string) => setCategory(value)}
                    label="Categorie"
                    title='Voer een categorie in:'
                    type='select'
                    options={['voeding', 'kleding', 'transport', 'accomodatie', 'overig']}
                />

                <CardInput
                    allowEdit={allowEdit}
                    value={amount}
                    onConfirm={(value: number) => setAmount(value)}
                    label="Bedrag"
                    title='Voer een bedrag in:'
                    type='number'
                />

                <CardInput
                    allowEdit={allowEdit}
                    value={currency}
                    onConfirm={(value: string) => setCurrency(value)}
                    label="Valuta"
                    title='Voer een valuta in:'
                    type='select'
                    options={['EUR', 'USD', 'GBP']}
                />

                <CardInput
                    allowEdit={allowEdit}
                    value={vat}
                    onConfirm={(value: number) => setVat(value)}
                    label="BTW percentage"
                    title='Voer een BTW percentage in:'
                    type='select'
                    options={['0%', '9%', '21%']}
                />

                <CardInput
                    allowEdit={allowEdit}
                    value={paymentMethod}
                    onConfirm={(value: string) => setPaymentMethod(value)}
                    label="Betaalmethode"
                    title='Voer een betaalmethode in:'
                    type='select'
                    options={['cash', 'pin', 'creditcard']}
                />

                {allowEdit
                    && <>
                        <div className="flex flex-row justify-between items-center gap-2">
                            <Button
                                secondary
                                padding='small'
                                fullWidth
                                onClick={handleSave}
                                className="shadow-md"
                                disabled={isSaving}
                            >
                                {isSaving &&
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <LoadingSpinner className="w-5 h-5"/>
                                    </span>
                                }
                                <span className={`!transition-none ${isSaving ? 'opacity-0' : ''}`}>
                                    Opslaan
                                </span>
                            </Button>

                            <Button
                                primary
                                padding='small'
                                fullWidth
                                onClick={handleSubmit}
                                className="shadow-md"
                            >
                                Indienen
                            </Button>
                        </div>

                        <Button
                            tertiary
                            padding='small'
                            fullWidth
                            onClick={handleDelete}
                        >
                            Verwijderen
                        </Button>
                    </>
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
