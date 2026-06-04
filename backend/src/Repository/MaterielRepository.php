<?php
namespace App\Repository;

use App\Entity\Materiel;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Materiel>
 */
class MaterielRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Materiel::class);
    }

    public function findBySearch(string $search): array
    {
        return $this->createQueryBuilder('m')
            ->leftJoin('m.categorie', 'c')
            ->addSelect('c')
            ->where('LOWER(m.nom) LIKE LOWER(:search)')
            ->orWhere('LOWER(m.description) LIKE LOWER(:search)')
            ->setParameter('search', '%' . $search . '%')
            ->orderBy('m.nom', 'ASC')
            ->getQuery()
            ->getResult();
    }
}