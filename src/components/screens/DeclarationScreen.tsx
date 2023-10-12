import router, {useRouter} from "next/router";
import {BsArrowLeft} from "react-icons/bs";
import Button from "../Button";
import Content from "../Content";
import {useState} from "react";
import {createDeclaration, createNotification, deleteDeclaration, updateDeclaration} from "@/firebase";
import {confirmationOverlayTitleAtom, showConfirmationOverlayAtom} from "@/store/atoms";
import {useAtom} from "jotai";

export default function DeclarationScreen({declaration: inputDeclaration}: any) {
    const [declaration, setDeclaration] = useState(inputDeclaration);
    const [, setShowConfirmationOverlay] = useAtom(showConfirmationOverlayAtom);
    const [, setConfirmationOverlayTitle] = useAtom(confirmationOverlayTitleAtom);
    const declarationId = useRouter()?.query?.id ?? null;
    const status = declaration?.status ?? 'concept';

    const onInputChange = (e) => {
        const {name, value} = e.target;
        setDeclaration(oldDeclaration => ({
            ...oldDeclaration,
            [name]: (name === 'amount') ? parseInt(value) : value,
        }));
    }

    const handleSave = async (e) => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (declarationId) {
            await updateDeclaration(declarationId, {
                ...declaration,
                status: 'ingediend',
            });
        } else {
            await createDeclaration({
                ...declaration,
                status: 'ingediend',
            });
        }

        await createNotification(`Declaratie <b>${declaration.name}</b> is succesvol ingediend.`);
        setConfirmationOverlayTitle('Declaratie succesvol ingediend.');
        setShowConfirmationOverlay(true);
        router.push('/');
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        await deleteDeclaration(declarationId);
        router.push('/');
    }

    return (
        <Content>
            <div className="grid gap-4">

                <div className="w-full justify-between items-center flex">
                    <Button secondary padding='small' onClick={() => router.push('/')}>
                        <BsArrowLeft className="w-8 h-8"/>
                        Terug
                    </Button>

                    <Button primary padding='small' className={
                        status === 'ingediend' ? '!bg-green-600' : null
                    }>
                        {status}
                    </Button>
                </div>

                <div className="bg-white p-8 space-y-2">
                    <input
                        name="name"
                        type="text"
                        className="text-4xl font-extrabold focus:outline-2 outline-amber-400"
                        defaultValue={declaration?.name}
                        onChange={onInputChange}
                        placeholder="Nieuwe bon"
                    />

                    <div className="flex flex-row justify-between items-center">
                        <span>
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

                <div className="bg-white p-8">
                    Foto
                </div>

                <div className="bg-white p-8">
                    Naam
                </div>

                <div className="bg-white p-8">
                    Omschrijving
                </div>

                <div className="bg-white p-8">
                    Categorie
                </div>

                <div className="bg-white p-8">
                    Bedrag
                </div>

                <div className="bg-white p-8">
                    Valuta
                </div>

                <div className="bg-white p-8">
                    BTW percentage
                </div>

                <div className="bg-white p-8">
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

            <pre className="hidden">
                {JSON.stringify(declaration, null, 2)}
            </pre>
        </Content>
    )
}
