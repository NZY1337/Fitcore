import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Sparkles, ChevronDown, ChevronUp, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import PageMeta from '../../../components/common/PageMeta';
import { useAiWorkoutPlan } from '../../../hooks/useAiWorkoutPlan';
import { BACKEND_URL } from '../../../helpers/constants';
import type { DayOfWeek, PlanVariant } from '../../../services/ai-workout-plan';

const ALL_DAYS: { key: DayOfWeek; label: string }[] = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' },
];

const DURATIONS = [30, 45, 60, 75, 90];

const gifUrl = (id: string) => `${BACKEND_URL}/exercises/gif/${id}`;

const VARIANT_COLORS = [
    'border-brand-400 dark:border-brand-500',
    'border-purple-400 dark:border-purple-500',
    'border-emerald-400 dark:border-emerald-500',
];
const VARIANT_BADGE = [
    'bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300',
    'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300',
    'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
];
const VARIANT_BTN = [
    'bg-brand-500 hover:bg-brand-600 text-white',
    'bg-purple-500 hover:bg-purple-600 text-white',
    'bg-emerald-500 hover:bg-emerald-600 text-white',
];

function PlanCard({
    variant,
    index,
    selected,
    onSelect,
    isSelecting,
}: {
    variant: PlanVariant;
    index: number;
    selected: boolean;
    onSelect: () => void;
    isSelecting: boolean;
}) {
    const [openDays, setOpenDays] = useState<Record<string, boolean>>({});

    const toggleDay = (day: string) =>
        setOpenDays(prev => ({ ...prev, [day]: !prev[day] }));

    return (
        <div
            className={`rounded-2xl border-2 bg-white dark:bg-white/[0.03] transition-all duration-200 ${selected ? VARIANT_COLORS[index] : 'border-gray-200 dark:border-gray-800'}`}
        >
            {/* Header */}
            <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${VARIANT_BADGE[index]}`}>
                                Option {index + 1}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">{variant.split_type}</span>
                        </div>
                        <h3 className="text-base font-bold text-gray-800 dark:text-white/90">{variant.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{variant.description}</p>
                    </div>
                    <div className="shrink-0 text-center">
                        <span className="text-2xl font-black text-gray-800 dark:text-white/90">{variant.days_per_week}</span>
                        <p className="text-[10px] text-gray-400 uppercase font-semibold">days/wk</p>
                    </div>
                </div>
            </div>

            {/* Schedule */}
            <div className="p-4 space-y-2">
                {variant.schedule.map(day => (
                    <div key={day.day} className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <button
                            onClick={() => toggleDay(day.day)}
                            className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-white/[0.02] hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors text-left"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 w-8">{day.day.slice(0, 3)}</span>
                                <span className="text-sm text-gray-700 dark:text-gray-200">{day.focus}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs text-gray-400">{day.exercises.length} exercises</span>
                                {openDays[day.day] ? (
                                    <ChevronUp className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                )}
                            </div>
                        </button>

                        {openDays[day.day] && (
                            <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                {day.exercises.map(ex => (
                                    <div key={ex.exercise_id} className="flex items-center gap-3 px-4 py-2.5">
                                        <img
                                            src={gifUrl(ex.exercise_id)}
                                            alt={ex.name}
                                            className="w-9 h-9 rounded-lg object-cover bg-gray-100 dark:bg-gray-700 shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 dark:text-white/90 truncate capitalize">
                                                {ex.name}
                                            </p>
                                            <p className="text-xs text-gray-400">{ex.body_part} · {ex.equipment}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                                {ex.sets}×{ex.reps}
                                            </p>
                                            <p className="text-[10px] text-gray-400">{ex.rest_seconds}s rest</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Select button */}
            <div className="px-5 pb-5">
                <button
                    onClick={onSelect}
                    disabled={isSelecting}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 ${selected ? VARIANT_BTN[index] : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                    {isSelecting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : selected ? (
                        <CheckCircle className="w-4 h-4" />
                    ) : null}
                    {selected ? 'Selected' : 'Choose this plan'}
                </button>
            </div>
        </div>
    );
}

export default function AiPlanPage() {
    const navigate = useNavigate();
    const { currentPlan, isLoadingCurrent, generate, isGenerating, generateError, selectVariant, isSelecting } =
        useAiWorkoutPlan();

    const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
    const [duration, setDuration] = useState(60);
    const [showGenerator, setShowGenerator] = useState(false);
    const [chosenIndex, setChosenIndex] = useState<number | null>(null);
    const [activateSuccess, setActivateSuccess] = useState(false);

    // Sync chosenIndex from server data (handles page refresh)
    useEffect(() => {
        if (currentPlan?.selected_variant_index != null) {
            setChosenIndex(currentPlan.selected_variant_index);
        }
    }, [currentPlan?.selected_variant_index]);

    const toggleDay = (day: DayOfWeek) =>
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day],
        );

    const handleGenerate = async () => {
        if (selectedDays.length < 1) return;
        await generate({ days_available: selectedDays, session_duration: duration });
        setChosenIndex(null);
        setActivateSuccess(false);
        setShowGenerator(false);
    };

    const handleSelect = async (index: number) => {
        if (!currentPlan) return;
        setChosenIndex(index);
        await selectVariant({ plan_id: currentPlan.id, variant_index: index });
        setActivateSuccess(true);
    };

    const generatorVisible = showGenerator || (!currentPlan && !isLoadingCurrent);

    return (
        <>
            <PageMeta title="AI Workout Plan" description="Generate a personalized workout plan with AI" />
            <div className="space-y-6">

                {/* Generator card — hidden when plan already selected and user didn't click Regenerate */}
                {generatorVisible && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-brand-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 dark:text-white/90">AI Workout Generator</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Pick your available days and session length — AI does the rest.
                                </p>
                            </div>
                        </div>

                        {/* Days */}
                        <div className="mb-4">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Available days</p>
                            <div className="flex flex-wrap gap-2">
                                {ALL_DAYS.map(({ key, label }) => (
                                    <button
                                        key={key}
                                        onClick={() => toggleDay(key)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${selectedDays.includes(key)
                                            ? 'bg-brand-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="mb-5">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Session duration</p>
                            <div className="flex flex-wrap gap-2">
                                {DURATIONS.map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setDuration(d)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${duration === d
                                            ? 'bg-brand-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        {d} min
                                    </button>
                                ))}
                            </div>
                        </div>

                        {generateError && (
                            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 mb-4">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {generateError}
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || selectedDays.length === 0}
                                className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors"
                            >
                                {isGenerating ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
                                ) : (
                                    <><Sparkles className="w-4 h-4" /> {currentPlan ? 'Regenerate plans' : 'Generate 3 plans'}</>
                                )}
                            </button>
                            {currentPlan && (
                                <button onClick={() => setShowGenerator(false)}
                                    className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                    Cancel
                                </button>
                            )}
                        </div>

                        {isGenerating && (
                            <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
                                This takes 10–20 seconds. AI is building 3 personalised plans for you…
                            </p>
                        )}
                    </div>
                )}

                {/* Header with Regenerate button — shown when plan exists and generator is hidden */}
                {currentPlan && !generatorVisible && !isGenerating && (
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-gray-800 dark:text-white/90">Your workout plans</h3>
                        <button
                            onClick={() => setShowGenerator(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-xl transition-colors"
                        >
                            <Sparkles className="w-4 h-4" /> Regenerate
                        </button>
                    </div>
                )}

                {/* Success banner */}
                {activateSuccess && (
                    <div className="flex items-center gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800/50 px-5 py-4">
                        <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Plan activated!</p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                Your workout plan is ready. Head to My Plan to see your weekly schedule.
                            </p>
                        </div>
                        <button onClick={() => navigate('/dashboard/my-plan')}
                            className="text-xs font-bold text-emerald-700 dark:text-emerald-300 underline underline-offset-2 shrink-0">
                            View plan →
                        </button>
                    </div>
                )}

                {/* Loading */}
                {isLoadingCurrent && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading your previous plan…
                    </div>
                )}

                {/* Generating loader */}
                {isGenerating && (
                    <div className="flex flex-col items-center py-12 text-gray-400">
                        <Loader2 className="w-10 h-10 animate-spin mb-3 text-brand-500" />
                        <p className="text-sm font-medium">AI is building 3 personalised plans…</p>
                        <p className="text-xs mt-1">This takes 10–20 seconds</p>
                    </div>
                )}

                {/* 3 Variants grid */}
                {currentPlan && !isGenerating && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {currentPlan.variants.map((variant: PlanVariant, i: number) => (
                            <PlanCard
                                key={i}
                                variant={variant}
                                index={i}
                                selected={chosenIndex === i}
                                onSelect={() => handleSelect(i)}
                                isSelecting={isSelecting && chosenIndex === i}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
