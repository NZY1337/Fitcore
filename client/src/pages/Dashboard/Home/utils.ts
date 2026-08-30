export function computeStreak(logs: { created_at: string }[]): number {
    if (logs.length === 0) return 0;
    const days = new Set(logs.map(l => new Date(l.created_at).toDateString()));
    const cursor = new Date();
    if (!days.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
    let streak = 0;
    while (days.has(cursor.toDateString())) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
}
