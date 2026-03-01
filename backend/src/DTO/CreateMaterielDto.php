<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class CreateMaterielDto
{
    public function __construct(
        #[Assert\NotBlank]
        public readonly string $nom,

        public readonly ?string $description,

        #[Assert\NotBlank]
        public readonly int $categorieId,

        #[Assert\NotBlank]
        #[Assert\PositiveOrZero]
        public readonly int $quantiteTotale,

        #[Assert\NotBlank]
        #[Assert\Choice(choices: ['neuf', 'usagé', 'défectueux'])]
        public readonly string $etat,

        #[Assert\NotNull]
        #[Assert\PositiveOrZero]
        public readonly int $seuilAlerte = 5,
    ) {
    }
}
