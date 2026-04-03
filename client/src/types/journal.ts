
// Journal types
export interface JournalEntry {
    id: string;
    userId: string;
    content: string;
    status?: string;
    aiAnalysisStatus?: "completed" | "pending" | "not_requested";
    createdAt: string;
    embedding: number[];
    analysis?: EmotionalAnalysis;
}

export interface EmotionalAnalysis {
    id: string;
    journalEntryId: string;
    dominantEmotion: string;
    cognitiveDistortion?: string;
    riskScore?: number;
}

export interface Alert {
    id: string;
    userId: string;
    message: string;
    level: string;
    createdAt: string;
}

export type JournalResponse = {
    journal: JournalEntry;
    analysis?: EmotionalAnalysis;
    alerts?: Alert[];
};

