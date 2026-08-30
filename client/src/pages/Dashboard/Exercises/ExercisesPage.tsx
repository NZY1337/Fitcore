import { useState, useRef, useEffect } from 'react';
import { Navigate } from 'react-router';
import { Search, X, ChevronLeft, ChevronRight, Dumbbell, Target, Zap, BookOpen } from 'lucide-react';
import PageMeta from '../../../components/common/PageMeta';
import { useExercises, useSimilarExercises } from '../../../hooks/useExercises';
import useDebounce from '../../../hooks/useDebounce';
import type { Exercise } from '../../../services/exercises';
import { BACKEND_URL } from '../../../helpers/constants';
import { useCurrentUser } from '../../../hooks/useCurrentUser';

const gifUrl = (id: string) => `${BACKEND_URL}/exercises/gif/${id}`;

const BODY_PARTS = ['all', 'back', 'cardio', 'chest', 'lower arms', 'lower legs', 'neck', 'shoulders', 'upper arms', 'upper legs', 'waist'];
const EQUIPMENT = ['all', 'barbell', 'cable', 'dumbbell', 'ez barbell', 'kettlebell', 'body weight', 'resistance band', 'machine', 'band', 'medicine ball'];

const DIFFICULTY_COLOR: Record<string, string> = {
    beginner: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
    intermediate: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
    expert: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400',
};

function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function ExerciseCardSkeleton() {
    return (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden animate-pulse">
            <div className="w-full h-48 bg-gray-200 dark:bg-gray-700" />
            <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="flex gap-2">
                    <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
        </div>
    );
}

