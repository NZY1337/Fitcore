import { useCurrentUser } from '../../../hooks/useCurrentUser';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

export default function Home() {
    const { isAdmin, isPending } = useCurrentUser();

    if (isPending) return null;

    return isAdmin ? <AdminDashboard /> : <UserDashboard />;
}
