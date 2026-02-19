import axios from "axios";

/**
 * Service API pour communiquer avec le Backend Symfony.
 * 
 * NOTE PÉDAGOGIQUE :
 * Ce fichier centralise tous les appels API. Cela rend le code plus propre et plus facile à maintenir.
 * Nous utilisons ici la bibliothèque `axios` au lieu de `fetch`.
 * 
 * Pourquoi Axios ?
 * 1. Transformation JSON automatique : Pas besoin d'appeler `.json()` manuellement.
 * 2. Meilleure gestion des erreurs : Lance des exceptions automatiquement pour les codes 4xx/5xx.
 * 3. Intercepteurs : On peut attacher le token à *toutes* les requêtes automatiquement.
 */

const API_URL = "http://localhost:8000/api";

// Création d'une instance Axios avec une configuration par défaut
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

/**
 * Intercepteur de Requête
 * 
 * NOTE PÉDAGOGIQUE :
 * Un intercepteur permet d'exécuter du code *avant* que la requête ne soit envoyée.
 * Ici, on vérifie si un token est présent dans le LocalStorage et on l'ajoute aux headers.
 * Cela évite de répéter `Authorization: Bearer ...` dans chaque appel API.
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        console.log("Interceptor: Token found?", !!token);
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Intercepteur de Réponse
 * 
 * NOTE PÉDAGOGIQUE :
 * On peut aussi intercepter les réponses.
 * Ici, on retourne directement `response.data` pour ne pas avoir à taper `.data` dans nos composants.
 * On gère aussi les erreurs globales.
 */
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        // On rejette la promesse pour que le bloc catch du composant fonctionne
        // On essaie de récupérer le message d'erreur du backend s'il existe
        const message = error.response?.data?.message || error.message;
        return Promise.reject(message);
    }
);

// --- Endpoints d'Authentification ---

export async function login(email, password) {
    // Envoie une requête POST vers /login
    return api.post("/login", { email, password });
}

export async function register(email, password) {
    return api.post("/register", { email, password });
}

// --- Endpoints Articles ---

// export async function getArticles() {
//     return api.get("/articles");
// }

// export async function getArticle(id) {
//     return api.get(`/articles/${id}`);
// }

// export async function createArticle(articleData) {
//     // articleData doit contenir { titre, content, categorieId }
//     return api.post("/articles", articleData);
// }

// export async function updateArticle(id, articleData) {
//     return api.put(`/articles/${id}`, articleData);
// }

// export async function deleteArticle(id) {
//     return api.delete(`/articles/${id}`);
// }

// // --- Endpoints Commentaires ---

// export async function getComments(articleId) {
//     return api.get(`/articles/${articleId}/comments`);
// }

// export async function createComment(articleId, content) {
//     return api.post(`/articles/${articleId}/comments`, { content });
// }

// // --- Endpoints Categories ---

// export async function getCategories() {
//     return api.get("/categories");
// }

export default api;