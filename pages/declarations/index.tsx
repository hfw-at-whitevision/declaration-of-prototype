import {useAtom} from 'jotai'
import {
    currentTabIndexAtom,
    declarationsAtom, notificationsAtom,
    searchQueryAtom,
    showOverlayAtom,
} from '@/store/atoms'
import React, {useEffect, useState} from 'react';
import {deleteDeclaration, getDeclarations, getExpenses} from '@/firebase';
import DeclarationCard from '@/components/declarations/DeclarationCard';
import SearchSortBar from '@/components/SearchSortBar';
import DeclarationsHeader from '@/components/declarations/DeclarationsHeader';
import Content from '@/components/Content';
import {useRouter} from 'next/router';
import Overlay from "@/components/overlays/Overlay";
import Button from '@/components/Button';
import {Haptics} from '@capacitor/haptics';
import {BsArrowLeft, BsArrowRight, BsPlusLg, BsTrash} from "react-icons/bs";
import {Toast} from "@capacitor/toast";
import {Dialog} from "@capacitor/dialog";
import TabNavigation from "@/components/TabNavigation";
import {BiImport, BiScan} from "react-icons/bi";
import PlusMenu from "@/components/declarations/PlusMenu";
import {tabs} from '@/constants/defaults';
import ExpenseCard from "@/components/declarations/ExpenseCard";

interface Declaration {
    id?: string;
    name?: string;
    amount?: number;
    status?: string;
    attachments?: Array<string>;
    date?: string;
    description?: string;
    type?: string;
    user?: string;
    created?: string;
    updated?: string;
}

