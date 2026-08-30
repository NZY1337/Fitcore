import { useState, useRef, useEffect } from 'react';
import { Search, X, Dumbbell } from 'lucide-react';
import { useExercises } from '../../hooks/useExercises';
import useDebounce from '../../hooks/useDebounce';
import { BACKEND_URL } from '../../helpers/constants';

import type { Exercise } from '../../services/exercises';

interface Props {
    value: string;
    onChange: (value: string) => void;
    onSelect?: (exercise: Exercise) => void;
    placeholder?: string;
    id?: string;
}

const gifUrl = (id: string) => `${BACKEND_URL}/exercises/gif/${id}`;

export default function ExercisePicker({ value, onChange, onSelect, placeholder = 'Search or type exercise…', id }: Props) {
    const [query, setQuery] = useState(value);
    const [open, setOpen] = useState(false);
    const debouncedQuery = useDebounce(query, 350);
    const containerRef = useRef<HTMLDivElement>(null);

    const { exercises, isPending } = useExercises(
        debouncedQuery.trim().length >= 2 ? { q: debouncedQuery } : {}
    );

    // Sync external value → input (e.g. when form resets)
    useEffect(() => { setQuery(value); }, [value]);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSelect = (ex: Exercise) => {
        const name = ex.name.charAt(0).toUpperCase() + ex.name.slice(1);
        setQuery(name);
        onChange(name);
        onSelect?.(ex);
        setOpen(false);
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        onChange(e.target.value);
        setOpen(true);
    };

    const showDropdown = open && debouncedQuery.trim().length >= 2;

    return (
        <div ref={containerRef} className="relative">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                    id={id}
                    type="text"
                    value={query}
                    onChange={handleInput}
                    onFocus={() => debouncedQuery.trim().length >= 2 && setOpen(true)}
                    placeholder={placeholder}
                    autoComplete="off"
                    className="h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent pl-9 pr-9 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:ring-brand-500/20 focus:border-brand-300 dark:focus:border-brand-800 shadow-theme-xs"
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => { setQuery(''); onChange(''); setOpen(false); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {showDropdown && (
                <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg overflow-hidden">
                    {isPending ? (
                        <div className="p-3 text-sm text-gray-400 text-center">Searching…</div>
                    ) : exercises.length === 0 ? (
                        <div className="p-3 text-sm text-gray-400 text-center">No exercises found</div>
                    ) : (
                        <ul className="max-h-64 overflow-y-auto">
                            {exercises.map((ex) => (
                                <li key={ex.id}>
                                    <button
                                        type="button"
                                        onMouseDown={(e) => { e.preventDefault(); handleSelect(ex); }}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <img
                                            src={gifUrl(ex.id)}
                                            alt={ex.name}
                                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-gray-700 shrink-0"
                                        />
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                                {ex.name.charAt(0).toUpperCase() + ex.name.slice(1).toLowerCase()}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {ex.bodyPart} · {ex.equipment}
                                            </p>
                                        </div>
                                        {ex.difficulty && (
                                            <span className="ml-auto shrink-0 text-xs text-gray-400 dark:text-gray-500">
                                                {ex.difficulty}
                                            </span>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="px-3 py-1.5 border-t border-gray-100 dark:border-gray-800 flex items-center gap-1.5">
                        <Dumbbell className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">Or type any exercise name directly</span>
                    </div>
                </div>
            )}
        </div>
    );
}
