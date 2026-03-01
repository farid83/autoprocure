# Inventory API with Symfony 8

## Description
API REST Symfony 8 pour la gestion d'inventaire avec PostgreSQL et JWT.

## Installation

1.  **Prérequis** : PHP 8.2+, Composer, PostgreSQL.

2.  **Installation des dépendances** :
    ```bash
    composer install
    ```

3.  **Configuration** :
    Copiez le contenu pertinent dans `.env.local` si nécessaire.
    Assurez-vous que la base de données est configurée dans `DATABASE_URL`.

4.  **Clés JWT** :
    Générez les clés SSL pour JWT :
    ```bash
    php bin/console lexik:jwt:generate-keypair
    ```

5.  **Base de données** :
    Créez la base de données et le schéma :
    ```bash
    php bin/console doctrine:database:create
    php bin/console doctrine:schema:update --force
    ```

## Utilisation

### Authentification

*   **Inscription** : `POST /api/register`
    ```json
    { "email": "admin@example.com", "password": "password", "nom": "Admin" }
    ```
*   **Connexion** : `POST /api/login`
    ```json
    { "email": "admin@example.com", "password": "password" }
    ```
    Retourne un token Bearer.

### Rôles et Permissions

*   **ROLE_USER** (Défaut) : Créer des demandes (`POST /api/demandes`).
*   **ROLE_COMPTABLE_MATIERE** :
    *   Créer Catégorie/Matériel (`POST /api/categories`, `POST /api/materiels`).
    *   Valider Demande (`PUT /api/demandes/{id}/validation`).
*   **ROLE_ADMIN** :
    *   Gérer tout.
    *   Approuver Demande (`PUT /api/demandes/{id}/approbation`).
    *   Modifier Matériel (`PUT`).

### Endpoints Principaux

*   `GET /api/materiels` : Liste inventaire.
*   `POST /api/demandes` : Créer une demande.
    ```json
    {
      "items": [
        { "materielId": 1, "quantite": 5 }
      ]
    }
    ```
*   `PUT /api/demandes/{id}/validation` (Comptable)
    ```json
    {
       "commentaire": "Ok pour moi",
       "items": [
          { "materielId": 1, "quantiteAccordee": 5 }
       ]
    }
    ```
*   `PUT /api/demandes/{id}/approbation` (Admin)
    ```json
    {
       "commentaire": "Approuvé",
       "decision": "approuvée"
    }
    ```

## Structure
*   **src/Entity** : Classes Doctrine.
*   **src/DTO** : Data Transfer Objects avec validation (`#[MapRequestPayload]`).
*   **src/Controller** : Logique API.
*   **config/packages/security.yaml** : Configuration Firewall et JWT.
