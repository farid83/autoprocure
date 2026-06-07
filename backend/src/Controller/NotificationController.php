<?php

namespace App\Controller;

use App\Entity\Notification;
use App\Repository\NotificationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/notifications', name: 'api_notifications_')]
class NotificationController extends BaseController
{
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(NotificationRepository $repo): JsonResponse
    {
        return $this->json($repo->findBy(['utilisateur' => $this->getCurrentUser()], ['dateCreation' => 'DESC']), 200, [], ['groups' => 'notification:read']);
    }

    #[Route('/{id}/read', name: 'read', methods: ['PUT'])]
    public function read(Notification $notification, EntityManagerInterface $em): JsonResponse
    {
        if ($notification->getUtilisateur() !== $this->getCurrentUser()) {
            throw $this->createAccessDeniedException();
        }

        $notification->setLu(true);
        $em->flush();

        return $this->json($notification, 200, [], ['groups' => 'notification:read']);
    }
}
