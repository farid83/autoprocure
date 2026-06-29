import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../../pages/Register';
import api from '../../services/api';
import * as RouterDom from 'react-router-dom';

// Mocks
vi.mock('../../services/api', () => ({
    default: {
        post: vi.fn()
    }
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

describe('Register Component', () => {
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        RouterDom.useNavigate.mockReturnValue(mockNavigate);
    });

    it('renders the register form correctly', () => {
        // Arrange
        render(<Register />, { wrapper: BrowserRouter });

        // Act & Assert
        expect(screen.getByRole('heading', { name: /Inscription/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/Nom complet/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Adresse email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Mot de passe$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Confirmer le mot de passe/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /S'inscrire/i })).toBeInTheDocument();
    });

    it('shows validation errors when form is submitted empty', async () => {
        // Arrange
        render(<Register />, { wrapper: BrowserRouter });
        const submitButton = screen.getByRole('button', { name: /S'inscrire/i });

        // Act
        fireEvent.submit(submitButton.closest('form'));

        // Assert
        expect(await screen.findByText('Le nom est requis')).toBeInTheDocument();
        expect(await screen.findByText('L\'email est requis')).toBeInTheDocument();
        expect(await screen.findByText('Le mot de passe est requis')).toBeInTheDocument();
        expect(await screen.findByText('La confirmation du mot de passe est requise')).toBeInTheDocument();
        expect(api.post).not.toHaveBeenCalled();
    });

    it('shows validation error for invalid email and weak password', async () => {
        // Arrange
        render(<Register />, { wrapper: BrowserRouter });
        const nameInput = screen.getByLabelText(/Nom complet/i);
        const emailInput = screen.getByLabelText(/Adresse email/i);
        const passwordInput = screen.getByLabelText(/^Mot de passe$/i);
        const submitButton = screen.getByRole('button', { name: /S'inscrire/i });

        // Act
        fireEvent.change(nameInput, { target: { name: 'nom', value: 'Jean' } });
        fireEvent.change(emailInput, { target: { name: 'email', value: 'invalid-email' } });
        fireEvent.change(passwordInput, { target: { name: 'password', value: 'weak' } });
        fireEvent.submit(submitButton.closest('form'));

        // Assert
        expect(await screen.findByText('L\'email n\'est pas valide')).toBeInTheDocument();
        expect(await screen.findByText(/Le mot de passe doit contenir au moins 12 caractères/)).toBeInTheDocument();
        expect(api.post).not.toHaveBeenCalled();
    });

    it('shows validation error for mismatched passwords', async () => {
        // Arrange
        render(<Register />, { wrapper: BrowserRouter });
        const nameInput = screen.getByLabelText(/Nom complet/i);
        const emailInput = screen.getByLabelText(/Adresse email/i);
        const passwordInput = screen.getByLabelText(/^Mot de passe$/i);
        const confirmPasswordInput = screen.getByLabelText(/Confirmer le mot de passe/i);
        const submitButton = screen.getByRole('button', { name: /S'inscrire/i });

        // Act
        fireEvent.change(nameInput, { target: { name: 'nom', value: 'Jean Dupont' } });
        fireEvent.change(emailInput, { target: { name: 'email', value: 'jean@example.com' } });
        fireEvent.change(passwordInput, { target: { name: 'password', value: 'StrongP@ssw0rd' } });
        fireEvent.change(confirmPasswordInput, { target: { name: 'passwordConfirmation', value: 'DifferentP@ssw0rd' } });
        fireEvent.submit(submitButton.closest('form'));

        // Assert
        expect(await screen.findByText("Les mots de passe ne correspondent pas")).toBeInTheDocument();
        expect(api.post).not.toHaveBeenCalled();
    });

    it('submits form successfully and shows success message', async () => {
        // Arrange
        api.post.mockResolvedValueOnce({ data: { message: 'Success' } });
        render(<Register />, { wrapper: BrowserRouter });
        const nameInput = screen.getByLabelText(/Nom complet/i);
        const emailInput = screen.getByLabelText(/Adresse email/i);
        const passwordInput = screen.getByLabelText(/^Mot de passe$/i);
        const confirmPasswordInput = screen.getByLabelText(/Confirmer le mot de passe/i);
        const submitButton = screen.getByRole('button', { name: /S'inscrire/i });

        // Act
        fireEvent.change(nameInput, { target: { name: 'nom', value: 'Jean Dupont' } });
        fireEvent.change(emailInput, { target: { name: 'email', value: 'jean@example.com' } });
        fireEvent.change(passwordInput, { target: { name: 'password', value: 'StrongP@ssw0rd!' } });
        fireEvent.change(confirmPasswordInput, { target: { name: 'passwordConfirmation', value: 'StrongP@ssw0rd!' } });
        fireEvent.submit(submitButton.closest('form'));

        // Assert
        expect(await screen.findByText(/Inscription réussie !/)).toBeInTheDocument();
        expect(api.post).toHaveBeenCalledWith('/register', {
            nom: 'Jean Dupont',
            email: 'jean@example.com',
            password: 'StrongP@ssw0rd!',
            passwordConfirmation: 'StrongP@ssw0rd!'
        });

        // Test navigation delay
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        }, { timeout: 3000 });
    });

    it('handles server-side validation errors correctly', async () => {
        // Arrange
        api.post.mockRejectedValueOnce({
            errors: {
                email: 'Cet email est déjà utilisé'
            }
        });
        render(<Register />, { wrapper: BrowserRouter });
        const nameInput = screen.getByLabelText(/Nom complet/i);
        const emailInput = screen.getByLabelText(/Adresse email/i);
        const passwordInput = screen.getByLabelText(/^Mot de passe$/i);
        const confirmPasswordInput = screen.getByLabelText(/Confirmer le mot de passe/i);
        const submitButton = screen.getByRole('button', { name: /S'inscrire/i });

        // Act
        fireEvent.change(nameInput, { target: { name: 'nom', value: 'Jean Dupont' } });
        fireEvent.change(emailInput, { target: { name: 'email', value: 'used@example.com' } });
        fireEvent.change(passwordInput, { target: { name: 'password', value: 'StrongP@ssw0rd!' } });
        fireEvent.change(confirmPasswordInput, { target: { name: 'passwordConfirmation', value: 'StrongP@ssw0rd!' } });
        fireEvent.submit(submitButton.closest('form'));

        // Assert
        expect(await screen.findByText('Cet email est déjà utilisé')).toBeInTheDocument();
    });

    it('handles general API errors correctly', async () => {
        // Arrange
        api.post.mockRejectedValueOnce({
            message: 'Erreur interne du serveur'
        });
        render(<Register />, { wrapper: BrowserRouter });
        const nameInput = screen.getByLabelText(/Nom complet/i);
        const emailInput = screen.getByLabelText(/Adresse email/i);
        const passwordInput = screen.getByLabelText(/^Mot de passe$/i);
        const confirmPasswordInput = screen.getByLabelText(/Confirmer le mot de passe/i);
        const submitButton = screen.getByRole('button', { name: /S'inscrire/i });

        // Act
        fireEvent.change(nameInput, { target: { name: 'nom', value: 'Jean Dupont' } });
        fireEvent.change(emailInput, { target: { name: 'email', value: 'jean@example.com' } });
        fireEvent.change(passwordInput, { target: { name: 'password', value: 'StrongP@ssw0rd!' } });
        fireEvent.change(confirmPasswordInput, { target: { name: 'passwordConfirmation', value: 'StrongP@ssw0rd!' } });
        fireEvent.submit(submitButton.closest('form'));

        // Assert
        expect(await screen.findByText('Erreur interne du serveur')).toBeInTheDocument();
    });
});
