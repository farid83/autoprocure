<?php

namespace App\Repository;

use App\Entity\Demande;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Demande>
 */
class DemandeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Demande::class);
    }

    public function countByUtilisateur(\App\Entity\Utilisateur $user): int
    {
        return $this->count(['utilisateur' => $user]);
    }

    public function findRecentByUtilisateur(\App\Entity\Utilisateur $user, int $limit = 5): array
    {
        return $this->findBy(['utilisateur' => $user], ['dateCreation' => 'DESC'], $limit);
    }
}
