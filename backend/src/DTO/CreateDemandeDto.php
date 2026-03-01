<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class CreateDemandeDto
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\All([
            new Assert\Collection(
                fields: [
                    'materielId' => [new Assert\NotBlank(), new Assert\Type('integer')],
                    'quantite' => [new Assert\NotBlank(), new Assert\Type('integer'), new Assert\Positive()]
                ]
            )
        ])]
        public readonly array $items,
    ) {
    }
}
