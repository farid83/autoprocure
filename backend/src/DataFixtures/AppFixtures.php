<?php

namespace App\DataFixtures;

use App\Entity\Categorie;
use App\Entity\Materiel;
use App\Entity\Utilisateur;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $hasher;

    public function __construct(UserPasswordHasherInterface $hasher)
    {
        $this->hasher = $hasher;
    }

    public function load(ObjectManager $manager): void
    {
        // 1. Créer un Utilisateur
        $user = new Utilisateur();
        $user->setEmail('test@example.com');
        $user->setNom('Test User');
        $user->setPassword($this->hasher->hashPassword($user, 'password'));
        $user->setRoles(['ROLE_USER']);
        $manager->persist($user);

        // Créer un Administrateur pour les tests
        $admin = new Utilisateur();
        $admin->setEmail('admin@example.com');
        $admin->setNom('Admin User');
        $admin->setPassword($this->hasher->hashPassword($admin, 'password'));
        $admin->setRoles(['ROLE_ADMIN']);
        $manager->persist($admin);

        // 2. Créer une Categorie
        $categorie = new Categorie();
        $categorie->setNom('Catégorie Test');
        $categorie->setCreatedBy($user);
        $manager->persist($categorie);

        // 3. Créer un Materiel (Stock suffisant)
        $materiel1 = new Materiel();
        $materiel1->setNom('Ordinateur Portable Test');
        $materiel1->setCategorie($categorie);
        $materiel1->setQuantiteTotale(20);
        $materiel1->setQuantiteDisponible(20);
        $materiel1->setEtat('Neuf');
        $materiel1->setSeuilAlerte(5);
        $materiel1->setCreatedBy($user);
        $manager->persist($materiel1);

        // 4. Créer un Materiel (Pour les tests de refus - Stock insuffisant)
        $materiel2 = new Materiel();
        $materiel2->setNom('Imprimante Test');
        $materiel2->setCategorie($categorie);
        $materiel2->setQuantiteTotale(0);
        $materiel2->setQuantiteDisponible(0);
        $materiel2->setEtat('Neuf');
        $materiel2->setSeuilAlerte(1);
        $materiel2->setCreatedBy($user);
        $manager->persist($materiel2);

        // 5. Créer un Materiel (Pour le test de suppression)
        $materiel3 = new Materiel();
        $materiel3->setNom('Materiel A Supprimer');
        $materiel3->setCategorie($categorie);
        $materiel3->setQuantiteTotale(10);
        $materiel3->setQuantiteDisponible(10);
        $materiel3->setEtat('Neuf');
        $materiel3->setSeuilAlerte(2);
        $materiel3->setCreatedBy($admin);
        $manager->persist($materiel3);

        $manager->flush();
    }
}
