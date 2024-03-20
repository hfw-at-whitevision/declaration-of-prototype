export default function BackgroundInset({className}: any) {
    return <div
        className={`
            bg-inset fixed left-0 right-0 bottom-0 h-[360px] bg-gradient-to-b from-zinc-900/0 to-zinc-900/10 pointer-events-none
            ${className}
        `}
    />
}
