export default function Loading() {
    return <div className="z-50 fixed inset-0 bg-gray-100 flex flex-col justify-center items-center">
        <LoadingSpinner />
    </div>
}

export function LoadingSpinner() {
        return <img src="/loadingspinner.svg" className="w-10 h-10 invert" />
}
