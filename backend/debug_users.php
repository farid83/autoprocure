<?php

use App\Entity\Utilisateur;
use Symfony\Component\Dotenv\Dotenv;

require __DIR__.'/vendor/autoload.php';

(new Dotenv())->bootEnv(__DIR__.'/.env');

$kernel = new \App\Kernel('dev', true);
$kernel->boot();

$container = $kernel->getContainer();
$entityManager = $container->get('doctrine')->getManager();
$repository = $entityManager->getRepository(Utilisateur::class);

$users = $repository->findAll();

echo "USER LIST:\n";
foreach ($users as $user) {
    echo sprintf("- %s | Roles: %s | Statut: %s\n", 
        $user->getEmail(), 
        implode(', ', $user->getRoles()),
        $user->getStatut()
    );
}
echo "\nROLE HIERARCHY CHECK (Logic check):\n";
$security = $container->get('security.helper');
// We can't easily check hierarchy via helper without a token, but we can check the config.
