import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Dashboard/Home";
import Homepage from "./components/Homepage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import UserProfile from "./pages/Dashboard/UserProfile/UserProfile";
import WorkoutLogs from './pages/Dashboard/WorkoutLogs/WorkoutLogs';
import Settings from './pages/Dashboard/Settings/Settings';
import WeightLogs from './pages/Dashboard/WeightLogs/WeightLogs';
import NutritionLogs from './pages/Dashboard/NutritionLogs/NutritionLogs';
import ExercisesPage from './pages/Dashboard/Exercises/ExercisesPage';
import PersonalRecordsPage from './pages/Dashboard/PersonalRecords/PersonalRecordsPage';
import AdminPage from './pages/Dashboard/Admin/AdminPage';
import AiUsagePage from './pages/Dashboard/Admin/AiUsagePage';
import MyPlanPage from './pages/Dashboard/MyPlan/MyPlanPage';
import AiPlanPage from './pages/Dashboard/AiPlan/AiPlanPage';
import AiMealPlanPage from './pages/Dashboard/AiMealPlan/AiMealPlanPage';

export default function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Homepage />} />

                    <Route element={<ProtectedRoute />}>
                        <Route element={<AppLayout />}>
                            <Route path="/dashboard" element={<Home />} />
                            <Route path="/dashboard/user-profile" element={<UserProfile />} />
                            <Route path="/dashboard/workout-logs" element={<WorkoutLogs />} />
                            <Route path="/dashboard/settings" element={<Settings />} />
                            <Route path="/dashboard/weight-logs" element={<WeightLogs />} />
                            <Route path="/dashboard/nutrition" element={<NutritionLogs />} />
                            <Route path="/dashboard/exercises" element={<ExercisesPage />} />
                            <Route path="/dashboard/personal-records" element={<PersonalRecordsPage />} />
                            <Route path="/dashboard/my-plan" element={<MyPlanPage />} />
                            <Route path="/dashboard/ai-plan" element={<AiPlanPage />} />
                            <Route path="/dashboard/ai-meal-plan" element={<AiMealPlanPage />} />
                            <Route path="/dashboard/admin" element={<AdminPage />} />
                            <Route path="/dashboard/admin/ai-usage" element={<AiUsagePage />} />
                        </Route>
                    </Route>

                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </>
    );
}
