import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * Composant de Route Protégée.
 * 
 * NOTE PÉDAGOGIQUE :
 * Ce composant enveloppe les routes qui nécessitent d'être connecté.
 * Il vérifie l'état d'authentification via le contexte.
 * 1. Si on vérifie la session : affiche un loader.
 * 2. Si pas authentifié : redirige vers /login.
 * 3. Si authentifié : affiche les enfants (la page demandée).
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, isCheckingSession, hasAnyRole } = useAuth();

    if (isCheckingSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Vérification de la session...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // L'utilisateur n'est pas connecté, redirection vers /login
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !hasAnyRole(allowedRoles)) {
        return <Navigate to="/forbidden" replace />;
    }

    // Authentifié, on affiche le contenu
    return children;
};

export default ProtectedRoute;
