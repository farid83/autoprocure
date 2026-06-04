<?php

namespace App\Controller;

use App\DTO\CreateMaterielDto;
use App\Entity\Categorie;
use App\Entity\Materiel;
use App\Entity\Historique;
use App\Entity\DemandeMateriel;
use App\Repository\CategorieRepository;
use App\Repository\MaterielRepository;
use App\Service\NotificationService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\ExpressionLanguage\Expression;
use Symfony\Component\HttpFoundation\Request;

#[Route('/api/materiels', name: 'api_materiels_')]
class MaterielController extends AbstractController
{
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(Request $request, MaterielRepository $repo): JsonResponse
    {
        $search = $request->query->get('search', '');

        $materiels = $search
            ? $repo->findBySearch($search)
            : $repo->findAll();

        return $this->json($materiels, 200, [], ['groups' => 'materiel:read']);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    #[IsGranted(new Expression("is_granted('ROLE_COMPTABLE_MATIERE') or is_granted('ROLE_ADMIN')"))]
    public function create(
        #[MapRequestPayload] CreateMaterielDto $dto,
        CategorieRepository $catRepo,
        EntityManagerInterface $em
    ): JsonResponse {

        $categorie = $catRepo->find($dto->categorieId);
        if (!$categorie) {
            return $this->json(['error' => 'Categorie not found'], 404);
        }

        $materiel = new Materiel();
        $materiel->setNom($dto->nom);
        $materiel->setDescription($dto->description);
        $materiel->setCategorie($categorie);
        $materiel->setQuantiteTotale($dto->quantiteTotale);
        $materiel->setQuantiteDisponible($dto->quantiteTotale); // Initially equal
        $materiel->setEtat($dto->etat);
        $materiel->setSeuilAlerte($dto->seuilAlerte);
        $materiel->setCreatedBy($this->getUser());

        $em->persist($materiel);

        // Log to Historique
        $hist = new Historique();
        $hist->setAction('Création');
        $hist->setTargetEntity('Materiel');
        $hist->setDetails("Création du matériel {$materiel->getNom()}");
        $em->persist($hist);

        $em->flush();

        // Update targetId after flush? No, need ID.
        $hist->setTargetId($materiel->getId());
        $em->flush();

        return $this->json($materiel, 201, [], ['groups' => 'materiel:read']);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function update(
        Materiel $materiel,
        #[MapRequestPayload] CreateMaterielDto $dto, // Reuse or create UpdateDto
        CategorieRepository $catRepo,
        EntityManagerInterface $em,
        NotificationService $notificationService
    ): JsonResponse {

        $categorie = $catRepo->find($dto->categorieId);
        if ($categorie) {
            $materiel->setCategorie($categorie);
        }

        $materiel->setNom($dto->nom);
        $materiel->setDescription($dto->description);
        $materiel->setEtat($dto->etat);
        $materiel->setSeuilAlerte($dto->seuilAlerte);
        // Logic for quantity update? If bumping total, available bumps too?
        // Prompt says "Quantite disponible ne peut pas dépasser totale".
        // Use simpler logic: if total changed, adjust available by difference? 
        // Or just set total.
        $materiel->setQuantiteTotale($dto->quantiteTotale);
        // Ensure available <= total
        if ($materiel->getQuantiteDisponible() > $dto->quantiteTotale) {
            $materiel->setQuantiteDisponible($dto->quantiteTotale);
        }

        $em->flush();

        $hist = new Historique();
        $hist->setAction('Modification');
        $hist->setTargetEntity('Materiel');
        $hist->setTargetId($materiel->getId());
        $em->persist($hist);
        $em->flush();

        // Check for Stock Shortage
        if ($materiel->getQuantiteDisponible() <= $materiel->getSeuilAlerte()) {
            $notificationService->sendStockShortageAlert($materiel);
        }

        return $this->json($materiel, 200, [], ['groups' => 'materiel:read']);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function delete(Materiel $materiel, EntityManagerInterface $em): JsonResponse
    {
        // Check "Un Materiel ne peut pas être supprimé s'il est associé à une Demande en cours"
        $activeDemandes = $em->getRepository(DemandeMateriel::class)->createQueryBuilder('dm')
            ->join('dm.demande', 'd')
            ->where('dm.materiel = :materiel')
            ->andWhere('d.statut NOT IN (:final_states)')
            ->setParameter('materiel', $materiel)
            ->setParameter('final_states', ['approuvée', 'rejetée'])
            ->getQuery()
            ->getResult();

        if (count($activeDemandes) > 0) {
            return $this->json(['error' => 'Cannot delete material associated with active demands'], 400);
        }

        $em->remove($materiel);

        $hist = new Historique();
        $hist->setAction('Suppression');
        $hist->setTargetEntity('Materiel');
        $hist->setDetails("Suppression du matériel {$materiel->getNom()}");
        $em->persist($hist);

        $em->flush();

        return $this->json(null, 204);
    }
}
