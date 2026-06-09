<?php

namespace App\Controller;

use App\DTO\CreateCategorieDto;
use App\Entity\Categorie;
use App\Repository\CategorieRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\ExpressionLanguage\Expression;

#[Route('/api/categories', name: 'api_categories_')]
class CategorieController extends BaseController
{
    #[Route('', name: 'index', methods: ['GET'])]
    #[IsGranted(new Expression("is_granted('ROLE_COMPTABLE_MATIERE') or is_granted('ROLE_ADMIN')"))]
    public function index(CategorieRepository $repo): JsonResponse
    {
        return $this->json($repo->findAll(), 200, [], ['groups' => 'categorie:read']);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    #[IsGranted(new Expression("is_granted('ROLE_COMPTABLE_MATIERE') or is_granted('ROLE_ADMIN')"))]
    public function create(
        #[MapRequestPayload] CreateCategorieDto $dto,
        EntityManagerInterface $em
    ): JsonResponse {
        $cat = new Categorie();
        $cat->setNom($dto->nom);
        
        $cat->setCreatedBy($this->getCurrentUser());

        $em->persist($cat);
        
        $hist = new \App\Entity\Historique();
        $hist->setAction('Création');
        $hist->setTargetEntity('Categorie');
        $hist->setDetails("Création de la catégorie {$cat->getNom()}");
        $em->persist($hist);
        
        $em->flush();

        return $this->json($cat, 201, [], ['groups' => 'categorie:read']);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    #[IsGranted(new Expression("is_granted('ROLE_COMPTABLE_MATIERE') or is_granted('ROLE_ADMIN')"))]
    public function delete(Categorie $cat, EntityManagerInterface $em): JsonResponse
    {
        if (!$cat->getMateriels()->isEmpty()) {
            return $this->json(['error' => 'Cannot delete category with materials'], 400);
        }

        $em->remove($cat);
        
        $hist = new \App\Entity\Historique();
        $hist->setAction('Suppression');
        $hist->setTargetEntity('Categorie');
        $hist->setDetails("Suppression de la catégorie {$cat->getNom()}");
        $em->persist($hist);
        
        $em->flush();
        return $this->json(null, 204);
    }
}
