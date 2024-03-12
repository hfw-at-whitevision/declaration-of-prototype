import NotificationsScreen from "../screens/NotificationsScreen";
import {GiHamburgerMenu} from "react-icons/gi";

export default function DashboardHeader() {

    return <>
        <NotificationsScreen/>

        <header className="flex sticky top-0 flex-row justify-between items-center p-4 py-8 pt-16 gap-4 z-10">
            <div className="flex-1">
                {/*<button className="bg-black/5 rounded-full p-2 w-10 h-10 flex items-center justify-center">*/}
                {/*    */}
                {/*</button>*/}
                <GiHamburgerMenu className="text-white w-8 h-8"/>
            </div>

            <div className="flex flex-row justify-center items-center flex-1">
                <img
                    src={'/images/whitevision_logo_2024_yellow.png'}
                    alt="WhiteVision"
                    className="w-[250px]"
                />
            </div>

            <div className="flex-1">

            </div>
        </header>
    </>
}
