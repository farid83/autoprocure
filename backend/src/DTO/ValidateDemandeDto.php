<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class ValidateDemandeDto
{
    public function __construct(
        public readonly ?string $commentaire,

        #[Assert\NotBlank]
        #[Assert\All([
            new Assert\Collection(
                fields: [
                    'materielId' => [new Assert\NotBlank(), new Assert\Type('integer')],
                    'quantiteAccordee' => [new Assert\NotBlank(), new Assert\Type('integer'), new Assert\PositiveOrZero()]
                ]
            )
        ])]
        public readonly array $items,
    ) {
    }
}
