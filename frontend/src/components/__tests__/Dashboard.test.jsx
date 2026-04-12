import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard';
import * as AuthContext from '../../context/AuthContext';
import * as ApiHooks from '../../hooks/useApi';

// Mocks
vi.mock('../../context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

vi.mock('../../hooks/useApi', () => ({
    useDashboardStats: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(() => vi.fn()),
    };
});

describe('Dashboard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockAdminUser = { email: 'admin@example.com' };
    const mockComptableUser = { email: 'comptable@example.com' };
    const mockEmployee = { email: 'employee@example.com' };

    it('renders error message when stats loading fails', () => {
        // Arrange
        AuthContext.useAuth.mockReturnValue({
            user: mockAdminUser,
            hasAnyRole: () => true
        });
        ApiHooks.useDashboardStats.mockReturnValue({
            data: null,
            isLoading: false,
            error: 'Database connection failed'
        });

        // Act
        render(<Dashboard />, { wrapper: BrowserRouter });

        // Assert
        expect(screen.getByText(/Impossible de charger les statistiques/)).toBeInTheDocument();
        expect(screen.getByText(/Database connection failed/)).toBeInTheDocument();
    });

    it('renders loading indicators when data is loading', () => {
        // Arrange
        AuthContext.useAuth.mockReturnValue({
            user: mockAdminUser,
            hasAnyRole: () => true
        });
        ApiHooks.useDashboardStats.mockReturnValue({
            data: null,
            isLoading: true,
            error: null
        });

        // Act
        render(<Dashboard />, { wrapper: BrowserRouter });

        // Assert
        expect(screen.getByText(/\(chargement...\)/)).toBeInTheDocument();
    });

    it('renders ADMIN stats when user has ROLE_ADMIN', () => {
        // Arrange
        AuthContext.useAuth.mockReturnValue({
            user: mockAdminUser,
            hasAnyRole: (roles) => roles.includes('ROLE_ADMIN')
        });
        ApiHooks.useDashboardStats.mockReturnValue({
            data: {
                stats: {
                    total_utilisateurs: 10,
                    total_materiels: 50,
                    total_categories: 5,
                    total_demandes: 20
                },
                recent_demandes: []
            },
            isLoading: false,
            error: null
        });

        // Act
        render(<Dashboard />, { wrapper: BrowserRouter });

        // Assert
        expect(screen.getByText('Utilisateurs')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('Matériels')).toBeInTheDocument();
        expect(screen.getByText('50')).toBeInTheDocument();
        expect(screen.getByText('Catégories')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('Demandes')).toBeInTheDocument();
        expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('renders COMPTABLE_MATIERE stats when user has ROLE_COMPTABLE_MATIERE', () => {
        // Arrange
        AuthContext.useAuth.mockReturnValue({
            user: mockComptableUser,
            hasAnyRole: (roles) => roles.includes('ROLE_COMPTABLE_MATIERE')
        });
        ApiHooks.useDashboardStats.mockReturnValue({
            data: {
                stats: {
                    total_materiels: 45,
                    total_categories: 4,
                    total_demandes: 15
                },
                recent_demandes: []
            },
            isLoading: false,
            error: null
        });

        // Act
        render(<Dashboard />, { wrapper: BrowserRouter });

        // Assert
        expect(screen.queryByText('Utilisateurs')).not.toBeInTheDocument();
        expect(screen.getByText('Matériels')).toBeInTheDocument();
        expect(screen.getByText('45')).toBeInTheDocument();
        expect(screen.getByText('Catégories')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('Demandes')).toBeInTheDocument();
        expect(screen.getByText('15')).toBeInTheDocument();
    });

    it('renders EMPLOYEE stats when user has no special roles', () => {
        // Arrange
        AuthContext.useAuth.mockReturnValue({
            user: mockEmployee,
            hasAnyRole: () => false // No special roles
        });
        ApiHooks.useDashboardStats.mockReturnValue({
            data: {
                stats: {
                    total_demandes: 3
                },
                recent_demandes: []
            },
            isLoading: false,
            error: null
        });

        // Act
        render(<Dashboard />, { wrapper: BrowserRouter });

        // Assert
        expect(screen.queryByText('Utilisateurs')).not.toBeInTheDocument();
        expect(screen.queryByText('Matériels')).not.toBeInTheDocument();
        expect(screen.queryByText('Catégories')).not.toBeInTheDocument();
        expect(screen.getByText('Demandes')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('Mes demandes')).toBeInTheDocument();
    });

    it('displays recent demandes list', () => {
        // Arrange
        AuthContext.useAuth.mockReturnValue({
            user: mockEmployee,
            hasAnyRole: () => false
        });
        ApiHooks.useDashboardStats.mockReturnValue({
            data: {
                stats: {
                    total_demandes: 1
                },
                recent_demandes: [
                    { id: 101, dateCreation: '2023-10-25T10:00:00Z', statut: 'APPROUVEE' }
                ]
            },
            isLoading: false,
            error: null
        });

        // Act
        render(<Dashboard />, { wrapper: BrowserRouter });

        // Assert
        expect(screen.getByText('Activités récentes')).toBeInTheDocument();
        expect(screen.getByText('Demande #101')).toBeInTheDocument();
        expect(screen.getByText('APPROUVEE')).toBeInTheDocument();
    });
});
