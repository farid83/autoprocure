import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

/**
 * Hook pour récupérer les statistiques du tableau de bord.
 * Utilise React Query pour la gestion du cache et de l'état de chargement.
 */
export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboard_stats'],
        queryFn: async () => {
            const data = await api.get('/dashboard');
            return data;
        },
        // Rafraîchir les données toutes les 5 minutes
        staleTime: 5 * 60 * 1000,
    });
};
