type AvatarProps = {
    title: string;
    avatarUrl?: string;
    isOnline?: boolean;
    size?: 'sm' | 'md' | 'lg';
};

export function Avatar({
    title,
    avatarUrl, 
    size = 'md', 
    isOnline = true,
}: AvatarProps) {
    const sizes = {
        sm: 'h-10 w-10',
        md: 'h-12 w-12',
        lg: 'h-16 w-16',
    };

    const initial = title.trim().slice(0, 1).toUpperCase();

    return (
        <div className="relative shrink-0">
            {avatarUrl ?(
                <img
                    src={avatarUrl}
                    alt={title}
                    className={`${sizes[size]} rounded-full object-cover`}
                />
            ): (
                <div className={`${sizes[size]} flex items-center justify-center rounded-full bg-blue-200 font-semibold text-blue-700`}>
                    {initial}
                </div>
            )}

            <span
                className={[
                "absolute bottom-0 right-0 rounded-full border-2 border-white",
                size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5",
                // Зависит от размера аватара. Если sm — точка меньше, иначе больше
                isOnline ? "bg-emerald-500" : "bg-slate-300",
                ].join(" ")}
            />
            </div>
    );
}