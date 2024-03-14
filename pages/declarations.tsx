import {useAtom, useAtomValue} from 'jotai'
import {
    currentTabIndexAtom,
    declarationsAtom, IsSelectingItemsAtom, notificationsAtom, primaryColorAtom,
    searchQueryAtom, selectedItemIdsAtom, showNewDeclarationOverlayAtom, showNotificationsScreenAtom,
    showOverlayAtom,
} from '@/store/atoms'
import React, {useEffect, useState} from 'react';
import {deleteDeclaration, getDeclarations, getExpenses} from '@/firebase';
import DeclarationCard from '@/components/declarations/DeclarationCard';
import SearchSortBar from '@/components/SearchSortBar';
import OverviewHeader from '@/components/layout/OverviewHeader';
import Content from '@/components/Content';
import {useRouter} from 'next/router';
import Overlay from "@/components/overlays/Overlay";
import Button from '@/components/Button';
import {Haptics} from '@capacitor/haptics';
import {
    BsArrowLeft,
    BsArrowRight,
    BsCheck2All,
    BsCheckLg,
    BsChevronDown,
    BsHourglassTop,
    BsPlusLg,
    BsTrash, BsXLg
} from "react-icons/bs";
import {Toast} from "@capacitor/toast";
import {Dialog} from "@capacitor/dialog";
import TabNavigation from "@/components/TabNavigation";
import {BiImport, BiScan} from "react-icons/bi";
import PlusMenu from "@/components/declarations/PlusMenu";
import {tabs} from '@/constants/defaults';
import ExpenseCard from "@/components/expenses/ExpenseCard";
import {displayFont} from "@/components/layout/DisplayHeading";
import {FaChevronDown} from "react-icons/fa";
import DeclarationsTabBar from "@/components/declarations/DeclarationsTabBar";

