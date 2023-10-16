import router, {useRouter} from "next/router";
import {BsArrowLeft} from "react-icons/bs";
import Button from "../Button";
import Content from "../Content";
import {useEffect, useState} from "react";
import {createDeclaration, createNotification, deleteDeclaration, updateDeclaration} from "@/firebase";
import {confirmationOverlayTitleAtom, scannedImagesAtom, showConfirmationOverlayAtom} from "@/store/atoms";
import {useAtom} from "jotai";

export default function DeclarationScreen({declaration: inputDeclaration}: any) {
    const [declaration, setDeclaration] = useState(inputDeclaration);
    const [, setShowConfirmationOverlay] = useAtom(showConfirmationOverlayAtom);
    const [, setConfirmationOverlayTitle] = useAtom(confirmationOverlayTitleAtom);
    const [scannedImages, setScannedImages] = useAtom(scannedImagesAtom);
    const declarationId = useRouter()?.query?.id ?? null;
    const status = declaration?.status ?? 'concept';
    const router = useRouter();

    const onInputChange = (e: any) => {
        const {name, value} = e.target;
        setDeclaration((oldDeclaration: any) => ({
            ...oldDeclaration,
            [name]: (name === 'amount') ? parseInt(value) : value,
        }));
    }

    const handleSave = async (e: any) => {
        e.preventDefault();

        // update
        if (declarationId) {
            const res = await updateDeclaration(declarationId, declaration);
        }
        // create
        else {
            const res = await createDeclaration({
                ...declaration,
                status: status,
            });
        }
        setConfirmationOverlayTitle('Bon opgeslagen.');
        setShowConfirmationOverlay(true);
        router.push('/');
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (declarationId) {
            await updateDeclaration(declarationId, {
                ...declaration,
                attachments: scannedImages,
                status: 'ingediend',
            });
        } else {
            await createDeclaration({
                ...declaration,
                attachments: scannedImages,
                status: 'ingediend',
            });
        }

        // await createNotification({
        //     message: `Declaratie <b>${declaration.name}</b> is succesvol ingediend.`,
        // });
        setConfirmationOverlayTitle('Declaratie succesvol ingediend.');
        setShowConfirmationOverlay(true);
        setScannedImages([]);
        router.push('/');
    }

    const handleDelete = async (e: any) => {
        e.preventDefault();
        await deleteDeclaration(declarationId);
        router.push('/');
    }

    useEffect(() => {
        if(!scannedImages?.length || !router.isReady) return;
        setDeclaration((oldDeclaration: any) => ({
            ...oldDeclaration,
            attachments: scannedImages,
        }));

        return () => {
            setScannedImages([]);
        }
    }, [router.pathname, router.asPath, scannedImages, router.isReady]);

    return (
        <Content>
            <div className="grid gap-4 text-xs">

                <div className="w-full justify-between items-center flex">
                    <Button secondary padding='small' onClick={() => router.push('/')}>
                        <BsArrowLeft className="w-8 h-8"/>
                        Terug
                    </Button>

                    <Button primary padding='small' className={
                        status === 'ingediend' ? '!bg-green-600' : undefined
                    }>
                        {status}
                    </Button>
                </div>

                <div className="bg-white p-4 space-y-2">
                    <textarea
                        name="name"
                        className="text-xl font-extrabold focus:outline-2 outline-amber-400 break-all w-full h-auto overflow-hidden"
                        defaultValue={declaration?.name}
                        onChange={onInputChange}
                        placeholder="Nieuwe bon"
                    />

                    <div className="flex flex-row justify-between items-center">
                        <span className="flex flex-row">
                            €
                            <input
                                type="text"
                                name="amount"
                                className="focus:outline-2 outline-amber-400"
                                onChange={onInputChange}
                                defaultValue={declaration?.amount}
                                placeholder="0,00"
                            />
                        </span>

                        <span>
                            {declaration?.date}
                        </span>
                    </div>
                </div>

                <div className="bg-white p-4 grid gap-2">
                    Foto

                    {declaration?.attachments?.map((image: any) => (
                        <img
                            key={image}
                            src={image}
                            className="w-[200px] h-auto object-contain"
                        />
                    ))}
                </div>

                <div className="bg-white p-4">
                    Omschrijving
                </div>

                <div className="bg-white p-4">
                    Categorie
                </div>

                <div className="bg-white p-4">
                    Bedrag
                </div>

                <div className="bg-white p-4">
                    Valuta
                </div>

                <div className="bg-white p-4">
                    BTW percentage
                </div>

                <div className="bg-white p-4">
                    Betaalmethode
                </div>

                <div className="flex flex-row justify-between items-center gap-4">
                    <Button
                        secondary
                        padding='small'
                        fullWidth
                        onClick={handleSave}
                    >
                        Opslaan
                    </Button>

                    <Button
                        primary
                        padding='small'
                        fullWidth
                        onClick={handleSubmit}
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
            </div>

            <pre className="break-all overflow-x-auto hidden">
                {JSON.stringify(declaration, null, 2)}
            </pre>
        </Content>
    )
}
