import {useAtom, useAtomValue} from 'jotai'
import {
    currentTabIndexAtom,
    declarationsAtom, IsSelectingItemsAtom, notificationsAtom,
    searchQueryAtom, selectedItemIdsAtom,
    showOverlayAtom,
} from '@/store/atoms'
import React, {useEffect, useState} from 'react';
import {deleteDeclaration, getDeclarations, getExpenses} from '@/firebase';
import DeclarationCard from '@/components/declarations/DeclarationCard';
import SearchSortBar from '@/components/SearchSortBar';
import DeclarationsPageHeader from '@/components/declarations/DeclarationsPageHeader';
import Content from '@/components/Content';
import {useRouter} from 'next/router';
import Overlay from "@/components/overlays/Overlay";
import Button from '@/components/Button';
import {Haptics} from '@capacitor/haptics';
import {BsArrowLeft, BsArrowRight, BsCheck2All, BsChevronDown, BsPlusLg, BsTrash} from "react-icons/bs";
import {Toast} from "@capacitor/toast";
import {Dialog} from "@capacitor/dialog";
import TabNavigation from "@/components/TabNavigation";
import {BiImport, BiScan} from "react-icons/bi";
import PlusMenu from "@/components/declarations/PlusMenu";
import {tabs} from '@/constants/defaults';
import ExpenseCard from "@/components/expenses/ExpenseCard";

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
    let tapStartY: any = null;
    let tapEndX: any = null;
    let tapEndY: any = null;

    const [searchQuery] = useAtom(searchQueryAtom);
    const router = useRouter();
    const [items, setItems] = useAtom(declarationsAtom);
    const claimedExpenses = items
        ?.filter((item: any) => item?.claimedIn?.length)
        ?.filter((item: any) => JSON.stringify(item || {}).toLowerCase().includes(searchQuery.toLowerCase()));
    const unclaimedExpenses = items
        ?.filter((item: any) => !item?.claimedIn || !item?.claimedIn?.length)
        ?.filter((item: any) => JSON.stringify(item || {}).toLowerCase().includes(searchQuery.toLowerCase()));
    const declarations = items;
    const [currentTabIndex, setCurrentTabIndex] = useAtom(currentTabIndexAtom);
    const [selectedItemIds, setSelectedItemIds] = useAtom(selectedItemIdsAtom);
    const [, setShowOverlay] = useAtom(showOverlayAtom);
    const [notifications] = useAtom(notificationsAtom);
    const [isSelectingItems, setIsSelectingItems] = useAtom(IsSelectingItemsAtom);
    const isSelectingExpenses = selectedItemIds.length > 0 || isSelectingItems;
    // allow section mode only for expenses
    const allowSelectionMode = currentTabIndex === 0;
    const [showClaimedExpenses, setShowClaimedExpenses] = useState(false);
    const [showUnclaimedExpenses, setShowUnclaimedExpenses] = useState(true);

    const {tabIndex: tab} = router?.query || {};
    useEffect(() => {
        if (!tab) return;
        setCurrentTabIndex(Number(tab));
    }, [tab]);

    const handleSelectExpense = (expenseId: string) => {
        console.log(`(de-)selected expense ${expenseId}`);
        // remove
        if (selectedItemIds.includes(expenseId))
            setSelectedItemIds(selectedItemIds.filter((selectedExpenseId) => selectedExpenseId !== expenseId));
        // add
        else
            setSelectedItemIds([...selectedItemIds, expenseId]);
    }

    const handleOpenDeclaration = (id: any) => {
        router.push('/declaration?id=' + id);
    }

    const handleOpenExpense = (id: any) => {
        router.push('/expense?id=' + id);
    }

    const handleTapStart = async (item: any, info) => {
        tapStartX = info.point.x;
        tapStartY = info.point.y;
        console.log('tap start', tapStartX, tapStartY);

        // if we are in selection mode
        // if (isSelectingExpenses) {
        //     await handleTap(info, item?.id);
        //     return;
        // }

        // if we are not in selection mode, open item directly
        if (!allowSelectionMode) {
            if (currentTabIndex === 0) handleOpenExpense(item.id);
            else handleOpenDeclaration(item.id);
            return;
        }

        longPressStartTimestamp = new Date().getTime();

        if (longPressTimer) clearTimeout(longPressTimer);
        longPressTimer = setTimeout(async () => {
            await Haptics.vibrate({
                duration: 40,
            });
            handleSelectExpense(item.id);
            resetTap();
        }, 500);
    }

    const handleTapEnd = async (info, itemId: string) => {
        tapEndX = info.point.x;
        tapEndY = info.point.y;

        console.log('tap end', tapEndX, tapEndY);

        const swipedLeft = tapStartX - tapEndX >= 100;
        const now = new Date().getTime();
        const pressDuration = now - longPressStartTimestamp;
        resetTap();

        // cancel out swipes horizontally or vertically
        // if (Math.abs(tapStartX - info.point.x) > 5 || Math.abs(tapStartY - info.point.y) > 5) {
        //     console.log('tap cancelled');
        //     resetTap();
        //     return;
        // }

        // if successfully CLICKED (NOT swiping)
        console.log('tap success');

        if (pressDuration < 500) {
            // check if we are selecting expenses
            if (isSelectingExpenses) {
                // (de-)select declaration
                console.log('tap success (selecting expenses)');
                handleSelectExpense(itemId);
                return;
            }
            // else open the declaration
            else if (!swipedLeft) {
                console.log('tap success (opening item)');
                if (currentTabIndex === 0) handleOpenExpense(itemId);
                else handleOpenDeclaration(itemId);
                return;
            }
        }
        else {
            console.log('tap success (long press item)');
            return;
        }
    }

    const resetTap = () => {
        tapStartX = null;
        tapStartY = null;
        tapEndX = null;
        tapEndY = null;
        clearTimeout(longPressTimer);
        longPressStartTimestamp = null;
    }

    const handleTapCancel = (event, info) => {
        console.log('tap cancel');
        resetTap();
    }

    const handleDeleteSelectedDeclarations = async (e) => {
        e.preventDefault();
        const deletePromises = [];
        for (const declarationId of selectedItemIds) {
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
            setItems(oldDeclarations => oldDeclarations.filter((oldDeclaration: any) => !selectedItemIds.includes(oldDeclaration.id)));
            setSelectedItemIds([]);
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
        if (!selectedItemIds.length) return;
        const serializedSelectedExpenseIds: any = selectedItemIds.join(',');
        setIsSelectingItems(false);
        setSelectedItemIds([]);
        await router.push('/declaration?createFromExpenses=' + serializedSelectedExpenseIds);
    }

    const handleCancelCreateDeclaration = () => {
        setSelectedItemIds([]);
        setIsSelectingItems(false);
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
        setSelectedItemIds([]);
        if (longPressTimer) clearTimeout(longPressTimer);
        longPressStartTimestamp = null;
    }, [router.query, router.asPath, router.pathname, router.query]);

    return <>
        <DeclarationsPageHeader/>

        <Content>

            <SearchSortBar/>

            {(currentTabIndex === 0)
                && <GroupHeader
                    open={showUnclaimedExpenses}
                    onClick={() => setShowUnclaimedExpenses(!showUnclaimedExpenses)}
                    className="mt-4"
                    title={`Nog in te dienen (${unclaimedExpenses?.length})`}
                />
            }
            {
                (items?.length === 0 && showUnclaimedExpenses) &&
                <div
                    className="p-8 opacity-50 border border-dashed border-gray-400 bg-transparent flex items-center justify-center text-xs rounded-md">
                    Importeer of scan een bon om te beginnen
                </div>
            }
            {
                (currentTabIndex === (0) && showUnclaimedExpenses)
                && unclaimedExpenses?.map((item: any, index: number) => (
                    <ExpenseCard
                        key={`${JSON.stringify(item)}-${index}`}
                        expense={item}
                        selected={selectedItemIds.includes(item.id)}
                        selectFn={() => handleSelectExpense(item.id)}
                        deselectFn={() => handleSelectExpense(item.id)}
                        onSwipeLeft={async () => await handleSwipeLeft(item.id)}
                        allowSwipeLeft={true}
                        isSelectingItems={isSelectingExpenses}
                        onTapStart={async (event, info) => await handleTapStart(item, info)}
                        onTap={async (event, info) => await handleTapEnd(info, item.id)}
                        onTapCancel={handleTapCancel}
                    />
                ))
            }

            {(currentTabIndex === 0 && claimedExpenses?.length > 0)
                && <GroupHeader
                    open={showClaimedExpenses}
                    onClick={() => setShowClaimedExpenses(!showClaimedExpenses)}
                    className="mt-4"
                    title={`Reeds ingediend (${claimedExpenses?.length})`}
                />
            }

            {(currentTabIndex === 0)
                && <section
                    className={`
                    grid gap-2 grid-cols-1 transition-all duration-500 ease-in-out
                    ${showClaimedExpenses ? 'h-auto' : 'h-0 overflow-hidden'}
                    `}
                >
                    {claimedExpenses?.map((expense: any, index: number) => (
                        <ExpenseCard
                            className="opacity-40"
                            key={`${JSON.stringify(expense)}-${index}`}
                            expense={expense}
                            selected={selectedItemIds.includes(expense.id)}
                            selectFn={() => handleSelectExpense(expense.id)}
                            deselectFn={() => handleSelectExpense(expense.id)}
                            onSwipeLeft={async () => await handleSwipeLeft(expense.id)}
                            allowSwipeLeft={true}
                            isSelectingItems={isSelectingExpenses}
                            onTapStart={async (event, info) => await handleTapStart(expense, info)}
                            onTap={async (event, info) => await handleTapEnd(info, expense.id)}
                            onTapCancel={handleTapCancel}
                        />
                    ))}
                </section>
            }

            {
                (currentTabIndex === 1)
                && declarations?.map((item: any, index: number) => (
                    <DeclarationCard
                        key={`${JSON.stringify(item)}-${index}`}
                        declaration={item}
                        selected={selectedItemIds.includes(item.id)}
                        deselectFn={() => handleSelectExpense(item.id)}
                        onSwipeLeft={async () => await handleSwipeLeft(item.id)}
                        allowSwipeLeft={true}
                        isSelectingItems={false}
                        onTapStart={async (event, info) => await handleTapStart(item, info)}
                        onTap={async (event, info) => await handleTapEnd(info, item.id)}
                        onTapCancel={handleTapCancel}
                    />
                ))
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

        {!isSelectingExpenses &&
            <PlusMenu/>
        }

        {selectedItemIds?.length > 0
            && <div className="fixed bottom-4 left-4 right-4 flex flex-row items-center justify-center gap-2">
                <Button
                    primary
                    className="flex-1 h-16 rounded-lg !bg-black shadow-lg text-sm"
                >
                    Geselecteerde {selectedItemIds.length} bonnen samenvoegen
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
            <div className="fixed bottom-24 right-4 left-4 z-50 flex flex-row gap-2">
                <Button
                    primary
                    disabled={selectedItemIds.length === 0}
                    padding='small'
                    className={`!rounded-full text-sm !bg-black w-full ${selectedItemIds.length === 0 && 'opacity-75 pointer-events-none'}'}}`}
                    onClick={handleCreateDeclaration}
                >
                    <BsArrowRight className="w-3 h-3"/>
                    Creëer declaratie {selectedItemIds.length > 0 && `(${selectedItemIds.length})`}
                </Button>
                <Button
                    primary
                    padding='small'
                    className="!rounded-full text-sm !bg-red-600 w-full"
                    onClick={handleCancelCreateDeclaration}
                >
                    Annuleren
                </Button>
            </div>
        }

        <TabNavigation/>

        <Overlay/>
    </>
}

const GroupHeader = ({title, className = '', onClick = undefined, open = true, ...props}) => (
    <button
        onClick={onClick}
        className={className + " p-4 text-black bg-gray-200 flex justify-between items-center flex-row text-sm font-bold cursor-pointer rounded-full"}
        {...props}
    >
        <span></span>
        {title}
        <BsChevronDown
            className={`w-4 h-4 font-black transition-all duration-300 ${!open ? 'rotate-180' : ''}`}/>
    </button>
)
