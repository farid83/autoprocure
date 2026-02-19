import { createContext, useState, useEffect, useContext } from "react";
import * as api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingSession, setIsCheckingSession] = useState(true);
    const [error, setError] = useState(null);

    const clearError = () => setError(null);

    // Vérifier si l'utilisateur est déjà connecté au démarrage de l'application
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({ email: payload.username, roles: payload.roles });
            } catch (e) {
                console.error("Token invalide", e);
                localStorage.removeItem("token");
            }
        }
        setIsCheckingSession(false);

        // Écouter l'événement de déconnexion globale (ex: token expiré)
        const handleLogout = () => logoutAction();
        window.addEventListener("auth:logout", handleLogout);

        return () => {
            window.removeEventListener("auth:logout", handleLogout);
        };
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.login(email, password);
            if (data && data.token) {
                loginAction(data.token);
                return data;
            } else {
                throw new Error("Token non reçu");
            }
        } catch (err) {
            console.error("Login failed:", err);

            // Traduction des messages d'erreur courants du backend
            let errorMessage = err;
            if (err === "Invalid credentials.") {
                errorMessage = "Email ou mot de passe incorrect.";
            } else if (err === "Network Error") {
                errorMessage = "Impossible de contacter le serveur. Veuillez vérifier votre connexion.";
            }

            setError(errorMessage);
            throw errorMessage;
        } finally {
            setIsLoading(false);
        }
    };

    const loginAction = (token) => {
        localStorage.setItem("token", token);
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser({ email: payload.username, roles: payload.roles });
        } catch (e) {
            setUser({ email: "Utilisateur" });
        }
    };

    const logoutAction = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    const hasAnyRole = (roles) => {
        if (!user || !user.roles) return false;
        return roles.some(role => user.roles.includes(role));
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            logoutAction,
            isLoading,
            isCheckingSession,
            error,
            clearError,
            hasAnyRole
        }}>
            {!isCheckingSession && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
