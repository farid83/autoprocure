<?php

namespace App\Controller;

use App\DTO\ApproveDemandeDto;
use App\DTO\CreateDemandeDto;
use App\DTO\ValidateDemandeDto;
use App\Entity\Demande;
use App\Entity\DemandeMateriel;
use App\Entity\Historique;
use App\Entity\Notification;
use App\Repository\DemandeRepository;
use App\Repository\MaterielRepository;
use App\Service\NotificationService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/demandes', name: 'api_demandes_')]
class DemandeController extends AbstractController
{
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(DemandeRepository $repo): JsonResponse
    {
        if ($this->isGranted('ROLE_ADMIN') || $this->isGranted('ROLE_COMPTABLE_MATIERE')) {
            return $this->json($repo->findAll(), 200, [], ['groups' => 'demande:read']);
        }

        return $this->json($repo->findBy(['utilisateur' => $this->getUser()]), 200, [], ['groups' => 'demande:read']);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function create(
        #[MapRequestPayload] CreateDemandeDto $dto,
        MaterielRepository $matRepo,
        EntityManagerInterface $em,
        NotificationService $notificationService
    ): JsonResponse {
        $demande = new Demande();
        $demande->setUtilisateur($this->getUser());

        // Initial check for stock availability
        $insufficientStock = false;
        $rejectionDetails = [];
        $itemsToPersist = [];

        foreach ($dto->items as $item) {
            $mat = $matRepo->find($item['materielId']);
            if (!$mat) {
                return $this->json(['error' => 'Materiel not found: ' . $item['materielId']], 404);
            }

            if ($item['quantite'] > $mat->getQuantiteDisponible()) {
                $insufficientStock = true;
                $rejectionDetails[] = "{$mat->getNom()} (demandé: {$item['quantite']}, disponible: {$mat->getQuantiteDisponible()})";
            }

            $dm = new DemandeMateriel();
            $dm->setMateriel($mat);
            $dm->setQuantiteDemandee($item['quantite']);
            $dm->setStatut('en attente');
            $demande->addDemandeMateriel($dm);
            $itemsToPersist[] = $dm;
        }

        if ($insufficientStock) {
            $demande->setStatut('rejetée');
            $statusLabel = "Rejet automatique (Stock insuffisant)";
            $details = "Demande rejetée automatiquement pour stock insuffisant : " . implode(', ', $rejectionDetails);
        } else {
            $demande->setStatut('en attente');
            $statusLabel = "Création";
            $details = "Nouvelle demande par " . $this->getUser()->getUserIdentifier();
        }

        foreach ($itemsToPersist as $dm) {
            $em->persist($dm);
        }
        $em->persist($demande);

        $hist = new Historique();
        $hist->setAction($statusLabel);
        $hist->setTargetEntity('Demande');
        $hist->setDetails($details);
        $hist->setDemande($demande);
        $em->persist($hist);

        $em->flush();

        // Notify Admins and Comptables ONLY if demand is NOT rejected
        if (!$insufficientStock) {
            $notificationService->sendNewRequestAlert($demande);
        }

        return $this->json($demande, 201, [], ['groups' => 'demande:read']);
    }

    #[Route('/{id}/validation', name: 'validate', methods: ['PUT'])]
    #[IsGranted('ROLE_COMPTABLE_MATIERE')]
    public function validate(
        Demande $demande,
        #[MapRequestPayload] ValidateDemandeDto $dto,
        EntityManagerInterface $em
    ): JsonResponse {
        if ($demande->getStatut() !== 'en attente') {
            return $this->json(['error' => 'Demande not in waiting state'], 400);
        }

        $demande->setComptableMatiere($this->getUser());
        $demande->setCommentaireValidation($dto->commentaire);
        $demande->setDateValidation(new \DateTime());
        $demande->setStatut('validée'); // Assuming full validation if success

        // Process items
        foreach ($dto->items as $itemData) {
            // Find the DM
            $dmFound = false;
            foreach ($demande->getDemandeMateriels() as $dm) {
                if ($dm->getMateriel()->getId() === $itemData['materielId']) {
                    if ($itemData['quantiteAccordee'] > $dm->getQuantiteDemandee()) {
                        return $this->json(['error' => 'Accorded quantity > requested'], 400);
                    }
                    $dm->setQuantiteAccordee($itemData['quantiteAccordee']);
                    $dm->setStatut('accordée'); // Or validée
                    $dmFound = true;
                    break;
                }
            }
        }

        $em->flush();

        $hist = new Historique();
        $hist->setAction('Validation');
        $hist->setDemande($demande);
        $hist->setTargetEntity('Demande');
        $em->persist($hist);
        $em->flush();

        return $this->json($demande, 200, [], ['groups' => 'demande:read']);
    }

    #[Route('/{id}/approbation', name: 'approve', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function approve(
        Demande $demande,
        #[MapRequestPayload] ApproveDemandeDto $dto,
        EntityManagerInterface $em,
        NotificationService $notificationService
    ): JsonResponse {
        if ($demande->getStatut() !== 'validée') {
            return $this->json(['error' => 'Demande needs to be validated first'], 400);
        }

        $demande->setAdministrateur($this->getUser());
        $demande->setCommentaireApprobation($dto->commentaire);
        $demande->setDateApprobation(new \DateTime());
        $demande->setStatut($dto->decision); // approuvée / rejetée

        if ($dto->decision === 'approuvée') {
            // Decrement stock
            foreach ($demande->getDemandeMateriels() as $dm) {
                if ($dm->getQuantiteAccordee() > 0) {
                    $mat = $dm->getMateriel();
                    $newQty = $mat->getQuantiteDisponible() - $dm->getQuantiteAccordee();
                    if ($newQty < 0) {
                        return $this->json(['error' => 'Stock became insufficient during process'], 409);
                    }
                    $mat->setQuantiteDisponible($newQty);
                    $dm->setStatut('accordée');
                }
            }
        } else {
            // Notification Rejet
            $notif = new Notification();
            $notif->setUtilisateur($demande->getUtilisateur());
            $notif->setMessage("Votre demande #{$demande->getId()} a été rejetée.");
            $em->persist($notif);
        }

        $hist = new Historique();
        $hist->setAction('Approbation');
        $hist->setDemande($demande);
        $hist->setDetails("Decision: " . $dto->decision);
        $em->persist($hist);

        $em->flush();

        // Notify Requester
        $notificationService->sendRequestStatusUpdate($demande);

        // Check for Stock Shortage for each material in the request
        if ($dto->decision === 'approuvée') {
            foreach ($demande->getDemandeMateriels() as $dm) {
                $mat = $dm->getMateriel();
                if ($mat->getQuantiteDisponible() <= $mat->getSeuilAlerte()) {
                    $notificationService->sendStockShortageAlert($mat);
                }
            }
        }

        return $this->json($demande, 200, [], ['groups' => 'demande:read']);
    }
}
