<?php

namespace App\DTO;

use Doctrine\ORM\Mapping\PropertyAccessors\ReadonlyAccessor;
use Symfony\Component\Validator\Constraints as Assert;

class RegisterUserDto
{
    public function __construct(
        #[Assert\NotBlank(message: "Le nom n'est pas renseigné")]
        public readonly string $nom,

        #[Assert\NotBlank(message: "L'email est obligatoire.")]
        #[Assert\Email(message: "Email invalide")]
        public readonly string $email,

        #[Assert\NotBlank(message: "Mot de passe doit pas être vide")]
        #[Assert\Length(
            min: 12,
            minMessage: "Le mot de passe doit contenir au moins {{ limit }} caractères"
        )]
        public readonly string $password,

        #[Assert\NotBlank(message: "La confirmation du mot de passe est obligatoire.")]
        #[Assert\EqualTo(
            propertyPath: "password",
            message: "Les mots de passe ne correspondent pas."
        )]
        public readonly string $passwordConfirmation,
    ) {}
}
