<?php

namespace App\Controller;

use App\DTO\RegisterUserDto;
use App\Entity\Utilisateur;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;


#[Route('/api', name: 'api_auth_')]
class AuthController extends AbstractController
{
    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(
        #[MapRequestPayload] RegisterUserDto $dto,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $em,
        ValidatorInterface $validator

    ): JsonResponse {
        $errors = $validator->validate($dto);
        if ($errors->count() > 0) {
            $errorsData = [];
            foreach ($errors as $error) {
                $errorsData[$error->getPropertyPath()] = $error->getMessage();
            }

            return new JsonResponse(['errors' => $errorsData], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        $user = new Utilisateur();
        $user->setNom($dto->nom);
        $user->setEmail($dto->email);
        $user->setPassword($passwordHasher->hashPassword($user, $dto->password));

        $em->persist($user);
        $em->flush(); 

        return $this->json([
            'message' => 'User created successfully',
            'email' => $user->getEmail()
        ], Response::HTTP_CREATED);
    } 
    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(): void
    {
        // This method can be blank - it will be intercepted by the login key on your firewall
        throw new \LogicException('This method can be blank - it will be intercepted by the login key on your firewall.');
        

    }
    
}
