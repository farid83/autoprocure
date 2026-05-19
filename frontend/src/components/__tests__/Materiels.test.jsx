import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Materiels from '../../pages/Materiels';
import * as AuthContext from '../../context/AuthContext';
import * as ApiHooks from '../../hooks/useApi';
import api from '../../services/api';

// Mocks
vi.mock('../../context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

vi.mock('../../hooks/useApi', () => ({
    useMateriels: vi.fn(),
}));

vi.mock('../../services/api', () => ({
    default: {
        delete: vi.fn(),
    }
}));

// Mock MaterielModal to avoid rendering complex component
vi.mock('../../components/MaterielModal', () => {
    return {
        default: ({ open, onClose, materiel }) => (
            open ? (
                <div data-testid="materiel-modal">
                    <span>Modal Open</span>
                    {materiel && <span>Editing: {materiel.nom}</span>}
                    <button onClick={onClose}>Close Modal</button>
                </div>
            ) : null
        )
    };
});

describe('Materiels Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        window.confirm = vi.fn(() => true); // Mock window.confirm to always return true
    });

    const mockAdminUser = { email: 'admin@example.com' };
    const mockEmployee = { email: 'employee@example.com' };

    const mockMaterielsList = [
        {
            id: 1,
            nom: 'Ordinateur Portable',
            description: 'Laptop HP',
            quantiteDisponible: 10,
            quantiteTotale: 10,
            seuilAlerte: 2,
            etat: 'neuf',
            categorie: { id: 1, nom: 'Informatique' }
        },
        {
            id: 2,
            nom: 'Imprimante',
            description: 'Epson',
            quantiteDisponible: 1,
            quantiteTotale: 5,
            seuilAlerte: 2,
            etat: 'usagé',
            categorie: { id: 2, nom: 'Bureautique' }
        }
    ];

    it('renders loading indicator', () => {
        AuthContext.useAuth.mockReturnValue({ user: mockAdminUser, hasAnyRole: () => true });
        ApiHooks.useMateriels.mockReturnValue({
            data: null,
            isLoading: true,
            error: null,
            refetch: vi.fn()
        });

        render(<Materiels />, { wrapper: BrowserRouter });
        expect(screen.getByText('Chargement du stock...')).toBeInTheDocument();
    });

    it('renders error message on fetch failure', () => {
        AuthContext.useAuth.mockReturnValue({ user: mockAdminUser, hasAnyRole: () => true });
        ApiHooks.useMateriels.mockReturnValue({
            data: null,
            isLoading: false,
            error: new Error('Failed to fetch'),
            refetch: vi.fn()
        });

        render(<Materiels />, { wrapper: BrowserRouter });
        expect(screen.getByText(/Impossible de charger les matériels/)).toBeInTheDocument();
    });

    it('renders materiels list correctly', () => {
        AuthContext.useAuth.mockReturnValue({ user: mockAdminUser, hasAnyRole: () => true });
        ApiHooks.useMateriels.mockReturnValue({
            data: mockMaterielsList,
            isLoading: false,
            error: null,
            refetch: vi.fn()
        });

        render(<Materiels />, { wrapper: BrowserRouter });
        
        expect(screen.getByText('Ordinateur Portable')).toBeInTheDocument();
        expect(screen.getByText('Laptop HP')).toBeInTheDocument();
        expect(screen.getByText('Imprimante')).toBeInTheDocument();
        
        // Stock critique for Imprimante (1 <= 2)
        expect(screen.getByText('Stock critique')).toBeInTheDocument();
    });

    it('filters materiels based on search term', () => {
        AuthContext.useAuth.mockReturnValue({ user: mockAdminUser, hasAnyRole: () => true });
        ApiHooks.useMateriels.mockReturnValue({
            data: mockMaterielsList,
            isLoading: false,
            error: null,
            refetch: vi.fn()
        });

        render(<Materiels />, { wrapper: BrowserRouter });
        
        const searchInput = screen.getByPlaceholderText(/Rechercher un matériel/i);
        fireEvent.change(searchInput, { target: { value: 'Imprimante' } });

        expect(screen.getByText('Imprimante')).toBeInTheDocument();
        expect(screen.queryByText('Ordinateur Portable')).not.toBeInTheDocument();
    });

    it('shows add button only to admins/comptables', () => {
        AuthContext.useAuth.mockReturnValue({ user: mockEmployee, hasAnyRole: () => false });
        ApiHooks.useMateriels.mockReturnValue({
            data: mockMaterielsList,
            isLoading: false,
            error: null,
            refetch: vi.fn()
        });

        const { container } = render(<Materiels />, { wrapper: BrowserRouter });
        
        // Find by fixed position class or visually hidden buttons
        // Usually, the plus button is the only large rounded full button
        const addButton = container.querySelector('.fixed.bottom-6.right-6');
        expect(addButton).not.toBeInTheDocument();
    });

    it('opens add modal when clicking on + button', () => {
        AuthContext.useAuth.mockReturnValue({ user: mockAdminUser, hasAnyRole: () => true });
        ApiHooks.useMateriels.mockReturnValue({
            data: mockMaterielsList,
            isLoading: false,
            error: null,
            refetch: vi.fn()
        });

        const { container } = render(<Materiels />, { wrapper: BrowserRouter });
        
        const addButton = container.querySelector('.fixed.bottom-6.right-6');
        fireEvent.click(addButton);

        expect(screen.getByTestId('materiel-modal')).toBeInTheDocument();
        expect(screen.getByText('Modal Open')).toBeInTheDocument();
        expect(screen.queryByText(/Editing:/)).not.toBeInTheDocument();
    });

    it('calls delete api and refetches data', async () => {
        AuthContext.useAuth.mockReturnValue({ 
            user: mockAdminUser, 
            hasAnyRole: (roles) => roles.includes('ROLE_ADMIN') // Admin has delete rights
        });
        const refetchMock = vi.fn();
        ApiHooks.useMateriels.mockReturnValue({
            data: mockMaterielsList,
            isLoading: false,
            error: null,
            refetch: refetchMock
        });
        
        api.delete.mockResolvedValueOnce({});

        const { container } = render(<Materiels />, { wrapper: BrowserRouter });
        
        // Find the trash icon button (only visible to admins)
        // the trash icon is inside the button. The button has classes: hover:bg-red-50
        const deleteButtons = container.querySelectorAll('.hover\\:bg-red-50');
        expect(deleteButtons.length).toBeGreaterThan(0);
        
        fireEvent.click(deleteButtons[0]);

        expect(window.confirm).toHaveBeenCalled();
        expect(api.delete).toHaveBeenCalledWith('/materiels/1');

        await waitFor(() => {
            expect(screen.getByText('Matériel supprimé avec succès')).toBeInTheDocument();
            expect(refetchMock).toHaveBeenCalled();
        });
    });
});