export default function Home() {
    let longPressStartTimestamp: any = null;
    let longPressTimer: any = null;
    let tapStartX: any = null;
    let tapStartY: any = null;
    let tapEndX: any = null;
    let tapEndY: any = null;

    const [currentTabIndex, setCurrentTabIndex] = useAtom(currentTabIndexAtom);
    const [selectedItemIds, setSelectedItemIds] = useAtom(selectedItemIdsAtom);
    const [, setShowOverlay] = useAtom(showOverlayAtom);
    const [isSelectingItems, setIsSelectingItems] = useAtom(IsSelectingItemsAtom);
    const isSelectingExpenses = selectedItemIds.length > 0 || isSelectingItems;
    const isInSelectionMode = selectedItemIds?.length > 0 || isSelectingItems;
    const [primaryColor, setPrimaryColor] = useAtom(primaryColorAtom);
    const backgroundColor = isInSelectionMode
        ? 'bg-amber-500'
        : (currentTabIndex === 0)
            ? 'bg-amber-400'
            : 'bg-indigo-500';

    useEffect(() => {
        setPrimaryColor(backgroundColor);
    }, [backgroundColor]);
    const [searchQuery] = useAtom(searchQueryAtom);
    const router = useRouter();
    const [items, setItems]: any = useAtom(declarationsAtom);
    const [declarationStatusFilters, setDeclarationStatusFilters]: any = useState([]);
    const claimedExpenses = items
        ?.filter((item: any) => item?.claimedIn?.length)
        ?.filter((item: any) => JSON.stringify(item || {}).toLowerCase().includes(searchQuery.toLowerCase()));
    const unclaimedExpenses = items
        ?.filter((item: any) => !item?.claimedIn || !item?.claimedIn?.length)
        ?.filter((item: any) => JSON.stringify(item || {}).toLowerCase().includes(searchQuery.toLowerCase()));
    const declarations: any = items
        ?.filter((item: any) => declarationStatusFilters?.length ? declarationStatusFilters.includes(item?.status) : true)
        ?.filter((item: any) => JSON.stringify(item || {}).toLowerCase().includes(searchQuery.toLowerCase()))
        ?.sort((a: any, b: any) => new Date(b?.date).getTime() - new Date(a?.date).getTime());    // allow section mode only for expenses
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
            setSelectedItemIds(selectedItemIds.filter((selectedExpenseId: any) => selectedExpenseId !== expenseId));
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

    const handleTapStart = async (item: any, info: any) => {
        tapStartX = info.point.x;
        tapStartY = info.point.y;
        console.log('tap start', tapStartX, tapStartY);

        // if we are in selection mode
        // if (isSelectingExpenses) {
        //     await handleTap(info, item?.id);
        //     return;
        // }

        // if we are not in selection mode, open item directly
        // if (!allowSelectionMode) {
        //     if (currentTabIndex === 0) handleOpenExpense(item.id);
        //     else handleOpenDeclaration(item.id);
        //     return;
        // }

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

    const handleTapEnd = async (info: any, itemId: string) => {
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
        } else {
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

    const handleTapCancel = (event: any, info: any) => {
        console.log('tap cancel');
        resetTap();
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

    const handleClickStatusFilter = (status: string) => {
        if (declarationStatusFilters?.includes(status))
            setDeclarationStatusFilters(declarationStatusFilters.filter((filter: any) => filter !== status));
        else
            setDeclarationStatusFilters(declarationStatusFilters?.length ? [...declarationStatusFilters, status] : [status]);
    }

    const [title, setTitle]: any = useState(<><span className="!font-thin">Mijn</span> bonnen</>);

    useEffect(() => {
        switch (currentTabIndex) {
            case 0:
                setTitle(isInSelectionMode ? <>Selecteer <span className="!font-thin">bonnen</span></> : <><span className="!font-thin">Mijn</span> bonnen</>);
                break;
            case 1:
                setTitle(<><span className="!font-thin">Mijn</span> declaraties</>);
                break;
        }
    }, [currentTabIndex, isInSelectionMode]);

    return <>
        <OverviewHeader title={title}/>

        <DeclarationsTabBar />

        <Content className="bg-white m-4 rounded-2xl">

            <SearchSortBar/>

            {(currentTabIndex === 0) && <>
                <GroupHeader
                    open={showUnclaimedExpenses}
                    color="green"
                    className="mt-4"
                    onClick={() => setShowUnclaimedExpenses(!showUnclaimedExpenses)}
                    title={`Nog in te dienen`}
                    itemsCount={unclaimedExpenses?.length}
                />
                {
                    (items?.length === 0 && showUnclaimedExpenses) &&
                    <div
                        className="p-8 opacity-50 border border-dashed border-gray-400 bg-transparent flex items-center justify-center text-xs rounded-md">
                        Importeer of scan een bon om te beginnen
                    </div>
                }
                <ListSection>
                    {
                        (currentTabIndex === (0) && showUnclaimedExpenses)
                        && unclaimedExpenses?.map((item: any, index: number) => (
                            <ExpenseCard
                                backgroundColor="bg-gray-50"
                                key={`${JSON.stringify(item)}-${index}`}
                                expense={item}
                                selected={selectedItemIds.includes(item.id)}
                                selectFn={() => handleSelectExpense(item.id)}
                                deselectFn={() => handleSelectExpense(item.id)}
                                onSwipeLeft={async () => await handleSwipeLeft(item.id)}
                                allowSwipeLeft={true}
                                isSelectingItems={isSelectingExpenses}
                                onTapStart={async (event: any, info: any) => await handleTapStart(item, info)}
                                onTap={async (event: any, info: any) => await handleTapEnd(info, item.id)}
                                onTapCancel={handleTapCancel}
                            />
                        ))
                    }
                </ListSection>

                {(claimedExpenses?.length > 0)
                    && <GroupHeader
                        open={showClaimedExpenses}
                        onClick={() => setShowClaimedExpenses(!showClaimedExpenses)}
                        color="red"
                        className="mt-4"
                        title={`Reeds ingediend`}
                        itemsCount={claimedExpenses?.length}
                    />
                }

                <ListSection
                    className={`
                        ${showClaimedExpenses ? 'h-auto' : 'h-0 overflow-hidden'}
                    `}
                >
                    {claimedExpenses?.map((expense: any, index: number) =>
                        <ExpenseCard
                            backgroundColor="bg-gray-50"
                            key={`${JSON.stringify(expense)}-${index}`}
                            expense={expense}
                            selected={selectedItemIds.includes(expense.id)}
                            selectFn={() => handleSelectExpense(expense.id)}
                            deselectFn={() => handleSelectExpense(expense.id)}
                            onSwipeLeft={async () => await handleSwipeLeft(expense.id)}
                            allowSwipeLeft={true}
                            isSelectingItems={isSelectingExpenses}
                            onTapStart={async (event: any, info: any) => await handleTapStart(expense, info)}
                            onTap={async (event: any, info: any) => await handleTapEnd(info, expense.id)}
                            onTapCancel={handleTapCancel}
                        />
                    )}
                </ListSection>
            </>
            }

            {(currentTabIndex === 1) && <>
                <section className="flex flex-row gap-2 text-white text-xs font-bold">
                    <button
                        onClick={() => handleClickStatusFilter("100")}
                        className={`
                        flex items-center justify-center p-1 w-16 h-8 bg-amber-400 rounded-full bg-amber-400
                        ${declarationStatusFilters?.length > 0 && !declarationStatusFilters.includes("100") ? 'opacity-25' : ''}
                    `}
                    >
                        <BsHourglassTop className="w-3 h-3 mr-1"/>
                        {items?.filter((item: any) => item?.status === '100').length}
                    </button>
                    <button
                        onClick={() => handleClickStatusFilter("300")}
                        className={`
                        flex items-center justify-center p-1 w-16 h-8 bg-amber-400 rounded-full bg-green-500
                        ${declarationStatusFilters?.length > 0 && !declarationStatusFilters.includes("300") ? 'opacity-25' : ''}
                    `}
                    >
                        <BsCheckLg className="w-3 h-3 mr-1"/>
                        {items?.filter((item: any) => item?.status === '300').length}
                    </button>
                    <button onClick={() => handleClickStatusFilter("200")}
                            className={`
                        flex items-center justify-center p-1 w-16 h-8 bg-red-500 rounded-full bg-amber-400
                        ${declarationStatusFilters?.length > 0 && !declarationStatusFilters.includes("200") ? 'opacity-25' : ''}
                    `}
                    >
                        <BsXLg className="w-3 h-3 mr-1"/>
                        {items?.filter((item: any) => item?.status === '200').length}
                    </button>
                </section>
                <ListSection>
                    {declarations
                        ?.map((item: any, index: number) => (
                            <DeclarationCard
                                backgroundColor="bg-gray-50"
                                key={`${JSON.stringify(item)}-${index}`}
                                declaration={item}
                                selected={selectedItemIds.includes(item.id)}
                                deselectFn={() => handleSelectExpense(item.id)}
                                onSwipeLeft={async () => await handleSwipeLeft(item.id)}
                                allowSwipeLeft={true}
                                isSelectingItems={false}
                                onClick={() => handleOpenDeclaration(item.id)}
                            />
                        ))}
                </ListSection>
            </>}

            {/*<pre className="text-xs mt-8 overflow-x-auto">*/}
            {/*    notifications: {JSON.stringify(notifications, null, 2)}*/}
            {/*    <br/>*/}
            {/*    tabs: {JSON.stringify(tabs, null, 2)}*/}
            {/*    <br/>*/}
            {/*    searchQuery: {searchQuery}*/}
            {/*    <br/>*/}
            {/*    declarations: {JSON.stringify(items, null, 2)}*/}
            {/*</pre>*/}
        </Content>

        <div className="h-16 w-full bg-transparent"/>

        {!isSelectingExpenses &&
            <PlusMenu/>
        }

        {isSelectingExpenses &&
            <div className="fixed bottom-4 right-4 left-4 z-50 grid grid-cols-2 gap-2">
                <Button
                    primary
                    disabled={selectedItemIds.length === 0}
                    padding='small'
                    className={`!rounded-full !font-black text-xs !bg-black w-full ${selectedItemIds.length === 0 && 'opacity-75 pointer-events-none'}'}}`}
                    onClick={handleCreateDeclaration}
                >
                    {/*<BsArrowRight className="w-3 h-3"/>*/}
                    Creëer declaratie {selectedItemIds.length > 0 && `(${selectedItemIds.length})`}
                </Button>
                <Button
                    primary
                    padding='small'
                    className="!rounded-full !font-black text-xs !bg-red-600 w-full"
                    onClick={handleCancelCreateDeclaration}
                >
                    Annuleren
                </Button>
            </div>
        }

        {!isSelectingExpenses &&
            <TabNavigation/>
        }

        <Overlay/>
    </>
}

const GroupHeader = ({title, color, className = '', itemsCount = 0, onClick = undefined, open = true, ...props}: any) => {
    const [primaryColor] = useAtom(primaryColorAtom);
    const backgroundColor = !!color ? `bg-${color}-500` : primaryColor;
    const balloonTextColor = !!color ? `text-${color}-500` : 'text-white';
    return (
        <button
            onClick={onClick}
            {...props}
            className={`
                p-4 text-white flex justify-between items-center flex-row text-xs font-bold cursor-pointer rounded-full
                ${backgroundColor} ${className} ${displayFont.className}
            `}
        >
            <span></span>

            <span className="flex flex-row items-center justify-center">
                {title}
                <span className={`ml-1 w-4 h-4 bg-white font-black rounded-full text-amber-500 flex items-center justify-center ${balloonTextColor}`}>
                    {itemsCount}
                </span>
            </span>

            <FaChevronDown
                className={`w-4 h-4 font-black transition-all duration-300 ${!open ? 'rotate-180' : ''}`}
            />
        </button>
    );
}

const ListSection = ({className, children, ...props}: any) => (
    <section className={`grid grid-cols-1 gap-2 divide-y-black/10 ${className}`} {...props}>
        {children}
    </section>
)
