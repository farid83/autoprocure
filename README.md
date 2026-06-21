## Installation

### Prérequis

- PHP 8.2+, Composer, PostgreSQL (si installation sans Docker)
- Node.js 20+, npm (pour le frontend)
- Docker et Docker Compose (recommandé, optionnel)

### Option A — Avec Docker (recommandé)

```bash
docker compose up -d --build
```

Cette commande construit et démarre l'ensemble des services (backend, frontend, base de données PostgreSQL).

### Option B — Installation manuelle (sans Docker)

#### Backend

1. **Installation des dépendances** :
```bash
   cd backend
   composer install
```

2. **Configuration** :
   Copiez le contenu pertinent dans `.env.local` si nécessaire.
   Assurez-vous que la base de données est configurée dans `DATABASE_URL`.

3. **Clés JWT** :
```bash
   php bin/console lexik:jwt:generate-keypair
```

4. **Base de données** :
```bash
   php bin/console doctrine:database:create
   php bin/console doctrine:schema:update --force
```

5. **Lancement du serveur** :
```bash
   symfony server:start
```
   ou
```bash
   php -S localhost:8000 -t public
```

#### Frontend

1. **Installation des dépendances** :
```bash
   cd frontend
   npm install
```

2. **Configuration** :
   Créez un fichier `frontend/.env` :
```env
   VITE_API_URL=http://localhost:8000/api
```

3. **Lancement** :
```bash
   npm run dev
```
   L'application est accessible sur `http://localhost:5173`.

## Tests et qualité de code

### Backend

```bash
cd backend
vendor/bin/phpunit              # Tests unitaires et fonctionnels
vendor/bin/phpstan analyse      # Analyse statique (niveau 5)
composer audit                  # Audit de sécurité des dépendances
```

### Frontend

```bash
cd frontend
npm run test                    # Tests unitaires (Vitest)
npm run lint                    # Analyse ESLint
npm audit --audit-level=high    # Audit de sécurité des dépendances
```

## Utilisation

### Authentification

- **Inscription** : `POST /api/register`
```json
  { "email": "admin@example.com", "password": "password", "nom": "Admin" }
```

- **Connexion** : `POST /api/login`
```json
  { "email": "admin@example.com", "password": "password" }
```
  Retourne un token Bearer (JWT) à transmettre dans l'en-tête `Authorization` des requêtes suivantes.

### Rôles et permissions

- **ROLE_USER** (par défaut) : Créer des demandes (`POST /api/demandes`), consulter ses propres demandes.
- **ROLE_COMPTABLE_MATIERE** :
  - Créer Catégorie/Matériel (`POST /api/categories`, `POST /api/materiels`).
  - Valider une demande (`PUT /api/demandes/{id}/validation`).
- **ROLE_ADMIN** :
  - Gérer l'ensemble des ressources.
  - Approuver une demande (`PUT /api/demandes/{id}/approbation`).
  - Modifier un matériel (`PUT`).
  - Gérer les utilisateurs (rôles, statut).

### Endpoints principaux

#### Matériels et demandes

- `GET /api/materiels` — Liste de l'inventaire.
- `POST /api/demandes` — Créer une demande.
```json
  {
    "items": [
      { "materielId": 1, "quantite": 5 }
    ]
  }
```
- `PUT /api/demandes/{id}/validation` *(Comptable Matière)*
```json
  {
     "commentaire": "Ok pour moi",
     "items": [
        { "materielId": 1, "quantiteAccordee": 5 }
     ]
  }
```
- `PUT /api/demandes/{id}/approbation` *(Admin)*
```json
  {
     "commentaire": "Approuvé",
     "decision": "approuvée"
  }
```

#### Gestion des utilisateurs *(Admin)*

- `GET /api/utilisateurs` — Liste des utilisateurs.
- `PUT /api/utilisateurs/{id}/role` — Met à jour le rôle d'un utilisateur.
```json
  { "role": "ROLE_USER" }
```
- `PUT /api/utilisateurs/{id}/statut` — Met à jour le statut d'un utilisateur.
```json
  { "statut": "actif" }
```

#### Notifications

- `GET /api/notifications` — Liste les notifications de l'utilisateur connecté, triées par date de création décroissante.
- `PUT /api/notifications/{id}/read` — Marque une notification comme lue (accessible uniquement à son propriétaire).

## Déploiement

Le déploiement en production est entièrement automatisé via un pipeline CI/CD GitHub Actions :

1. **CI** (`.github/workflows/ci.yml`) — tests, lint, audit de sécurité sur chaque push.
2. **CD** (`.github/workflows/cd.yml`) — build et publication des images Docker sur GHCR, puis déploiement sur le VPS de production via SSH.

Pour plus de détails, voir le chapitre *Gestion du déploiement avec une approche DevOps* du dossier projet.

## Licence

Projet académique réalisé dans le cadre d'un Bachelor 3 Concepteur Développeur d'Application.