export default function BackgroundInset({className}) {
    return <div
        className={`
            bg-inset fixed left-0 right-0 bottom-0 h-[360px] bg-gradient-to-b from-zinc/0 to-zinc/25 pointer-events-none
            ${className}
        `}
    />
}
