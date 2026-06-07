<?php
namespace App\Tests\Api;

use App\Entity\Categorie;
use App\Entity\Utilisateur;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class CategorieApiTest extends WebTestCase
{
    private function getAdminClient()
    {
        $client = static::createClient();
        $userRepo = static::getContainer()->get('doctrine')->getRepository(Utilisateur::class);
        $admin = $userRepo->findOneBy(['email' => 'admin@example.com']);
        $client->loginUser($admin);
        return $client;
    }

    // GET /api/categories
    public function testGetCategoriesReturns200(): void
    {
        $client = $this->getAdminClient();
        $client->request('GET', '/api/categories');
        $this->assertResponseStatusCodeSame(200);
    }

    // POST /api/categories - Nominal
    public function testPostCategorieCreates201(): void
    {
        $client = $this->getAdminClient();
        $client->request('POST', '/api/categories', [], [], ['CONTENT_TYPE' => 'application/json'],
            json_encode(['nom' => 'Categorie Test Post'])
        );
        $this->assertResponseStatusCodeSame(201);
    }

    // DELETE /api/categories/{id} - Catégorie sans matériels
    public function testDeleteCategorieReturns204(): void
    {
        $client = $this->getAdminClient();

        // Crée une catégorie vide à supprimer
        $em = static::getContainer()->get('doctrine')->getManager();
        $userRepo = static::getContainer()->get('doctrine')->getRepository(Utilisateur::class);
        $admin = $userRepo->findOneBy(['email' => 'admin@example.com']);

        $cat = new Categorie();
        $cat->setNom('Categorie A Supprimer');
        $cat->setCreatedBy($admin);
        $em->persist($cat);
        $em->flush();

        $client->request('DELETE', '/api/categories/' . $cat->getId());
        $this->assertResponseStatusCodeSame(204);
    }

    // DELETE /api/categories/{id} - Catégorie avec matériels → 400
    public function testDeleteCategorieWithMaterielsReturns400(): void
    {
        $client = $this->getAdminClient();
        $repo = static::getContainer()->get('doctrine')->getRepository(Categorie::class);
        $cat = $repo->findOneBy(['nom' => 'Catégorie Test']);
        $client->request('DELETE', '/api/categories/' . $cat->getId());
        $this->assertResponseStatusCodeSame(400);
    }
}