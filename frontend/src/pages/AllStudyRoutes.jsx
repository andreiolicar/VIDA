import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '@/services/axios';
import Sidebar from '@/components/dashboard/Sidebar';
import StudyRouteCard from '@/components/StudyRouteCard';

export default function AllStudyRoutes() {
    const userId = localStorage.getItem('user');
    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        axios.get(`/study-routes/${userId}`).then((r) => setRoutes(r.data));
    }, [userId]);

    return (
        <div className="flex min-h-screen bg-gray-900">
            <Sidebar />
            <main className="flex-1 px-8 py-8">
                <header className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white">Todas as Trilhas</h1>
                    <Link
                        to="/dashboard/study"
                        className="text-sm font-medium text-blue-400 hover:text-blue-300"
                    >
                        ← voltar
                    </Link>
                </header>

                {routes.length === 0 ? (
                    <p className="text-gray-400">Nenhuma trilha encontrada.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {routes.map((r) => (
                            <StudyRouteCard key={r.id} route={r} onDelete={() => { }} onToggleFavorite={() => { }} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}