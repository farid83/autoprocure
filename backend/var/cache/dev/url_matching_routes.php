<?php

/**
 * This file has been auto-generated
 * by the Symfony Routing Component.
 */

return [
    false, // $matchHost
    [ // $staticRoutes
        '/api/register' => [[['_route' => 'api_auth_register', '_controller' => 'App\\Controller\\AuthController::register'], null, ['POST' => 0], null, false, false, null]],
        '/api/login' => [[['_route' => 'api_auth_login', '_controller' => 'App\\Controller\\AuthController::login'], null, ['POST' => 0], null, false, false, null]],
        '/api/categories' => [
            [['_route' => 'api_categories_index', '_controller' => 'App\\Controller\\CategorieController::index'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'api_categories_create', '_controller' => 'App\\Controller\\CategorieController::create'], null, ['POST' => 0], null, false, false, null],
        ],
        '/api/dashboard' => [[['_route' => 'api_dashboard_index', '_controller' => 'App\\Controller\\DashboardController::index'], null, ['GET' => 0], null, false, false, null]],
        '/api/debug-auth' => [[['_route' => 'api_debug_authapp_debugauth_debug', '_controller' => 'App\\Controller\\DebugAuthController::debug'], null, ['GET' => 0], null, false, false, null]],
        '/api/demandes' => [
            [['_route' => 'api_demandes_index', '_controller' => 'App\\Controller\\DemandeController::index'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'api_demandes_create', '_controller' => 'App\\Controller\\DemandeController::create'], null, ['POST' => 0], null, false, false, null],
        ],
        '/api/materiels' => [
            [['_route' => 'api_materiels_index', '_controller' => 'App\\Controller\\MaterielController::index'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'api_materiels_create', '_controller' => 'App\\Controller\\MaterielController::create'], null, ['POST' => 0], null, false, false, null],
        ],
        '/api/notifications' => [[['_route' => 'api_notifications_index', '_controller' => 'App\\Controller\\NotificationController::index'], null, ['GET' => 0], null, false, false, null]],
        '/api/utilisateurs' => [[['_route' => 'api_utilisateurs_index', '_controller' => 'App\\Controller\\UtilisateurController::index'], null, ['GET' => 0], null, false, false, null]],
    ],
    [ // $regexpList
        0 => '{^(?'
                .'|/_error/(\\d+)(?:\\.([^/]++))?(*:35)'
                .'|/api/(?'
                    .'|categories/([^/]++)(*:69)'
                    .'|demandes/([^/]++)/(?'
                        .'|validation(*:107)'
                        .'|approbation(*:126)'
                    .')'
                    .'|materiels/([^/]++)(?'
                        .'|(*:156)'
                    .')'
                    .'|notifications/([^/]++)/read(*:192)'
                    .'|utilisateurs/([^/]++)/(?'
                        .'|role(*:229)'
                        .'|statut(*:243)'
                    .')'
                .')'
            .')/?$}sDu',
    ],
    [ // $dynamicRoutes
        35 => [[['_route' => '_preview_error', '_controller' => 'error_controller::preview', '_format' => 'html'], ['code', '_format'], null, null, false, true, null]],
        69 => [[['_route' => 'api_categories_delete', '_controller' => 'App\\Controller\\CategorieController::delete'], ['id'], ['DELETE' => 0], null, false, true, null]],
        107 => [[['_route' => 'api_demandes_validate', '_controller' => 'App\\Controller\\DemandeController::validate'], ['id'], ['PUT' => 0], null, false, false, null]],
        126 => [[['_route' => 'api_demandes_approve', '_controller' => 'App\\Controller\\DemandeController::approve'], ['id'], ['PUT' => 0], null, false, false, null]],
        156 => [
            [['_route' => 'api_materiels_update', '_controller' => 'App\\Controller\\MaterielController::update'], ['id'], ['PUT' => 0], null, false, true, null],
            [['_route' => 'api_materiels_delete', '_controller' => 'App\\Controller\\MaterielController::delete'], ['id'], ['DELETE' => 0], null, false, true, null],
        ],
        192 => [[['_route' => 'api_notifications_read', '_controller' => 'App\\Controller\\NotificationController::read'], ['id'], ['PUT' => 0], null, false, false, null]],
        229 => [[['_route' => 'api_utilisateurs_update_role', '_controller' => 'App\\Controller\\UtilisateurController::updateRole'], ['id'], ['PUT' => 0], null, false, false, null]],
        243 => [
            [['_route' => 'api_utilisateurs_update_statut', '_controller' => 'App\\Controller\\UtilisateurController::updateStatut'], ['id'], ['PUT' => 0], null, false, false, null],
            [null, null, null, null, false, false, 0],
        ],
    ],
    null, // $checkCondition
];
