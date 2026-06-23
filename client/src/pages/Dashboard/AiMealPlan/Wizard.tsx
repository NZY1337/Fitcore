import { useState } from 'react';
import { Sparkles, Loader2, X } from 'lucide-react';
import type { GenerateMealPlanDto } from '../../../services/ai-meal-plan';

export const COMMON_ALLERGIES = [
    'Lactoza', 'Gluten', 'Oua', 'Arahide', 'Nuci', 'Soia', 'Peste', 'Fructe de mare', 'Susan',
];

const DIET_TYPES = [
    { value: 'omnivore', label: 'Omnivor', desc: 'Mananci orice' },
    { value: 'vegetarian', label: 'Vegetarian', desc: 'Fara carne, cu oua si lactate' },
    { value: 'vegan', label: 'Vegan', desc: 'Doar produse vegetale' },
    { value: 'pescatarian', label: 'Pescatarian', desc: 'Vegetarian + peste' },
];

const MEALS_OPTIONS = [3, 4, 5, 6];

export type WizardProps = {
    onGenerate: (dto: GenerateMealPlanDto) => void;
    isGenerating: boolean;
};

export function Wizard({ onGenerate, isGenerating }: WizardProps) {
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

    console.log(allergies);

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
            <div className="flex items-center gap-2 mb-6" data-testid="wizard-progress-bar">
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
                                    aria-pressed={allergies.includes(a)} // for tests purposes
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
                                aria-label="avoid-input"
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
                                        <button aria-label={a} onClick={() => setAvoid(prev => prev.filter(x => x !== a))}>
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
                    <button data-testid="wizard-back-button" onClick={() => setStep(s => s - 1)} className="text-sm font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        ← Inapoi
                    </button>
                ) : <div />}

                {step < 3 ? (
                    <button data-testid="wizard-continue-button" onClick={() => setStep(s => s + 1)} className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-colors">
                        Continua →
                    </button>
                ) : (
                    <button data-testid="wizard-generate-button" onClick={handleGenerate} disabled={isGenerating}
                        className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors">
                        {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Se genereaza…</> : <><Sparkles className="w-4 h-4" /> Genereaza 3 planuri</>}
                    </button>
                )}
            </div>
        </div>
    );
}
