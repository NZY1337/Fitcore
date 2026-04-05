import { useEffect, useMemo, useState } from 'react';
import PageMeta from '../../components/common/PageMeta';
import Form from '../../components/form/Form';
import Input from '../../components/form/input/InputField';
import Label from '../../components/form/Label';
import Select from '../../components/form/Select';
import Alert from '../../components/ui/alert/Alert';
import Button from '../../components/ui/button/Button';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useAutoDismiss } from '../../hooks/useAutoDismiss';
import type { CreateUserProfileDto } from '../../services/user-profile';

type FormState = {
    gender: '' | 'male' | 'female';
    weight_kg: string;
    height_cm: string;
    waist_cm: string;
    neck_cm: string;
    hip_cm: string;
    date_of_birth: string;
    activity_level: '' | 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
    activity_goal: '' | 'cut' | 'maintain' | 'bulk';
    training_goal: '' | 'strength' | 'hypertrophy' | 'endurance';
};

type FormErrors = Partial<Record<keyof FormState, string>>;

// const initialFormState: FormState = {
//     gender: 'male',
//     weight_kg: '100',
//     height_cm: '170',
//     waist_cm: '100',
//     neck_cm: '70',
//     hip_cm: '100',
//     date_of_birth: '1990-01-06',
//     activity_level: 'sedentary',
//     activity_goal: 'maintain',
//     training_goal: 'strength',
// };

const initialFormState: FormState = {
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

const asNumber = (value: string) => Number.parseFloat(value);
const MIN_BIRTH_DATE = '1900-01-01';

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return 'Unexpected error';
};

