import { Loader2, CheckCircle } from 'lucide-react';
import type { MealPlanVariant } from '../../../services/ai-meal-plan';
import { MacroBar } from './MacroBar';
import { MealCard } from './MealCard';

export const VARIANT_BORDER = [
    'border-brand-400 dark:border-brand-500',
    'border-purple-400 dark:border-purple-500',
    'border-emerald-400 dark:border-emerald-500',
];

export const VARIANT_BADGE = [
    'bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300',
    'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300',
    'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
];

export const VARIANT_BTN = [
    'bg-brand-500 hover:bg-brand-600 text-white',
    'bg-purple-500 hover:bg-purple-600 text-white',
    'bg-emerald-500 hover:bg-emerald-600 text-white',
];

export type PlanCardProps = {
    variant: MealPlanVariant;
    index: number;
    selected: boolean;
    isSelecting: boolean;
    onSelect: () => void;
};

export function PlanCard({ variant, index, selected, isSelecting, onSelect }: PlanCardProps) {
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
