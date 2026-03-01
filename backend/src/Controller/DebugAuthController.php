<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/debug-auth', name: 'api_debug_auth')]
class DebugAuthController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function debug(): JsonResponse
    {
        $user = $this->getUser();
        
        if (!$user) {
            return $this->json(['error' => 'Not authenticated'], 401);
        }

        return $this->json([
            'identifier' => $user->getUserIdentifier(),
            'roles_in_user_object' => $user->getRoles(),
            'is_granted_user' => $this->isGranted('ROLE_USER'),
            'is_granted_comptable' => $this->isGranted('ROLE_COMPTABLE_MATIERE'),
            'is_granted_admin' => $this->isGranted('ROLE_ADMIN'),
        ]);
    }
}
