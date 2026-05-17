import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MaterielModal from '../MaterielModal';
import * as ApiHooks from '../../hooks/useApi';
import api from '../../services/api';

vi.mock('../../hooks/useApi', () => ({
    useCategories: vi.fn(),
}));

vi.mock('../../services/api', () => ({
    default: {
        post: vi.fn(),
        put: vi.fn(),
    }
}));

// Mock ResizeObserver for Dialog component from Radix UI
global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};

describe('MaterielModal Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockCategories = [
        { id: 1, nom: 'Informatique' },
        { id: 2, nom: 'Bureautique' }
    ];

    it('renders modal with empty fields for creation', () => {
        ApiHooks.useCategories.mockReturnValue({
            data: mockCategories,
            isLoading: false,
        });

        render(<MaterielModal open={true} onClose={vi.fn()} onSuccess={vi.fn()} />);

        expect(screen.getByText('Ajouter un matériel')).toBeInTheDocument();
        expect(screen.getByLabelText(/Nom du matériel/)).toHaveValue('');
        expect(screen.getByLabelText(/Description/)).toHaveValue('');
        expect(screen.getByLabelText(/Quantité Totale/)).toHaveValue(0);
    });

    it('renders modal with pre-filled fields for editing', () => {
        ApiHooks.useCategories.mockReturnValue({
            data: mockCategories,
            isLoading: false,
        });

        const mockMateriel = {
            id: 1,
            nom: 'Laptop HP',
            description: 'Core i7',
            categorie: { id: 1, nom: 'Informatique' },
            quantiteTotale: 10,
            etat: 'neuf',
            seuilAlerte: 2
        };

        render(<MaterielModal open={true} onClose={vi.fn()} onSuccess={vi.fn()} materiel={mockMateriel} />);

        expect(screen.getByText('Modifier le matériel')).toBeInTheDocument();
        expect(screen.getByLabelText(/Nom du matériel/)).toHaveValue('Laptop HP');
        expect(screen.getByLabelText(/Description/)).toHaveValue('Core i7');
        expect(screen.getByLabelText(/Quantité Totale/)).toHaveValue(10);
        // category id
        expect(screen.getByLabelText(/Catégorie/)).toHaveValue('1');
    });

    it('validates required fields on submit', async () => {
        ApiHooks.useCategories.mockReturnValue({
            data: mockCategories,
            isLoading: false,
        });

        render(<MaterielModal open={true} onClose={vi.fn()} onSuccess={vi.fn()} />);

        const submitButton = screen.getByText('Ajouter le matériel');
        fireEvent.click(submitButton);

        // Name and category are required
        expect(await screen.findByText('Le nom est requis')).toBeInTheDocument();
        expect(await screen.findByText('La catégorie est requise')).toBeInTheDocument();
        expect(api.post).not.toHaveBeenCalled();
    });

    it('submits form successfully for new materiel', async () => {
        ApiHooks.useCategories.mockReturnValue({
            data: mockCategories,
            isLoading: false,
        });

        api.post.mockResolvedValueOnce({ id: 2, nom: 'New Item' });

        const onSuccessMock = vi.fn();
        const onCloseMock = vi.fn();

        render(<MaterielModal open={true} onClose={onCloseMock} onSuccess={onSuccessMock} />);

        fireEvent.change(screen.getByLabelText(/Nom du matériel/), { target: { value: 'New Item' } });
        fireEvent.change(screen.getByLabelText(/Description/), { target: { value: 'A description' } });
        fireEvent.change(screen.getByLabelText(/Catégorie/), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText(/Quantité Totale/), { target: { value: '5' } });
        fireEvent.change(screen.getByLabelText(/Seuil d'alerte/), { target: { value: '1' } });
        
        const submitButton = screen.getByText('Ajouter le matériel');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/materiels', {
                nom: 'New Item',
                description: 'A description',
                categorieId: 1,
                etat: 'neuf',
                quantiteTotale: 5,
                seuilAlerte: 1
            });
            expect(onSuccessMock).toHaveBeenCalledWith('Matériel ajouté !');
            expect(onCloseMock).toHaveBeenCalled();
        });
    });

    it('submits form successfully for editing materiel', async () => {
        ApiHooks.useCategories.mockReturnValue({
            data: mockCategories,
            isLoading: false,
        });

        const mockMateriel = {
            id: 1,
            nom: 'Old Item',
            description: 'Old desc',
            categorie: { id: 2 },
            quantiteTotale: 5,
            etat: 'usagé',
            seuilAlerte: 2
        };

        api.put.mockResolvedValueOnce({ id: 1, nom: 'Updated Item' });

        const onSuccessMock = vi.fn();
        const onCloseMock = vi.fn();

        render(<MaterielModal open={true} onClose={onCloseMock} onSuccess={onSuccessMock} materiel={mockMateriel} />);

        // Change the name
        fireEvent.change(screen.getByLabelText(/Nom du matériel/), { target: { value: 'Updated Item' } });
        
        const submitButton = screen.getByText('Modifier');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(api.put).toHaveBeenCalledWith('/materiels/1', {
                nom: 'Updated Item',
                description: 'Old desc',
                categorieId: 2,
                etat: 'usagé',
                quantiteTotale: 5,
                seuilAlerte: 2
            });
            expect(onSuccessMock).toHaveBeenCalledWith('Matériel mis à jour !');
            expect(onCloseMock).toHaveBeenCalled();
        });
    });
});
