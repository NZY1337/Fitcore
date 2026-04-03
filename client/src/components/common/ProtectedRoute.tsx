import { Navigate, Outlet, useLocation } from 'react-router';
import { useAppContext } from '../../context/AppContext';

const ProtectedRoute = () => {
    const location = useLocation();
    const { session, sessionLoaded } = useAppContext();

    if (!sessionLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
                <div className="w-16 h-16 border-4 border-white/10 border-t-purple-500 rounded-full animate-spin" />
            </div>
        );
    }

    return session ? <Outlet /> : <Navigate to="/" replace state={{ from: location }} />;

};

export default ProtectedRoute;
