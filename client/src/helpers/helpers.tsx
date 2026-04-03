const extractTitle = (content: string): string => {
    try {
        const parsed = JSON.parse(content);
        const firstParagraph = parsed?.content?.[0];
        if (firstParagraph?.content?.[0]?.text) {
            const text = firstParagraph.content[0].text;
            return text.length > 50 ? text.substring(0, 50) + "..." : text;
        }
        return "Journal Entry";
    } catch {
        return content.length > 50 ? content.substring(0, 50) + "..." : content || "Journal Entry";
    }
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    return `${day} ${month}`;
};


export { extractTitle, formatDate };