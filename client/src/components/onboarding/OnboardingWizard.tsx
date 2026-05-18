import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, ChevronLeft, Loader2, Dumbbell, Target, User } from 'lucide-react';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import Select from '../form/Select';
import { useUserProfile } from '../../hooks/useUserProfile';
import { validateUserProfile } from '../../pages/Dashboard/UserProfile/userProfile.validation';
import type {
    UserProfileFormState as FormState,
    UserProfileFormErrors as FormErrors,
} from '../../pages/Dashboard/UserProfile/userProfile.validation';
import type { CreateUserProfileDto } from '../../services/user-profile';

const STEP_FIELDS: Record<number, (keyof FormState)[]> = {
    1: ['gender', 'date_of_birth'],
    2: ['weight_kg', 'height_cm', 'waist_cm', 'neck_cm', 'hip_cm'],
    3: ['activity_level', 'activity_goal', 'training_goal'],
};

const INITIAL: FormState = {
    gender: '',
    weight_kg: '',
    height_cm: '',
    waist_cm: '',
    neck_cm: '',
    hip_cm: '',
    date_of_birth: '',
    activity_level: '',
    activity_goal: '',
    training_goal: '',
};

const GOAL_OPTIONS = {
    activity_level: [
        { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
        { value: 'lightly_active', label: 'Lightly active', desc: '1–3 days/week' },
        { value: 'moderately_active', label: 'Moderately active', desc: '3–5 days/week' },
        { value: 'very_active', label: 'Very active', desc: '6–7 days/week' },
        { value: 'extra_active', label: 'Extra active', desc: 'Physical job or 2x/day' },
    ],
    activity_goal: [
        { value: 'cut', label: 'Cut', desc: 'Lose fat, calorie deficit' },
        { value: 'maintain', label: 'Maintain', desc: 'Stay at current weight' },
        { value: 'bulk', label: 'Bulk', desc: 'Build muscle, calorie surplus' },
    ],
    training_goal: [
        { value: 'strength', label: 'Strength', desc: 'Heavy weights, low reps' },
        { value: 'hypertrophy', label: 'Hypertrophy', desc: 'Muscle size, moderate reps' },
        { value: 'endurance', label: 'Endurance', desc: 'Light weights, high reps' },
    ],
};

function OptionCard({
    value,
    label,
    desc,
    selected,
    onClick,
}: {
    value: string;
    label: string;
    desc: string;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full text-left rounded-xl border-2 px-4 py-3 transition-all ${selected
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
        >
            <p className={`text-sm font-semibold ${selected ? 'text-brand-700 dark:text-brand-300' : 'text-gray-800 dark:text-white/90'}`}>
                {label}
            </p>
            <p className={`text-xs mt-0.5 ${selected ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400 dark:text-gray-500'}`}>
                {desc}
            </p>
        </button>
    );
}

const STEPS = [
    { label: 'About you', icon: User },
    { label: 'Body metrics', icon: Dumbbell },
    { label: 'Your goals', icon: Target },
];

export default function OnboardingWizard() {
    const navigate = useNavigate();
    const { createUserProfile, isCreating } = useUserProfile();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState<FormState>(INITIAL);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitError, setSubmitError] = useState('');
    const todayIso = new Date().toISOString().slice(0, 10);

    const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm(prev => ({ ...prev, [key]: value }));
        setErrors(prev => ({ ...prev, [key]: undefined }));
    };

    const validateStep = (s: number): boolean => {
        const allErrors = validateUserProfile(form, todayIso);
        const stepErrors: FormErrors = {};
        for (const field of STEP_FIELDS[s]) {
            if (allErrors[field]) stepErrors[field] = allErrors[field];
        }
        setErrors(stepErrors);
        return Object.keys(stepErrors).length === 0;
    };

    const next = () => {
        if (!validateStep(step)) return;
        setStep(s => s + 1);
    };

    const back = () => setStep(s => s - 1);

    const handleSubmit = () => {
        if (!validateStep(3)) return;
        const payload: CreateUserProfileDto = {
            gender: form.gender as CreateUserProfileDto['gender'],
            weight_kg: parseFloat(form.weight_kg),
            height_cm: parseFloat(form.height_cm),
            waist_cm: parseFloat(form.waist_cm),
            neck_cm: parseFloat(form.neck_cm),
            hip_cm: parseFloat(form.hip_cm),
            date_of_birth: form.date_of_birth,
            activity_level: form.activity_level as CreateUserProfileDto['activity_level'],
            activity_goal: form.activity_goal as CreateUserProfileDto['activity_goal'],
            training_goal: form.training_goal as CreateUserProfileDto['training_goal'],
        };
        createUserProfile(payload, {
            onSuccess: () => navigate('/dashboard/ai-plan'),
            onError: (e: unknown) => setSubmitError(e instanceof Error ? e.message : 'Something went wrong.'),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">

                {/* Top progress bar */}
                <div className="h-1 bg-gray-100 dark:bg-gray-800">
                    <div
                        className="h-full bg-brand-500 transition-all duration-500"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                {/* Step indicators */}
                <div className="flex items-center justify-between px-6 pt-5 pb-2">
                    {STEPS.map((s, i) => {
                        const num = i + 1;
                        const Icon = s.icon;
                        const active = num === step;
                        const done = num < step;
                        return (
                            <div key={num} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${done ? 'bg-brand-500 text-white' : active ? 'bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                    {done ? '✓' : <Icon className="w-4 h-4" />}
                                </div>
                                <span className={`text-xs font-semibold hidden sm:inline ${active ? 'text-gray-800 dark:text-white/90' : 'text-gray-400'}`}>
                                    {s.label}
                                </span>
                                {i < 2 && <div className="w-8 h-px bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block" />}
                            </div>
                        );
                    })}
                </div>

                <div className="px-6 pb-6 pt-4">

                    {/* Step 1 — About you */}
                    {step === 1 && (
                        <div className="space-y-5">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">Welcome! Tell us about yourself</h2>
                                <p className="text-sm text-gray-400 mt-1">This helps us personalise your AI workout plan.</p>
                            </div>

                            <div>
                                <Label htmlFor="gender">Gender</Label>
                                <div className="grid grid-cols-2 gap-3 mt-1">
                                    {(['male', 'female'] as const).map(g => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => set('gender', g)}
                                            className={`py-3 rounded-xl border-2 text-sm font-semibold capitalize transition-all ${form.gender === g
                                                ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300'
                                                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300'
                                                }`}
                                        >
                                            {g === 'male' ? '♂ Male' : '♀ Female'}
                                        </button>
                                    ))}
                                </div>
                                {errors.gender && <p className="mt-1.5 text-xs text-red-500">{errors.gender}</p>}
                            </div>

                            <div>
                                <Label htmlFor="date_of_birth">Date of birth</Label>
                                <Input
                                    id="date_of_birth"
                                    type="date"
                                    min="1900-01-01"
                                    max={todayIso}
                                    value={form.date_of_birth}
                                    onChange={e => set('date_of_birth', e.target.value)}
                                    error={Boolean(errors.date_of_birth)}
                                    hint={errors.date_of_birth}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2 — Body metrics */}
                    {step === 2 && (
                        <div className="space-y-5">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">Body measurements</h2>
                                <p className="text-sm text-gray-400 mt-1">Used to calculate BMI, body fat, and calorie targets.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {([
                                    { id: 'weight_kg', label: 'Weight (kg)', placeholder: 'e.g. 82' },
                                    { id: 'height_cm', label: 'Height (cm)', placeholder: 'e.g. 180' },
                                    { id: 'waist_cm', label: 'Waist (cm)', placeholder: 'e.g. 86' },
                                    { id: 'neck_cm', label: 'Neck (cm)', placeholder: 'e.g. 39' },
                                    { id: 'hip_cm', label: 'Hip (cm)', placeholder: 'e.g. 95' },
                                ] as const).map(({ id, label, placeholder }) => (
                                    <div key={id} className={id === 'hip_cm' ? 'col-span-2 sm:col-span-1' : ''}>
                                        <Label htmlFor={id}>{label}</Label>
                                        <Input
                                            id={id}
                                            type="number"
                                            step={0.1}
                                            min="1"
                                            placeholder={placeholder}
                                            value={form[id]}
                                            onChange={e => set(id, e.target.value)}
                                            error={Boolean(errors[id])}
                                            hint={errors[id]}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3 — Goals */}
                    {step === 3 && (
                        <div className="space-y-5">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">Your fitness goals</h2>
                                <p className="text-sm text-gray-400 mt-1">AI will use these to build the perfect plan for you.</p>
                            </div>

                            <div>
                                <Label>Activity level</Label>
                                <div className="mt-1 space-y-2">
                                    {GOAL_OPTIONS.activity_level.map(o => (
                                        <OptionCard
                                            key={o.value}
                                            {...o}
                                            selected={form.activity_level === o.value}
                                            onClick={() => set('activity_level', o.value as FormState['activity_level'])}
                                        />
                                    ))}
                                </div>
                                {errors.activity_level && <p className="mt-1.5 text-xs text-red-500">{errors.activity_level}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <Label>Diet goal</Label>
                                    <div className="mt-1 space-y-2">
                                        {GOAL_OPTIONS.activity_goal.map(o => (
                                            <OptionCard
                                                key={o.value}
                                                {...o}
                                                selected={form.activity_goal === o.value}
                                                onClick={() => set('activity_goal', o.value as FormState['activity_goal'])}
                                            />
                                        ))}
                                    </div>
                                    {errors.activity_goal && <p className="mt-1.5 text-xs text-red-500">{errors.activity_goal}</p>}
                                </div>
                                <div>
                                    <Label>Training goal</Label>
                                    <div className="mt-1 space-y-2">
                                        {GOAL_OPTIONS.training_goal.map(o => (
                                            <OptionCard
                                                key={o.value}
                                                {...o}
                                                selected={form.training_goal === o.value}
                                                onClick={() => set('training_goal', o.value as FormState['training_goal'])}
                                            />
                                        ))}
                                    </div>
                                    {errors.training_goal && <p className="mt-1.5 text-xs text-red-500">{errors.training_goal}</p>}
                                </div>
                            </div>

                            {submitError && (
                                <p className="text-xs text-red-500">{submitError}</p>
                            )}
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-6">
                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={back}
                                className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" /> Back
                            </button>
                        ) : (
                            <div />
                        )}

                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={next}
                                className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-colors"
                            >
                                Continue <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isCreating}
                                className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
                            >
                                {isCreating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving…
                                    </>
                                ) : (
                                    <>
                                        Generate my plan <ChevronRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
