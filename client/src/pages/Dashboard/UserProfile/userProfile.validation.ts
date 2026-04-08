export type UserProfileFormState = {
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

export type UserProfileFormErrors = Partial<Record<keyof UserProfileFormState, string>>;

const asNumber = (value: string) => Number.parseFloat(value);

export function validateUserProfile(
    values: UserProfileFormState,
    todayIso: string,
): UserProfileFormErrors {
    const nextErrors: UserProfileFormErrors = {};

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
                    nextErrors.date_of_birth = 'Year must be between 1900 and 2026';
                }
            }
        }
    }

    if (!values.activity_level) nextErrors.activity_level = 'Activity level is required';
    if (!values.activity_goal) nextErrors.activity_goal = 'Activity goal is required';
    if (!values.training_goal) nextErrors.training_goal = 'Training goal is required';

    return nextErrors;
}
