import { useQuery } from '@tanstack/react-query';
import api, { getMateriels, getCategories, getDemandes } from '../services/api';

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
/**
 * Hook pour récupérer la liste des matériels.
 */
export const useMateriels = () => {
    return useQuery({
        queryKey: ['materiels'],
        queryFn: getMateriels,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}; 

/**
 * Hook pour récupérer la liste des catégories.
 */
export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

/**
 * Hook pour récupérer la liste des demandes.
 */
export const useDemandes = () => {
    return useQuery({
        queryKey: ['demandes'],
        queryFn: getDemandes,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};