export default function UserProfile() {
    const {
        userProfile,
        isPending,
        error,
        isCreating,
        isUpdating,
        isDeleting,
        createUserProfile,
        updateUserProfile,
        deleteUserProfile,
    } = useUserProfile();

    const [form, setForm] = useState<FormState>(initialFormState);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitMessage, setSubmitMessage] = useAutoDismiss();
    const [submitError, setSubmitError] = useAutoDismiss();
    const [isHydrated, setIsHydrated] = useState(false);
    const todayIso = new Date().toISOString().slice(0, 10);

    const hasExistingProfile = useMemo(() => Boolean(userProfile), [userProfile]);

    useEffect(() => {
        if (!userProfile || isHydrated) return;

        setForm({
            gender: userProfile.gender,
            weight_kg: String(userProfile.weight_kg ?? ''),
            height_cm: String(userProfile.height_cm ?? ''),
            waist_cm: String(userProfile.waist_cm ?? ''),
            neck_cm: String(userProfile.neck_cm ?? ''),
            hip_cm: String(userProfile.hip_cm ?? ''),
            date_of_birth: String(userProfile.date_of_birth ?? '').slice(0, 10),
            activity_level: userProfile.activity_level,
            activity_goal: userProfile.activity_goal,
            training_goal: userProfile.training_goal,
        });

        setIsHydrated(true);
    }, [userProfile, isHydrated]);

    console.log('userProfile', userProfile);
    const validate = (values: FormState): FormErrors => {
        const nextErrors: FormErrors = {};

        if (!values.gender) nextErrors.gender = 'Gender is required';

        const weight = asNumber(values.weight_kg);
        if (!values.weight_kg || Number.isNaN(weight)) nextErrors.weight_kg = 'Weight is required';
        else if (weight <= 0 || weight > 500) nextErrors.weight_kg = 'Weight must be between 0.1 and 500 kg';

        const height = asNumber(values.height_cm);
        if (!values.height_cm || Number.isNaN(height)) nextErrors.height_cm = 'Height is required';
        else if (height <= 0 || height > 300) nextErrors.height_cm = 'Height must be between 0.1 and 300 cm';

        const waist = asNumber(values.waist_cm);
        if (!values.waist_cm || Number.isNaN(waist)) nextErrors.waist_cm = 'Waist is required';
        else if (waist <= 0 || waist > 300) nextErrors.waist_cm = 'Waist must be between 0.1 and 300 cm';

        const neck = asNumber(values.neck_cm);
        if (!values.neck_cm || Number.isNaN(neck)) nextErrors.neck_cm = 'Neck is required';
        else if (neck <= 0 || neck > 300) nextErrors.neck_cm = 'Neck must be between 0.1 and 300 cm';

        if (!nextErrors.waist_cm && !nextErrors.neck_cm && waist <= neck) {
            nextErrors.waist_cm = 'Waist must be greater than neck measurement.';
        }

        const hip = asNumber(values.hip_cm);
        if (!values.hip_cm || Number.isNaN(hip)) nextErrors.hip_cm = 'Hip is required';
        else if (hip <= 0 || hip > 300) nextErrors.hip_cm = 'Hip must be between 0.1 and 300 cm';

        if (!values.date_of_birth) {
            nextErrors.date_of_birth = 'Date of birth is required';
        } else {
            const dobFormat = /^\d{4}-\d{2}-\d{2}$/;

            if (!dobFormat.test(values.date_of_birth)) {
                nextErrors.date_of_birth = 'Use format YYYY-MM-DD';
            } else {
                const [yearStr, monthStr, dayStr] = values.date_of_birth.split('-');
                const year = Number.parseInt(yearStr, 10);
                const month = Number.parseInt(monthStr, 10);
                const day = Number.parseInt(dayStr, 10);
                const currentYear = new Date().getFullYear();

                if (year < 1900 || year > currentYear) {
                    nextErrors.date_of_birth = `Year must be between 1900 and ${currentYear}`;
                } else {
                    const selectedDate = new Date(Date.UTC(year, month - 1, day));
                    const isInvalidCalendarDate =
                        selectedDate.getUTCFullYear() !== year ||
                        selectedDate.getUTCMonth() !== month - 1 ||
                        selectedDate.getUTCDate() !== day;

                    if (isInvalidCalendarDate) {
                        nextErrors.date_of_birth = 'Date of birth is invalid';
                    } else if (values.date_of_birth >= todayIso) {
                        nextErrors.date_of_birth = 'Date of birth must be in the past';
                    }
                }
            }
        }

        if (!values.activity_level) nextErrors.activity_level = 'Activity level is required';
        if (!values.activity_goal) nextErrors.activity_goal = 'Activity goal is required';
        if (!values.training_goal) nextErrors.training_goal = 'Training goal is required';

        return nextErrors;
    };

    const onChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors((prev) => ({ ...prev, [key]: undefined }));
        }
        if (submitError) setSubmitError('');
        if (submitMessage) setSubmitMessage('');
    };

    const handleSubmit = () => {
        const nextErrors = validate(form);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) return;

        const payload: CreateUserProfileDto = {
            gender: form.gender as CreateUserProfileDto['gender'],
            weight_kg: asNumber(form.weight_kg),
            height_cm: asNumber(form.height_cm),
            waist_cm: asNumber(form.waist_cm),
            neck_cm: asNumber(form.neck_cm),
            hip_cm: asNumber(form.hip_cm),
            date_of_birth: form.date_of_birth,
            activity_level: form.activity_level as CreateUserProfileDto['activity_level'],
            activity_goal: form.activity_goal as CreateUserProfileDto['activity_goal'],
            training_goal: form.training_goal as CreateUserProfileDto['training_goal'],
        };

        if (hasExistingProfile) {
            updateUserProfile(payload, {
                onSuccess: () => setSubmitMessage('Profile updated successfully.'),
                onError: (mutationError: unknown) => setSubmitError(getErrorMessage(mutationError)),
            });
            return;
        }

        createUserProfile(payload, {
            onSuccess: () => setSubmitMessage('Profile created successfully.'),
            onError: (mutationError: unknown) => setSubmitError(getErrorMessage(mutationError)),
        });
    };

    const handleDeleteProfile = () => {
        if (hasExistingProfile) {
            deleteUserProfile(undefined, {
                onSuccess: () => {
                    setSubmitMessage('Profile deleted successfully.');
                    setForm(initialFormState);
                    setIsHydrated(false);
                },
                onError: (err: unknown) => setSubmitError(getErrorMessage(err)),
            });
        }
    };

    const isSubmitting = isCreating || isUpdating;

    return (
        <>
            <PageMeta
                title="User Profile"
                description="Create or update your user profile"
            />
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 xl:col-span-8">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Profile Details</h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Fill in your body metrics and goals. This data is used by fitness metrics calculations.
                            </p>
                        </div>

                        {isPending && (
                            <div className="mb-4">
                                <Alert
                                    variant="info"
                                    title="Loading profile"
                                    message="We are fetching your existing profile data."
                                />
                            </div>
                        )}

                        {error && !hasExistingProfile && (
                            <div className="mb-4">
                                <Alert
                                    variant="warning"
                                    title="No existing profile"
                                    message="You can create your profile now."
                                />
                            </div>
                        )}

                        {submitMessage && (
                            <div className="mb-4">
                                <Alert variant="success" title="Success" message={submitMessage} />
                            </div>
                        )}

                        {submitError && (
                            <div className="mb-4">
                                <Alert variant="error" title="Submission failed" message={submitError} />
                            </div>
                        )}

                        <Form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select
                                        key={`gender-${form.gender}`}
                                        options={[
                                            { value: 'male', label: 'Male' },
                                            { value: 'female', label: 'Female' },
                                        ]}
                                        placeholder="Select gender"
                                        defaultValue={form.gender}
                                        onChange={(value) => onChange('gender', value as FormState['gender'])}
                                    />
                                    {errors.gender && <p className="mt-1.5 text-xs text-error-500">{errors.gender}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                                    <Input
                                        id="date_of_birth"
                                        type="date"
                                        min={MIN_BIRTH_DATE}
                                        max={todayIso}
                                        value={form.date_of_birth}
                                        onChange={(e) => onChange('date_of_birth', e.target.value)}
                                        error={Boolean(errors.date_of_birth)}
                                        hint={errors.date_of_birth}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                                <div>
                                    <Label htmlFor="weight_kg">Weight (kg)</Label>
                                    <Input
                                        id="weight_kg"
                                        type="number"
                                        step={0.1}
                                        min="1"
                                        value={form.weight_kg}
                                        onChange={(e) => onChange('weight_kg', e.target.value)}
                                        error={Boolean(errors.weight_kg)}
                                        hint={errors.weight_kg}
                                        placeholder="e.g. 82"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="height_cm">Height (cm)</Label>
                                    <Input
                                        id="height_cm"
                                        type="number"
                                        min='1'
                                        step={0.1}
                                        value={form.height_cm}
                                        onChange={(e) => onChange('height_cm', e.target.value)}
                                        error={Boolean(errors.height_cm)}
                                        hint={errors.height_cm}
                                        placeholder="e.g. 180"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="waist_cm">Waist (cm)</Label>
                                    <Input
                                        id="waist_cm"
                                        type="number"
                                        step={0.1}
                                        value={form.waist_cm}
                                        onChange={(e) => onChange('waist_cm', e.target.value)}
                                        error={Boolean(errors.waist_cm)}
                                        hint={errors.waist_cm}
                                        placeholder="e.g. 86"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="neck_cm">Neck (cm)</Label>
                                    <Input
                                        id="neck_cm"
                                        type="number"
                                        step={0.1}
                                        value={form.neck_cm}
                                        onChange={(e) => onChange('neck_cm', e.target.value)}
                                        error={Boolean(errors.neck_cm)}
                                        hint={errors.neck_cm}
                                        placeholder="e.g. 39"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="hip_cm">Hip (cm)</Label>
                                    <Input
                                        id="hip_cm"
                                        type="number"
                                        step={0.1}
                                        value={form.hip_cm}
                                        onChange={(e) => onChange('hip_cm', e.target.value)}
                                        error={Boolean(errors.hip_cm)}
                                        hint={errors.hip_cm}
                                        placeholder="e.g. 95"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                                <div>
                                    <Label htmlFor="activity_level">Activity Level</Label>
                                    <Select
                                        key={`activity_level-${form.activity_level}`}
                                        options={[
                                            { value: 'sedentary', label: 'Sedentary' },
                                            { value: 'lightly_active', label: 'Lightly active' },
                                            { value: 'moderately_active', label: 'Moderately active' },
                                            { value: 'very_active', label: 'Very active' },
                                            { value: 'extra_active', label: 'Extra active' },
                                        ]}
                                        placeholder="Select activity level"
                                        defaultValue={form.activity_level}
                                        onChange={(value) => onChange('activity_level', value as FormState['activity_level'])}
                                    />
                                    {errors.activity_level && <p className="mt-1.5 text-xs text-error-500">{errors.activity_level}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="activity_goal">Activity Goal</Label>
                                    <Select
                                        key={`activity_goal-${form.activity_goal}`}
                                        options={[
                                            { value: 'cut', label: 'Cut' },
                                            { value: 'maintain', label: 'Maintain' },
                                            { value: 'bulk', label: 'Bulk' },
                                        ]}
                                        placeholder="Select activity goal"
                                        defaultValue={form.activity_goal}
                                        onChange={(value) => onChange('activity_goal', value as FormState['activity_goal'])}
                                    />
                                    {errors.activity_goal && <p className="mt-1.5 text-xs text-error-500">{errors.activity_goal}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="training_goal">Training Goal</Label>
                                    <Select
                                        key={`training_goal-${form.training_goal}`}
                                        options={[
                                            { value: 'strength', label: 'Strength' },
                                            { value: 'hypertrophy', label: 'Hypertrophy' },
                                            { value: 'endurance', label: 'Endurance' },
                                        ]}
                                        placeholder="Select training goal"
                                        defaultValue={form.training_goal}
                                        onChange={(value) => onChange('training_goal', value as FormState['training_goal'])}
                                    />
                                    {errors.training_goal && <p className="mt-1.5 text-xs text-error-500">{errors.training_goal}</p>}
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : hasExistingProfile ? 'Update Profile' : 'Create Profile'}
                                </Button>

                                {hasExistingProfile && (
                                    <Button disabled={isDeleting} variant="outline" className="ml-3" onClick={handleDeleteProfile}>
                                        {isDeleting && 'Deleting...'}
                                        {hasExistingProfile && !isDeleting && 'Delete Profile'}
                                    </Button>
                                )}
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}