function ExerciseCard({ exercise, onClick }: { exercise: Exercise; onClick: () => void }) {
    const [gifLoaded, setGifLoaded] = useState(false);
    const difficultyClass = DIFFICULTY_COLOR[exercise.difficulty?.toLowerCase() ?? ''] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';

    return (
        <button
            onClick={onClick}
            className="group text-left rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden hover:border-brand-400 dark:hover:border-brand-600 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
        >
            <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                {!gifLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Dumbbell className="w-10 h-10 text-gray-300 dark:text-gray-600 animate-pulse" />
                    </div>
                )}
                <img
                    src={gifUrl(exercise.id)}
                    alt={exercise.name}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${gifLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setGifLoaded(true)}
                    loading="lazy"
                />
                {exercise.difficulty && (
                    <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold ${difficultyClass}`}>
                        {capitalize(exercise.difficulty)}
                    </span>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug mb-2 group-hover:text-brand-500 transition-colors line-clamp-2">
                    {capitalize(exercise.name)}
                </h3>
                <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 text-xs font-medium">
                        <Target className="w-3 h-3" />
                        {capitalize(exercise.bodyPart)}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium">
                        {capitalize(exercise.target)}
                    </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
                    <Dumbbell className="w-3 h-3" />
                    {capitalize(exercise.equipment)}
                </p>
            </div>
        </button>
    );
}

function ExerciseModal({ exercise: initial, onClose }: { exercise: Exercise; onClose: () => void }) {
    const [exercise, setExercise] = useState<Exercise>(initial);
    const modalRef = useRef<HTMLDivElement>(null);
    const { similar } = useSimilarExercises(exercise.id);
    const difficultyClass = DIFFICULTY_COLOR[exercise.difficulty?.toLowerCase() ?? ''] ?? 'bg-gray-100 text-gray-600';

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);

    const handleSelectSimilar = (ex: Exercise) => {
        setExercise(ex);
        modalRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div ref={modalRef} className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-gray-900 shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>

                <div className="flex flex-col sm:flex-row gap-0">
                    <div className="sm:w-64 shrink-0 bg-gray-100 dark:bg-gray-800 rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none overflow-hidden">
                        <img
                            key={exercise.id}
                            src={gifUrl(exercise.id)}
                            alt={exercise.name}
                            className="w-full h-64 sm:h-full object-cover"
                        />
                    </div>

                    <div className="flex-1 p-6">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            {exercise.difficulty && (
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${difficultyClass}`}>
                                    {capitalize(exercise.difficulty)}
                                </span>
                            )}
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            {capitalize(exercise.name)}
                        </h2>

                        <div className="grid grid-cols-2 gap-3 mb-5">
                            <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/30">
                                <p className="text-xs text-brand-500 font-medium mb-0.5 flex items-center gap-1"><Target className="w-3 h-3" /> Body Part</p>
                                <p className="text-sm font-semibold text-gray-800 dark:text-white">{capitalize(exercise.bodyPart)}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                                <p className="text-xs text-gray-500 font-medium mb-0.5 flex items-center gap-1"><Zap className="w-3 h-3" /> Target</p>
                                <p className="text-sm font-semibold text-gray-800 dark:text-white">{capitalize(exercise.target)}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 col-span-2">
                                <p className="text-xs text-gray-500 font-medium mb-0.5 flex items-center gap-1"><Dumbbell className="w-3 h-3" /> Equipment</p>
                                <p className="text-sm font-semibold text-gray-800 dark:text-white">{capitalize(exercise.equipment)}</p>
                            </div>
                        </div>

                        {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
                            <div className="mb-5">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Secondary Muscles</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {exercise.secondaryMuscles.map((m) => (
                                        <span key={m} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                                            {capitalize(m)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {exercise.instructions && exercise.instructions.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <BookOpen className="w-3 h-3" /> Instructions
                                </p>
                                <ol className="space-y-2">
                                    {exercise.instructions.map((step, i) => (
                                        <li key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                                            <span className="shrink-0 w-5 h-5 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center font-bold mt-0.5">
                                                {i + 1}
                                            </span>
                                            {step}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}
                    </div>
                </div>

                {similar.length > 0 && (
                    <div className="border-t border-gray-100 dark:border-gray-800 p-6">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Similar Exercises</p>
                        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                            {similar.slice(0, 6).map((ex) => (
                                <button
                                    key={ex.id}
                                    onClick={() => handleSelectSimilar(ex)}
                                    className={`shrink-0 w-28 text-center rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/40 ${
                                        ex.id === exercise.id
                                            ? 'ring-2 ring-brand-500'
                                            : 'hover:opacity-80'
                                    }`}
                                >
                                    <img src={gifUrl(ex.id)} alt={ex.name} className="w-28 h-28 object-cover rounded-xl bg-gray-100 dark:bg-gray-800" />
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 px-1">{capitalize(ex.name)}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ExercisesPage() {
    const { isAdmin, isPending: userPending } = useCurrentUser();
    const [searchInput, setSearchInput] = useState('');
    const [activeBodyPart, setActiveBodyPart] = useState('all');
    const [activeEquipment, setActiveEquipment] = useState('all');
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(searchInput, 400);
    const bodyPartRef = useRef<HTMLDivElement>(null);

    const filters = {
        ...(debouncedSearch ? { q: debouncedSearch } : {}),
        ...(activeBodyPart !== 'all' && !debouncedSearch ? { bodyPart: activeBodyPart } : {}),
        ...(activeEquipment !== 'all' && !debouncedSearch && activeBodyPart === 'all' ? { equipment: activeEquipment } : {}),
        page,
    };

    const { exercises, total, isPending } = useExercises(filters);

    const totalPages = Math.ceil(total / 10);

    useEffect(() => { setPage(1); }, [debouncedSearch, activeBodyPart, activeEquipment]);

    const scrollBodyParts = (dir: 'left' | 'right') => {
        if (bodyPartRef.current) {
            bodyPartRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
        }
    };

    const clearFilters = () => {
        setSearchInput('');
        setActiveBodyPart('all');
        setActiveEquipment('all');
    };

    const hasActiveFilter = searchInput || activeBodyPart !== 'all' || activeEquipment !== 'all';

    if (!userPending && !isAdmin) return <Navigate to="/dashboard" replace />;

    return (
        <>
            <PageMeta title="Exercise Library - Dashboard" description="Browse 1,300+ exercises with GIFs, muscle targeting, and instructions." />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exercise Library</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Browse 1,300+ exercises with animations and instructions</p>
                </div>

                {/* Search bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search exercises… e.g. bench press, squat, deadlift"
                        className="w-full h-12 pl-12 pr-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition"
                    />
                    {searchInput && (
                        <button
                            onClick={() => setSearchInput('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Body part filter */}
                <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Body Part</p>
                    <div className="relative flex items-center gap-1">
                        <button
                            onClick={() => scrollBodyParts('left')}
                            className="shrink-0 p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>
                        <div ref={bodyPartRef} className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
                            {BODY_PARTS.map((bp) => (
                                <button
                                    key={bp}
                                    onClick={() => setActiveBodyPart(bp)}
                                    className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                        activeBodyPart === bp
                                            ? 'bg-brand-500 text-white shadow-sm'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {capitalize(bp)}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => scrollBodyParts('right')}
                            className="shrink-0 p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                </div>

                {/* Equipment + results meta row */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider shrink-0">Equipment</label>
                        <select
                            value={activeEquipment}
                            onChange={(e) => setActiveEquipment(e.target.value)}
                            className="h-9 pl-3 pr-8 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition appearance-none cursor-pointer"
                        >
                            {EQUIPMENT.map((eq) => (
                                <option key={eq} value={eq}>{capitalize(eq)}</option>
                            ))}
                        </select>
                        {hasActiveFilter && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <X className="w-3 h-3" /> Clear filters
                            </button>
                        )}
                    </div>
                    {!isPending && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold text-gray-800 dark:text-white">{total.toLocaleString()}</span> exercises found
                        </p>
                    )}
                </div>

                {/* Grid */}
                {isPending ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {Array.from({ length: 15 }).map((_, i) => <ExerciseCardSkeleton key={i} />)}
                    </div>
                ) : exercises.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Dumbbell className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">No exercises found</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try a different search or filter</p>
                        <button onClick={clearFilters} className="mt-4 px-4 py-2 bg-brand-500 text-white text-sm rounded-lg hover:bg-brand-600 transition-colors">
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {exercises.map((ex) => (
                            <ExerciseCard key={ex.id} exercise={ex} onClick={() => setSelectedExercise(ex)} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1.5 pt-2 flex-wrap">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>

                        {(() => {
                            const pages: (number | 'ellipsis')[] = [];
                            if (totalPages <= 7) {
                                for (let i = 1; i <= totalPages; i++) pages.push(i);
                            } else {
                                pages.push(1);
                                if (page > 3) pages.push('ellipsis');
                                for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
                                if (page < totalPages - 2) pages.push('ellipsis');
                                pages.push(totalPages);
                            }
                            return pages.map((p, i) =>
                                p === 'ellipsis' ? (
                                    <span key={`e${i}`} className="w-9 text-center text-gray-400 text-sm">…</span>
                                ) : (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                                            page === p
                                                ? 'bg-brand-500 text-white'
                                                : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                )
                            );
                        })()}

                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>

                        <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                            Page {page} of {totalPages}
                        </span>
                    </div>
                )}
            </div>

            {selectedExercise && (
                <ExerciseModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
            )}
        </>
    );
}
