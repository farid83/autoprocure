<?php

namespace App\Controller;

use App\Repository\CategorieRepository;
use App\Repository\DemandeRepository;
use App\Repository\MaterielRepository;
use App\Repository\UtilisateurRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/dashboard', name: 'api_dashboard_')]
class DashboardController extends AbstractController
{
    #[Route('', name: 'index', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function index(
        MaterielRepository $matRepo,
        CategorieRepository $catRepo,
        DemandeRepository $demRepo,
        UtilisateurRepository $userRepo
    ): JsonResponse {
        /** @var \App\Entity\Utilisateur $user */
        $user = $this->getUser();
        $stats = [];

        if ($this->isGranted('ROLE_ADMIN')) {
            $stats['total_utilisateurs'] = $userRepo->count([]);
        }

        if ($this->isGranted('ROLE_COMPTABLE_MATIERE')) {
            $stats['total_materiels'] = $matRepo->count([]);
            $stats['total_categories'] = $catRepo->count([]);
            $stats['total_demandes'] = $demRepo->count([]);
            $recentDemandes = $demRepo->findBy([], ['dateCreation' => 'DESC'], 5);
        } else {
            // ROLE_USER only sees their own data
            $stats['total_demandes'] = $demRepo->countByUtilisateur($user);
            $recentDemandes = $demRepo->findRecentByUtilisateur($user, 5);
        }

        return $this->json([
            'stats' => $stats,
            'recent_demandes' => $recentDemandes,
        ], 200, [], ['groups' => 'demande:read']);
    }
}
