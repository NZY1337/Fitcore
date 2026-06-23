import { useState, useEffect } from 'react';
import { Sparkles, Loader2, CheckCircle, AlertCircle, UtensilsCrossed } from 'lucide-react';
import PageMeta from '../../../components/common/PageMeta';
import { useAiMealPlan } from '../../../hooks/useAiMealPlan';
import type { MealPlanVariant, GenerateMealPlanDto } from '../../../services/ai-meal-plan';
import { Wizard } from './Wizard';
import { PlanCard } from './PlanCard';

export default function AiMealPlanPage() {
    const { currentPlan, isLoadingCurrent, generate, isGenerating, generateError, selectVariant, isSelecting } = useAiMealPlan();
    const [chosenIndex, setChosenIndex] = useState<number | null>(null);
    const [activateSuccess, setActivateSuccess] = useState(false);
    const [showWizard, setShowWizard] = useState(false);

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
                {true && (
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
                        <p className="text-xs mt-1">Dureaza 10-20 secunde</p>
                    </div>
                )}

                {/* Error */}
                {generateError && (
                    <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {generateError}
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
