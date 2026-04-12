import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../pages/Login';
import * as AuthContext from '../../context/AuthContext';
import * as RouterDom from 'react-router-dom';

// Mocks
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
        Navigate: vi.fn(({ to }) => <div data-testid={`navigate-to-${to}`} />)
    };
});

describe('Login Component', () => {
    const mockLogin = vi.fn();
    const mockNavigate = vi.fn();
    const mockClearError = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        RouterDom.useNavigate.mockReturnValue(mockNavigate);
        
        AuthContext.useAuth.mockReturnValue({
            login: mockLogin,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            clearError: mockClearError,
        });
    });

    it('renders the login form correctly', () => {
        // Arrange
        render(<Login />, { wrapper: BrowserRouter });

        // Act & Assert
        expect(screen.getByText('Connexion')).toBeInTheDocument();
        expect(screen.getByLabelText(/Adresse email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Se connecter/i })).toBeInTheDocument();
    });

    it('redirects to dashboard if already authenticated', () => {
        // Arrange
        AuthContext.useAuth.mockReturnValue({
            login: mockLogin,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            clearError: mockClearError,
        });

        // Act
        render(<Login />, { wrapper: BrowserRouter });

        // Assert
        expect(screen.getByTestId('navigate-to-/dashboard')).toBeInTheDocument();
    });

    it('shows loading state when isLoading is true', () => {
        // Arrange
        AuthContext.useAuth.mockReturnValue({
            login: mockLogin,
            isAuthenticated: false,
            isLoading: true,
            error: null,
            clearError: mockClearError,
        });

        // Act
        render(<Login />, { wrapper: BrowserRouter });

        // Assert
        expect(screen.getByText(/Vérification de la session.../i)).toBeInTheDocument();
    });

    it('updates form data on input change', () => {
        // Arrange
        render(<Login />, { wrapper: BrowserRouter });
        const emailInput = screen.getByLabelText(/Adresse email/i);
        const passwordInput = screen.getByLabelText(/Mot de passe/i);

        // Act
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        // Assert
        expect(emailInput.value).toBe('test@example.com');
        expect(passwordInput.value).toBe('password123');
    });

    it('calls login function and navigates on successful submission', async () => {
        // Arrange
        mockLogin.mockResolvedValueOnce({});
        render(<Login />, { wrapper: BrowserRouter });
        const emailInput = screen.getByLabelText(/Adresse email/i);
        const passwordInput = screen.getByLabelText(/Mot de passe/i);
        const submitButton = screen.getByRole('button', { name: /Se connecter/i });

        // Act
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        // Assert
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('displays error message on login failure', async () => {
        // Arrange
        mockLogin.mockRejectedValueOnce('Invalid credentials');
        render(<Login />, { wrapper: BrowserRouter });
        const emailInput = screen.getByLabelText(/Adresse email/i);
        const passwordInput = screen.getByLabelText(/Mot de passe/i);
        const submitButton = screen.getByRole('button', { name: /Se connecter/i });

        // Act
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
        fireEvent.click(submitButton);

        // Assert
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });

    it('clears error message on input change', async () => {
        // Arrange
        mockLogin.mockRejectedValueOnce('Invalid credentials');
        render(<Login />, { wrapper: BrowserRouter });
        const emailInput = screen.getByLabelText(/Adresse email/i);
        const passwordInput = screen.getByLabelText(/Mot de passe/i);
        const submitButton = screen.getByRole('button', { name: /Se connecter/i });

        // Act - Trigger error
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
        fireEvent.click(submitButton);

        // Assert error is shown
        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });

        // Act - Change input
        fireEvent.change(emailInput, { target: { value: 'test2@example.com' } });

        // Assert error is cleared
        expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
        expect(mockClearError).toHaveBeenCalled();
    });

    it('handles quick login correctly', async () => {
        // Arrange
        mockLogin.mockResolvedValueOnce({});
        render(<Login />, { wrapper: BrowserRouter });
        const quickLoginEmailSpan = screen.getByText('jean.dupont@example.com');

        // Act
        fireEvent.click(quickLoginEmailSpan);

        // Assert
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('jean.dupont@example.com', 'Password123@');
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });
});
