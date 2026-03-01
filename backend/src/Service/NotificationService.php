<?php

namespace App\Service;

use App\Entity\Demande;
use App\Entity\Materiel;
use App\Entity\Notification;
use App\Entity\Utilisateur;
use App\Repository\UtilisateurRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;

class NotificationService
{
    public function __construct(
        private MailerInterface $mailer,
        private EntityManagerInterface $em,
        private UtilisateurRepository $userRepo
    ) {
    }

    public function sendStockShortageAlert(Materiel $materiel): void
    {
        $admins = $this->findAdminsAndComptables();
        $message = "Alerte stock : Le matériel '{$materiel->getNom()}' a atteint son seuil d'alerte ({$materiel->getSeuilAlerte()}). Quantité disponible : {$materiel->getQuantiteDisponible()}.";

        foreach ($admins as $admin) {
            $this->createNotification($admin, $message);
            $this->sendEmail($admin->getEmail(), "Alerte Stock - {$materiel->getNom()}", 'emails/stock_shortage.html.twig', [
                'materiel' => $materiel,
                'user' => $admin
            ]);
        }
    }

    public function sendNewRequestAlert(Demande $demande): void
    {
        $admins = $this->findAdminsAndComptables();
        $requester = $demande->getUtilisateur();
        $message = "Nouvelle demande effectuée par {$requester->getNom()} (ID: #{$demande->getId()}).";

        foreach ($admins as $admin) {
            $this->createNotification($admin, $message);
            $this->sendEmail($admin->getEmail(), "Nouvelle Demande - #{$demande->getId()}", 'emails/new_request.html.twig', [
                'demande' => $demande,
                'user' => $admin
            ]);
        }
    }

    public function sendRequestStatusUpdate(Demande $demande): void
    {
        $user = $demande->getUtilisateur();
        $statut = $demande->getStatut();
        $message = "Votre demande #{$demande->getId()} a été {$statut}.";

        $this->createNotification($user, $message);
        $this->sendEmail($user->getEmail(), "Mise à jour de votre demande - #{$demande->getId()}", 'emails/request_status.html.twig', [
            'demande' => $demande,
            'user' => $user
        ]);
    }

    private function findAdminsAndComptables(): array
    {
        $conn = $this->em->getConnection();

        
        $sql = 'SELECT id FROM utilisateurs WHERE roles::text LIKE :admin OR roles::text LIKE :comptable';

        $ids = $conn->executeQuery($sql, [
            'admin' => '%ROLE_ADMIN%',
            'comptable' => '%ROLE_COMPTABLE_MATIERE%'
        ])->fetchFirstColumn();

        if (empty($ids)) {
            return [];
        }

        return $this->userRepo->findBy(['id' => $ids]);
    }

    private function createNotification(Utilisateur $user, string $message): void
    {
        $notification = new Notification();
        $notification->setUtilisateur($user);
        $notification->setMessage($message);
        $notification->setLu(false);
        $this->em->persist($notification);
        $this->em->flush();
    }

    private function sendEmail(string $to, string $subject, string $template, array $context): void
    {
        $email = (new TemplatedEmail())
            ->from(new Address('inventory@example.com', 'Inventory Management'))
            ->to($to)
            ->subject($subject)
            ->htmlTemplate($template)
            ->context($context);

        $this->mailer->send($email);
    }
}
