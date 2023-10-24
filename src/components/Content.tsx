export default function Content({ children, className = '' }: any) {
    return (
        <main className={`p-4 py-8 grid gap-2 ${className}`}>
            {children}
        </main>
    )
}
