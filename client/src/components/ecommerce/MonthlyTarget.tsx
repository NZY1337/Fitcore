import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { Link } from "react-router";

// hooks
import { useFitnessMetrics } from "../../hooks/useFitnessMetrics";
import { useUserProfile } from "../../hooks/useUserProfile";

export default function MonthlyTarget() {
    const { fitnessMetrics, isPending: isPendingMetrics, error: errorMetrics } = useFitnessMetrics();
    const { userProfile, isPending: isPendingProfile, error: errorProfile } = useUserProfile();

    const userTarget = userProfile?.activity_goal ?? "maintain";

    const hasToEatPerDay = fitnessMetrics?.tdee ?? 0;
    const hasToEatBasedOnTarget = fitnessMetrics?.caloriesTarget ?? 0;

    const percentage = (hasToEatBasedOnTarget / hasToEatPerDay) * 100;
    const series = [percentage];

    function calculateUserMetrics() {
        let message = '';
        switch (userTarget) {
            case 'cut': // Slăbire
                message = `Your target goal is set to lose weight. We recommend a caloric deficit of ${hasToEatPerDay - hasToEatBasedOnTarget}
                from your TDEE for sustainable weight loss.`;
                break;
            case 'bulk': // Masă musculară
                message = `Your target goal is set to gain muscle mass. We recommend a caloric surplus of ${hasToEatBasedOnTarget - hasToEatPerDay}
                above your TDEE for effective muscle growth.`;
                break;
            case 'maintain': // Menținere
                message = 'Your target goal is set to maintain your current weight. We recommend consuming calories equal to your TDEE for weight maintenance.';
                break;
            default:
                message = 'Your target goal is not set. Please update your activity goal in your profile to see personalized recommendations.';
                break;
        }

        return message
    }

    function getTargetConfig() {
        switch (userTarget) {
            case "cut":
                return {
                    text: "-500 calories today",
                    className: "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500",
                };

            case "bulk":
                return {
                    text: "+500 calories today",
                    className: "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500",
                };

            case "maintain":
            default:
                return {
                    text: "you're doing fine",
                    className: "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500",
                };
        }
    };

    const { text, className } = getTargetConfig();

    const options: ApexOptions = {
        colors: ["#465FFF"],
        chart: {
            fontFamily: "Outfit, sans-serif",
            type: "radialBar",
            height: 330,
            sparkline: {
                enabled: true,
            },
        },
        plotOptions: {
            radialBar: {
                startAngle: -85,
                endAngle: 85,
                hollow: {
                    size: "80%",
                },
                track: {
                    background: "#E4E7EC",
                    strokeWidth: "100%",
                    margin: 5, // margin is in pixels
                },
                dataLabels: {
                    name: {
                        show: false,
                    },
                    value: {
                        fontSize: "18px",
                        fontWeight: "600",
                        offsetY: -40,
                        color: "#1D2939",
                        formatter: function (_val) {
                            return `${hasToEatPerDay} / ${hasToEatBasedOnTarget} kcal`;
                        },
                    },
                },
            },
        },
        fill: {
            type: "solid",
            colors: ["#465FFF"],
        },
        stroke: {
            lineCap: "round",
        },
        labels: ["Progress"],
    };

    const [isOpen, setIsOpen] = useState(false);

    function toggleDropdown() {
        setIsOpen(!isOpen);
    }

    function closeDropdown() {
        setIsOpen(false);
    }

    if (isPendingMetrics || isPendingProfile) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading your target goal...</p>
            </div>
        );
    }

    if (errorMetrics || errorProfile || !userProfile || !fitnessMetrics) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <p className="text-sm font-semibold text-gray-800 dark:text-white/90 mb-1">No fitness data available</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Please{' '}
                    <Link to="/dashboard/user-profile" className="text-brand-500 underline">
                        complete your profile
                    </Link>{' '}
                    to see your target goal.
                </p>
            </div>
        );
    }


    return (
        <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
                <div className="flex justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            Your Target Goal
                        </h3>
                        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                            target you've set in order to loose weight and be healthier
                        </p>
                    </div>
                    <div className="relative inline-block">
                        <button className="dropdown-toggle" onClick={toggleDropdown}>
                            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
                        </button>
                        <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
                            <DropdownItem onItemClick={closeDropdown}
                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                            >
                                View More
                            </DropdownItem>
                            <DropdownItem onItemClick={closeDropdown}
                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                            >
                                Delete
                            </DropdownItem>
                        </Dropdown>
                    </div>
                </div>
                <div className="relative ">
                    <div className="max-h-[330px]" id="chartDarkStyle">
                        <Chart
                            key={`${hasToEatPerDay}-${hasToEatBasedOnTarget}`} // forțează re-render când valorile se schimbă
                            options={options}
                            series={series}
                            type="radialBar"
                            height={330}
                        />
                    </div>

                    <span className={`absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full px-3 py-1 text-xs font-medium ${className}`} >
                        {text}
                    </span>
                </div>
                <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
                    {calculateUserMetrics()}
                </p>
            </div>

            <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
                <div>
                    <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
                        TDEE
                    </p>
                    <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
                        {hasToEatPerDay} kcal
                    </p>
                </div>

                <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

                <div>
                    <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
                        Daily Target
                    </p>
                    <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
                        {hasToEatBasedOnTarget} kcal
                    </p>
                </div>

                <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

                <div>
                    <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
                        Goal
                    </p>
                    <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg capitalize">
                        {userTarget}
                    </p>
                </div>
            </div>
        </div>
    );
}
