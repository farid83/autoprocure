import { createContext, useState, useEffect, useContext } from "react";
// import jwtDecode from "jwt-decode"; 

/**
 * Contexte d'Authentification (Auth Context)
 * 
 * NOTE PÉDAGOGIQUE :
 * Le Contexte (Context) permet de passer des données à travers l'arbre des composants sans avoir à passer manuellement les props à chaque niveau.
 * Ici, nous l'utilisons pour partager l'état de l'utilisateur (`user`) et les fonctions de connexion/déconnexion à toute l'application.
 */
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Vérifier si l'utilisateur est déjà connecté au démarrage de l'application
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            // Comme nous n'avons pas d'endpoint /me, nous supposons que si le token est là, l'utilisateur est connecté.
            // Pour une meilleure UX, on décode le JWT pour récupérer l'email.
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({ email: payload.username, roles: payload.roles });
            } catch (e) {
                console.error("Token invalide", e);
                localStorage.removeItem("token");
            }
        }
        setLoading(false);
    }, []);

    const loginAction = (token) => {
        localStorage.setItem("token", token);

        // Décoder le token pour mettre à jour l'état utilisateur
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser({ email: payload.username, roles: payload.roles });
        } catch (e) {
            setUser({ email: "Utilisateur" }); // Fallback
        }
    };

    const logoutAction = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loginAction, logoutAction, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );  
};

// Hook personnalisé pour utiliser le contexte d'auth facilement
export const useAuth = () => useContext(AuthContext);