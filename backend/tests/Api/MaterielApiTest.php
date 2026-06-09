<?php

namespace App\Tests\Api;

use App\Entity\Materiel;
use App\Entity\Utilisateur;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class MaterielApiTest extends WebTestCase
{
    // - TEST 6 : DELETE /api/materiel/{id} - Nominal ──────────────────────
    public function testDeleteMaterielReturns204(): void
    {
        $client = static::createClient();

        $userRepository = static::getContainer()->get('doctrine')->getRepository(Utilisateur::class);
        // Use the admin user since only admins can delete materials
        $adminUser = $userRepository->findOneBy(['email' => 'admin@example.com']);
        $client->loginUser($adminUser);

        $repo = static::getContainer()->get('doctrine')->getRepository(Materiel::class);
        $materiel = $repo->findOneBy(['nom' => 'Materiel A Supprimer']);

        $client->request('DELETE', '/api/materiels/' . $materiel->getId());

        // Depending on your permission settings, it might be 204 or 403
        $this->assertTrue(in_array($client->getResponse()->getStatusCode(), [204]));
    }


    // GET /api/materiels
    public function testGetMaterielsReturns200(): void
    {
        $client = static::createClient();
        $userRepo = static::getContainer()->get('doctrine')->getRepository(Utilisateur::class);
        $admin = $userRepo->findOneBy(['email' => 'admin@example.com']);
        $client->loginUser($admin);
        $client->request('GET', '/api/materiels');
        $this->assertResponseStatusCodeSame(200);
    }

    // POST /api/materiels
    public function testPostMaterielCreates201(): void
    {
        $client = static::createClient();
        $userRepo = static::getContainer()->get('doctrine')->getRepository(Utilisateur::class);
        $admin = $userRepo->findOneBy(['email' => 'admin@example.com']);
        $client->loginUser($admin);

        $categorieRepo = static::getContainer()->get('doctrine')->getRepository(\App\Entity\Categorie::class);
        $categorie = $categorieRepo->findOneBy(['nom' => 'Catégorie Test']);

        $client->request(
            'POST',
            '/api/materiels',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'nom' => 'Materiel Test Post',
                'categorieId' => $categorie->getId(),
                'quantiteTotale' => 5,
                'quantiteDisponible' => 5,
                'etat' => 'neuf',
                'seuilAlerte' => 2,
            ])
        );
        $this->assertResponseStatusCodeSame(201);
    }

    public function testPutMaterielReturns200(): void
    {
        $client = static::createClient();
        $userRepo = static::getContainer()->get('doctrine')->getRepository(Utilisateur::class);
        $admin = $userRepo->findOneBy(['email' => 'admin@example.com']);
        $client->loginUser($admin);

        $repo = static::getContainer()->get('doctrine')->getRepository(Materiel::class);
        $materiel = $repo->findOneBy(['nom' => 'Ordinateur Portable Test']);

        $categorieRepo = static::getContainer()->get('doctrine')->getRepository(\App\Entity\Categorie::class);
        $categorie = $categorieRepo->findOneBy(['nom' => 'Catégorie Test']);

        $client->request(
            'PUT',
            '/api/materiels/' . $materiel->getId(),
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'nom' => 'Ordinateur Portable Test',
                'categorieId' => $categorie->getId(),
                'quantiteTotale' => 20,
                'etat' => 'neuf',
                'seuilAlerte' => 5,
            ])
        );
        $this->assertResponseStatusCodeSame(200);
    }
}
