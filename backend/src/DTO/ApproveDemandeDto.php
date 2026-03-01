<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class ApproveDemandeDto
{
    public function __construct(
        public readonly ?string $commentaire,

        #[Assert\NotBlank]
        #[Assert\Choice(choices: ['approuvée', 'rejetée'])]
        public readonly string $decision,
    ) {
    }
}
