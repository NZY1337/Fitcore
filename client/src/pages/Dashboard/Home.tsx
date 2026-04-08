import FitnessMetrics from "../../components/ecommerce/FitnessMetrics/FitnessMetrics";

import PageMeta from "../../components/common/PageMeta";

import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";

import { useFitnessMetrics } from "../../hooks/useFitnessMetrics";

export default function Home() {
    const { fitnessMetrics, isPending, error } = useFitnessMetrics();

    console.log(fitnessMetrics, isPending, error);

    return (
        <>
            <PageMeta
                title="Fitness Metrics - Dashboard"
                description="View your fitness metrics and track your progress over time on the dashboard."
            />
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-6 xl:col-span-7">
                    <FitnessMetrics />

                    <MonthlySalesChart />
                </div>

                <div className="col-span-12 xl:col-span-5">
                    <MonthlyTarget />
                </div>

                <div className="col-span-12">
                    <StatisticsChart />
                </div>

                <div className="col-span-12 xl:col-span-5">
                    <DemographicCard />
                </div>

                <div className="col-span-12 xl:col-span-7">
                    <RecentOrders />
                </div>
            </div>
        </>
    );
}
