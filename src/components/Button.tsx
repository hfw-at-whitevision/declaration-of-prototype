export default function Button({
    primary = false,
    secondary = false,
    tertiary = false,
    children,
    padding = 'large',
    fullWidth = false,
    className = '',
    ...props
}) {
    return <>
            <button
                className={`
                inline-flex flex-row justify-center items-center font-bold gap-2
                ${fullWidth ? 'w-full flex-1' : ''}
                ${padding === 'large' ? 'p-8' : 'p-4'}
                ${primary ? "bg-amber-400 text-white" : ""}
                ${!primary && !tertiary ? "bg-gray-200 text-black" : ""}
                ${tertiary ? "bg-transparent text-black" : ""}
                ${className}
            `}
                {...props}
            >
                {children}
            </button>
    </>
}
