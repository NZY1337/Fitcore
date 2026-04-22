import FitnessMetrics from "../../components/ecommerce/FitnessMetrics/FitnessMetrics";
import GoalSummaryBanner from "../../components/ecommerce/GoalSummaryBanner";

import PageMeta from "../../components/common/PageMeta";

import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";

export default function Home() {
    return (
        <>
            <PageMeta
                title="Fitness Metrics - Dashboard"
                description="View your fitness metrics and track your progress over time on the dashboard."
            />
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12">
                    <GoalSummaryBanner />
                </div>

                <div className="col-span-12 space-y-6 xl:col-span-7">
                    <FitnessMetrics />

                    {/* <MonthlySalesChart /> */}
                </div>

                <div className="col-span-12 xl:col-span-5">
                    <MonthlyTarget />
                </div>

                {/* <div className="col-span-12">
                    <StatisticsChart />
                </div> */}

                {/* <div className="col-span-12 xl:col-span-5">
                    <DemographicCard />
                </div> */}

                {/* <div className="col-span-12 xl:col-span-7">
                    <RecentOrders />
                </div> */}
            </div>
        </>
    );
}
