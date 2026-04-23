export default function ResponsiveImage({ url }: { url: string }) {
    return (
        <div className="relative">
            <div className="overflow-hidden">
                <img
                    src={url}
                    alt="Cover"
                    className="w-full border border-gray-200 rounded-xl dark:border-gray-800"
                />
            </div>
        </div>
    );
}
