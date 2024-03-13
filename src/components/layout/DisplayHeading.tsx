import {DM_Sans, Fahkwang, Krona_One, Onest, Syne} from "next/font/google";

export const displayFont = Onest({subsets: ["latin"], weight: ["400", "500", "600","700", "900"]});

export default function DisplayHeading({children, className = '', ...props}) {
    return <h2 className={displayFont.className + ' ' + className} {...props}>
        {children}
    </h2>
}
