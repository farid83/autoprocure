<?php

namespace App\Controller;

use App\Entity\Utilisateur;
use App\Repository\UtilisateurRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/utilisateurs', name: 'api_utilisateurs_')]
#[IsGranted('ROLE_ADMIN')]
class UtilisateurController extends AbstractController
{
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(UtilisateurRepository $repo): JsonResponse
    {
        return $this->json($repo->findAll(), 200, [], ['groups' => 'user:read']);
    }

    #[Route('/{id}/role', name: 'update_role', methods: ['PUT'])]
    public function updateRole(Utilisateur $user, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $role = $data['role'] ?? null;

        if (!in_array($role, ['ROLE_USER', 'ROLE_COMPTABLE_MATIERE', 'ROLE_ADMIN'])) {
            return $this->json(['error' => 'Invalid role'], 400);
        }

        $user->setRoles([$role]);
        
        $hist = new \App\Entity\Historique();
        $hist->setAction('Modification Rôle');
        $hist->setTargetEntity('Utilisateur');
        $hist->setTargetId($user->getId());
        $hist->setDetails("Changement de rôle pour {$user->getEmail()} -> {$role}");
        $em->persist($hist);
        
        $em->flush();

        return $this->json($user, 200, [], ['groups' => 'user:read']);
    }

    #[Route('/{id}/statut', name: 'update_statut', methods: ['PUT'])]
    public function updateStatut(Utilisateur $user, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $statut = $data['statut'] ?? null;

        if (!in_array($statut, ['actif', 'inactif'])) {
            return $this->json(['error' => 'Invalid statut'], 400);
        }

        $user->setStatut($statut);
        
        $hist = new \App\Entity\Historique();
        $hist->setAction('Modification Statut');
        $hist->setTargetEntity('Utilisateur');
        $hist->setTargetId($user->getId());
        $hist->setDetails("Changement de statut pour {$user->getEmail()} -> {$statut}");
        $em->persist($hist);
        
        $em->flush();

        return $this->json($user, 200, [], ['groups' => 'user:read']);
    }
}
