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
}
