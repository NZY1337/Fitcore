import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { MealType } from '../../../services/ai-meal-plan';

const MEAL_LABELS: Record<MealType, string> = {
    breakfast: 'Mic dejun',
    lunch: 'Pranz',
    dinner: 'Cina',
    snack: 'Gustare',
};

type Food = {
    name: string;
    amount: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
};

export type Meal = {
    meal_type: MealType;
    name: string;
    instructions?: string;
    foods: Food[];
    totals: { calories: number; protein: number; carbs: number; fat: number };
};

export function MealCard({ meal }: { meal: Meal }) {
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
