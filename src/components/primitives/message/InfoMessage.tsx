import {BsFillInfoCircleFill} from "react-icons/bs";

export default function InfoMessage({title = '', color='blue', children: message, ...props}) {
    const backgroundColor = `bg-${color}-200/75`;
    const textColor = `text-${color}-700`;
    const borderColor = `border-black/10`;
    return <div
        {...props}
        className={`${backgroundColor} ${textColor} rounded-lg  px-4 py-8 relative w-full flex flex-row items-center`}
        role="alert"
    >
        <BsFillInfoCircleFill className="w-5 h-5 mr-4"/>

        <span className={`flex-1 border-l ${borderColor} pl-4 text-sm`}>
            {title
                && <p className="font-bold">{title}</p>
            }
            <p>{message}</p>
        </span>
    </div>
}
