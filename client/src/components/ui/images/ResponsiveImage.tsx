export default function ResponsiveImage({ url }: { url: string }) {
    return (
        <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
            <img
                src={url}
                alt="Cover"
                className="absolute inset-0 w-full h-full object-cover"
            />
        </div>
    );
}
