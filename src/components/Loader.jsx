
export default function Loader({ label }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 py-8 w-full">
            <div className="flex items-center gap-1.5">
                {[0, 0.15, 0.3].map((delay, i) => (
                    <span
                        key={i}
                        className="w-2 h-2 rounded-full bg-gray-400"
                        style={{ animation: "bounce-dot 1.2s ease-in-out infinite", animationDelay: `${delay}s` }}
                    />
                ))}
            </div>
            {label && <p className="text-sm text-gray-400">{label}</p>}
        </div>
    );
}