export default function Home() {
    let longPressStartTimestamp: any = null;
    let longPressTimer: any = null;
    let tapStartX: any = null;
    let tapEndX: any = null;

    const router = useRouter();
    const [items, setItems] = useAtom(declarationsAtom);
    const [currentTabIndex] = useAtom(currentTabIndexAtom);
    const [searchQuery] = useAtom(searchQueryAtom);
    const [selectedExpenseIds, setSelectedExpenseIds] = useState<Array<string>>([]);
    const [, setShowOverlay] = useAtom(showOverlayAtom);
    const [notifications] = useAtom(notificationsAtom);
    const isSelectingExpenses = selectedExpenseIds.length > 0;

    const handleSelectExpense = (expenseId: string) => {
        // remove
        if (selectedExpenseIds.includes(expenseId))
            setSelectedExpenseIds(selectedExpenseIds.filter((selectedExpenseId) => selectedExpenseId !== expenseId));
        // add
        else
            setSelectedExpenseIds([...selectedExpenseIds, expenseId]);
    }

    const handleOpenDeclaration = (id: any) => {
        router.push('/declaration?id=' + id);
    }

    const handleOpenExpense = (id: any) => {
        router.push('/expense?id=' + id);
    }

    const handleTapStart = async (expense: any, info) => {
        if (isSelectingExpenses) {
            handleSelectExpense(expense?.id);
            return;
        }

        console.log('tap start');
        tapStartX = info.point.x;
        console.log('tapStartX', tapStartX);
        longPressStartTimestamp = new Date().getTime();

        if (longPressTimer) clearTimeout(longPressTimer);
        longPressTimer = setTimeout(async () => {
            await Haptics.vibrate({
                duration: 40,
            });
            handleSelectExpense(expense.id);
        }, 500);
    }

    const handleTap = async (info, itemId: string) => {
        console.log('tap success')
        tapEndX = info.point.x;
        const swipedLeft = tapStartX - tapEndX >= 100;

        const now = new Date().getTime();
        const pressDuration = now - longPressStartTimestamp;

        clearTimeout(longPressTimer);
        longPressStartTimestamp = null;

        if (pressDuration < 500) {
            // check if we are selecting expenses
            if (isSelectingExpenses) {
                // (de-)select declaration
                if (selectedExpenseIds.includes(itemId)) {
                    handleSelectExpense(itemId);
                }
                return;
            }
            // else open the declaration
            else if (!swipedLeft) {
                if (currentTabIndex === 0) handleOpenExpense(itemId);
                else handleOpenDeclaration(itemId);
            }
        }
    }

    const handleTapCancel = (event, info) => {
        console.log('tap cancel');
        tapStartX = null;
        tapEndX = null;
        clearTimeout(longPressTimer);
        longPressStartTimestamp = null;
    }

    const handleDeleteSelectedDeclarations = async (e) => {
        e.preventDefault();
        const deletePromises = [];
        for (const declarationId of selectedExpenseIds) {
            deletePromises.push(deleteDeclaration(declarationId));
        }
        const res = await Promise.all(deletePromises);
        if (!res) await Toast.show({
            text: 'Error.',
        });
        else {
            await Toast.show({
                text: 'Geselecteerde declaraties verwijderd.',
            });
            setItems(oldDeclarations => oldDeclarations.filter((oldDeclaration: any) => !selectedExpenseIds.includes(oldDeclaration.id)));
            setSelectedExpenseIds([]);
        }
    }

    const handleSwipeLeft = async (declarationId: string) => {
        console.log('on swipe left');

        await Haptics.vibrate({
            duration: 40,
        });

        const {value} = await Dialog.confirm({
            title: 'Weet je het zeker?',
            message: 'Weet je zeker dat je deze declaratie wilt verwijderen?',
        });
        if (value) await deleteDeclaration(declarationId);

        return value;
    }

    const handleCreateDeclaration = async () => {
        if (!selectedExpenseIds.length) return;
        const serializedSelectedExpenseIds: any = selectedExpenseIds.join(',');
        router.push('/declaration?createFromExpenses=' + serializedSelectedExpenseIds);
    }

    useEffect(() => {
        switch (currentTabIndex) {
            case 0:
                getExpenses().then((expenses) => setItems(expenses));
                break;
            case 1:
                getDeclarations().then((declarations) => setItems(declarations));
                break;
        }
    }, [currentTabIndex]);

    useEffect(() => {
        setShowOverlay(false);
        setSelectedExpenseIds([]);
        if (longPressTimer) clearTimeout(longPressTimer);
        longPressStartTimestamp = null;
    }, [router.query, router.asPath, router.pathname, router.query]);



    return <>
        <DeclarationsHeader/>

        <Content>

            <SearchSortBar/>
            {
                items
                    // .filter((declaration: any) => declaration?.status === tabs[currentTabIndex])
                    // .filter((declaration: any) => declaration?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((item: any, index: number) => {
                        if (currentTabIndex === 1) return (
                            <DeclarationCard
                                key={`${JSON.stringify(item)}-${index}`}
                                declaration={item}
                                selected={selectedExpenseIds.includes(item.id)}
                                deselectFn={() => handleSelectExpense(item.id)}
                                onSwipeLeft={async () => await handleSwipeLeft(item.id)}
                                allowSwipeLeft={true}

                                onTapStart={async (event, info) => await handleTapStart(item, info)}
                                onTap={async (event, info) => await handleTap(info, item.id)}
                                onTapCancel={handleTapCancel}
                            />
                        );
                        else return (
                            <ExpenseCard
                                key={`${JSON.stringify(item)}-${index}`}
                                expense={item}
                                selected={selectedExpenseIds.includes(item.id)}
                                deselectFn={() => handleSelectExpense(item.id)}
                                onSwipeLeft={async () => await handleSwipeLeft(item.id)}
                                allowSwipeLeft={true}

                                onTapStart={async (event, info) => await handleTapStart(item, info)}
                                onTap={async (event, info) => await handleTap(info, item.id)}
                                onTapCancel={handleTapCancel}
                            />
                        )
                    })
            }

            <pre className="text-xs mt-8 overflow-x-auto hidden">
                notifications: {JSON.stringify(notifications, null, 2)}
                <br/>
                tabs: {JSON.stringify(tabs, null, 2)}
                <br/>
                searchQuery: {searchQuery}
                <br/>
                declarations: {JSON.stringify(items, null, 2)}
            </pre>
        </Content>

        <PlusMenu/>

        {selectedExpenseIds?.length > 0
            && <div className="fixed bottom-4 left-4 right-4 flex flex-row items-center justify-center gap-2">
                <Button
                    primary
                    className="flex-1 h-16 rounded-lg !bg-black shadow-lg text-sm"
                >
                    Geselecteerde {selectedExpenseIds.length} bonnen samenvoegen
                </Button>
                <Button
                    primary
                    className="h-16 rounded-lg !bg-red-600 shadow-lg text-sm"
                    onClick={handleDeleteSelectedDeclarations}
                >
                    <BsTrash className="w-6 h-6 text-white"/>
                </Button>
            </div>
        }

        {isSelectingExpenses &&
            <div className="absolute bottom-24 right-4 left-4 z-50">
                <Button
                    primary
                    padding='small'
                    className="!rounded-full !bg-black"
                    onClick={handleCreateDeclaration}
                >
                    <BsArrowRight className="w-4 h-4"/>
                    Creëer declaratie
                </Button>
            </div>
        }

        <TabNavigation/>

        <Overlay/>
    </>
}
