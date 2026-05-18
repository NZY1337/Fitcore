import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Loader2, CheckCircle, AlertCircle, UtensilsCrossed, X } from 'lucide-react';
import PageMeta from '../../../components/common/PageMeta';
import { useAiMealPlan } from '../../../hooks/useAiMealPlan';
import type { MealPlanVariant, MealType, GenerateMealPlanDto } from '../../../services/ai-meal-plan';

// ── Wizard constants ──────────────────────────────────────────────────────────

const COMMON_ALLERGIES = [
    'Lactoza', 'Gluten', 'Oua', 'Arahide', 'Nuci', 'Soia', 'Peste', 'Fructe de mare', 'Susan',
];

const DIET_TYPES = [
    { value: 'omnivore', label: 'Omnivor', desc: 'Mananci orice' },
    { value: 'vegetarian', label: 'Vegetarian', desc: 'Fara carne, cu oua si lactate' },
    { value: 'vegan', label: 'Vegan', desc: 'Doar produse vegetale' },
    { value: 'pescatarian', label: 'Pescatarian', desc: 'Vegetarian + peste' },
];

const MEALS_OPTIONS = [3, 4, 5, 6];

const VARIANT_BORDER = [
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

const MEAL_LABELS: Record<MealType, string> = {
    breakfast: 'Mic dejun',
    lunch: 'Pranz',
    dinner: 'Cina',
    snack: 'Gustare',
};

// ── Wizard ────────────────────────────────────────────────────────────────────

function Wizard({ onGenerate, isGenerating }: { onGenerate: (dto: GenerateMealPlanDto) => void; isGenerating: boolean }) {
    const [step, setStep] = useState(1);
    const [allergies, setAllergies] = useState<string[]>([]);
    const [avoid, setAvoid] = useState<string[]>([]);
    const [avoidInput, setAvoidInput] = useState('');
    const [dietType, setDietType] = useState('omnivore');
    const [mealsPerDay, setMealsPerDay] = useState(4);

    const toggleAllergy = (a: string) =>
        setAllergies(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

    const addAvoid = () => {
        const val = avoidInput.trim();
        if (val && !avoid.includes(val)) setAvoid(prev => [...prev, val]);
        setAvoidInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') { e.preventDefault(); addAvoid(); }
    };

    const handleGenerate = () => {
        onGenerate({ allergies, avoid, diet_type: dietType, meals_per_day: mealsPerDay });
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white/90">Generator Plan Alimentar AI</h2>
                    <p className="text-sm text-gray-400">Macronutrientii sunt calculati automat din profilul tau.</p>
                </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2 mb-6">
                {[1, 2, 3].map(s => (
                    <div key={s} className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${s < step ? 'bg-brand-500 text-white' : s === step ? 'bg-brand-100 dark:bg-brand-500/20 text-brand-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                            {s < step ? '✓' : s}
                        </div>
                        {s < 3 && <div className="w-8 h-px bg-gray-200 dark:bg-gray-700" />}
                    </div>
                ))}
            </div>

            {/* Step 1 — Alergii */}
            {step === 1 && (
                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">La ce esti alergic?</p>
                        <p className="text-xs text-gray-400 mb-3">Selecteaza tot ce se aplica. Poti sari daca nu ai alergii.</p>
                        <div className="flex flex-wrap gap-2">
                            {COMMON_ALLERGIES.map(a => (
                                <button key={a} onClick={() => toggleAllergy(a)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${allergies.includes(a) ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                                    {a}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Ce alimente vrei sa eviti?</p>
                        <p className="text-xs text-gray-400 mb-2">Scrie un aliment si apasa Enter.</p>
                        <div className="flex gap-2">
                            <input
                                value={avoidInput}
                                onChange={e => setAvoidInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="e.g. broccoli, ficat..."
                                className="flex-1 h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 text-sm text-gray-800 dark:text-white/90 outline-none focus:border-brand-400"
                            />
                            <button onClick={addAvoid} className="px-3 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-lg transition-colors">
                                Adauga
                            </button>
                        </div>
                        {avoid.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {avoid.map(a => (
                                    <span key={a} className="flex items-center gap-1 px-2 py-1 bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 text-xs rounded-full">
                                        {a}
                                        <button onClick={() => setAvoid(prev => prev.filter(x => x !== a))}>
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Step 2 — Tip dieta */}
            {step === 2 && (
                <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Ce tip de dieta urmezi?</p>
                    {DIET_TYPES.map(d => (
                        <button key={d.value} onClick={() => setDietType(d.value)}
                            className={`w-full text-left rounded-xl border-2 px-4 py-3 transition-all ${dietType === d.value ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                            <p className={`text-sm font-semibold ${dietType === d.value ? 'text-brand-700 dark:text-brand-300' : 'text-gray-800 dark:text-white/90'}`}>{d.label}</p>
                            <p className={`text-xs ${dietType === d.value ? 'text-brand-500' : 'text-gray-400'}`}>{d.desc}</p>
                        </button>
                    ))}
                </div>
            )}

            {/* Step 3 — Mese pe zi */}
            {step === 3 && (
                <div className="space-y-4">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Cate mese pe zi preferi?</p>
                    <div className="grid grid-cols-4 gap-3">
                        {MEALS_OPTIONS.map(n => (
                            <button key={n} onClick={() => setMealsPerDay(n)}
                                className={`py-4 rounded-xl border-2 text-lg font-black transition-all ${mealsPerDay === n ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-gray-300'}`}>
                                {n}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400">Caloriile zilnice vor fi distribuite in {mealsPerDay} mese.</p>
                </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
                {step > 1 ? (
                    <button onClick={() => setStep(s => s - 1)} className="text-sm font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        ← Inapoi
                    </button>
                ) : <div />}

                {step < 3 ? (
                    <button onClick={() => setStep(s => s + 1)} className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-colors">
                        Continua →
                    </button>
                ) : (
                    <button onClick={handleGenerate} disabled={isGenerating}
                        className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors">
                        {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Se genereaza…</> : <><Sparkles className="w-4 h-4" /> Genereaza 3 planuri</>}
                    </button>
                )}
            </div>
        </div>
    );
}

// ── Meal Plan Card ────────────────────────────────────────────────────────────

function MacroBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
    const pct = Math.min((value / total) * 100, 100);
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500 dark:text-gray-400">{label}</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">{value}g <span className="font-normal text-gray-400">/ {total}g</span></span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

function MealCard({ meal }: { meal: { meal_type: MealType; name: string; instructions?: string; foods: { name: string; amount: string; calories: number; protein: number; carbs: number; fat: number }[]; totals: { calories: number; protein: number; carbs: number; fat: number } } }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <button onClick={() => setOpen(v => !v)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/[0.02] hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors text-left">
                <div>
                    <span className="text-xs font-bold uppercase text-gray-400 mr-2">{MEAL_LABELS[meal.meal_type]}</span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-white/90">{meal.name}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-medium text-brand-600 dark:text-brand-400">{meal.totals.calories} kcal</span>
                    {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
            </button>
            {open && (
                <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                    {meal.instructions && (
                        <div className="px-4 py-3 bg-amber-50 dark:bg-amber-500/5">
                            <p className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400 mb-1">Mod de preparare</p>
                            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{meal.instructions}</p>
                        </div>
                    )}
                    {meal.foods.map((food, i) => (
                        <div key={i} className="flex items-center justify-between px-4 py-2.5">
                            <div>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{food.name}</p>
                                <p className="text-xs text-gray-400">{food.amount}</p>
                            </div>
                            <div className="text-right text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                                <p className="font-semibold text-gray-700 dark:text-gray-200">{food.calories} kcal</p>
                                <p>P:{food.protein}g C:{food.carbs}g F:{food.fat}g</p>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-end gap-4 px-4 py-2 bg-gray-50 dark:bg-white/[0.02] text-xs font-semibold text-gray-600 dark:text-gray-300">
                        <span>P: {meal.totals.protein}g</span>
                        <span>C: {meal.totals.carbs}g</span>
                        <span>F: {meal.totals.fat}g</span>
                    </div>
                </div>
            )}
        </div>
    );
}

function PlanCard({ variant, index, selected, onSelect, isSelecting }: {
    variant: MealPlanVariant; index: number; selected: boolean; onSelect: () => void; isSelecting: boolean;
}) {
    const t = variant.daily_targets;
    return (
        <div className={`rounded-2xl border-2 bg-white dark:bg-white/[0.03] transition-all ${selected ? VARIANT_BORDER[index] : 'border-gray-200 dark:border-gray-800'}`}>
            <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${VARIANT_BADGE[index]}`}>Varianta {index + 1}</span>
                        <h3 className="text-base font-bold text-gray-800 dark:text-white/90 mt-1">{variant.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{variant.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="text-2xl font-black text-gray-800 dark:text-white/90">{t.calories}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-semibold">kcal/zi</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <MacroBar label="Proteine" value={t.protein} total={t.protein} color="bg-blue-400" />
                    <MacroBar label="Carbohidrati" value={t.carbs} total={t.carbs} color="bg-yellow-400" />
                    <MacroBar label="Grasimi" value={t.fat} total={t.fat} color="bg-red-400" />
                </div>
            </div>

            <div className="p-4 space-y-2">
                {variant.meals.map((meal, i) => <MealCard key={i} meal={meal} />)}
            </div>

            <div className="px-5 pb-5">
                <button onClick={onSelect} disabled={isSelecting}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 ${selected ? VARIANT_BTN[index] : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                    {isSelecting ? <Loader2 className="w-4 h-4 animate-spin" /> : selected ? <CheckCircle className="w-4 h-4" /> : null}
                    {selected ? 'Selectat' : 'Alege acest plan'}
                </button>
            </div>
        </div>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AiMealPlanPage() {
    const { currentPlan, isLoadingCurrent, generate, isGenerating, generateError, selectVariant, isSelecting } = useAiMealPlan();
    const [chosenIndex, setChosenIndex] = useState<number | null>(null);
    const [activateSuccess, setActivateSuccess] = useState(false);
    const [showWizard, setShowWizard] = useState(false);

    // Sync from server after load
    useEffect(() => {
        if (currentPlan?.selected_variant_index != null) {
            setChosenIndex(currentPlan.selected_variant_index);
        }
        if (!currentPlan && !isLoadingCurrent) {
            setShowWizard(true);
        }
    }, [currentPlan?.selected_variant_index, isLoadingCurrent]);

    const handleGenerate = async (dto: GenerateMealPlanDto) => {
        await generate(dto);
        setChosenIndex(null);
        setActivateSuccess(false);
        setShowWizard(false);
    };

    const handleSelect = async (index: number) => {
        if (!currentPlan) return;
        setChosenIndex(index);
        await selectVariant({ plan_id: currentPlan.id, variant_index: index });
        setActivateSuccess(true);
    };

    return (
        <>
            <PageMeta title="AI Meal Plan" description="Plan alimentar personalizat generat cu AI" />
            <div className="space-y-6">

                {/* Wizard */}
                {showWizard && (
                    <Wizard onGenerate={handleGenerate} isGenerating={isGenerating} />
                )}

                {/* Buton regenerare */}
                {!showWizard && !isGenerating && (
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-gray-800 dark:text-white/90">
                            {currentPlan ? 'Alege planul tau alimentar' : ''}
                        </h3>
                        <button onClick={() => setShowWizard(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-xl transition-colors">
                            <Sparkles className="w-4 h-4" /> Regenereaza
                        </button>
                    </div>
                )}

                {/* Generating loader */}
                {isGenerating && (
                    <div className="flex flex-col items-center py-16 text-gray-400">
                        <Loader2 className="w-10 h-10 animate-spin mb-3 text-brand-500" />
                        <p className="text-sm font-medium">AI genereaza 3 planuri alimentare personalizate…</p>
                        <p className="text-xs mt-1">Dureaza 10–20 secunde</p>
                    </div>
                )}

                {/* Error */}
                {generateError && (
                    <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                        <AlertCircle className="w-4 h-4 shrink-0" /> {generateError}
                    </div>
                )}

                {/* Success banner */}
                {activateSuccess && (
                    <div className="flex items-center gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800/50 px-5 py-4">
                        <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Plan alimentar activat!</p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400">Poti loga mancare in Nutrition pentru a urmari progresul fata de targeturi.</p>
                        </div>
                    </div>
                )}

                {/* Loading */}
                {isLoadingCurrent && !currentPlan && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Loader2 className="w-4 h-4 animate-spin" /> Se incarca planul anterior…
                    </div>
                )}

                {/* Empty state */}
                {!isLoadingCurrent && !currentPlan && !isGenerating && !showWizard && (
                    <div className="flex flex-col items-center py-16 text-gray-400 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                        <UtensilsCrossed className="w-10 h-10 mb-3 opacity-30" />
                        <p className="text-sm font-medium">Configureaza preferintele si genereaza primul tau plan alimentar.</p>
                    </div>
                )}

                {/* 3 Variants grid */}
                {currentPlan && !isGenerating && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {currentPlan.variants.map((variant: MealPlanVariant, i: number) => (
                            <PlanCard key={i} variant={variant} index={i} selected={chosenIndex === i}
                                onSelect={() => handleSelect(i)} isSelecting={isSelecting && chosenIndex === i} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
