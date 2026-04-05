// src/hooks/useAutoDismiss.ts
import { useEffect, useState } from 'react';

export function useAutoDismiss(duration = 5000) {
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => setMessage(''), duration);
        return () => clearTimeout(timer);
    }, [message, duration]);

    return [message, setMessage] as const;
}