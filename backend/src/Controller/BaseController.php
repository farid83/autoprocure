<?php

namespace App\Controller;

use App\Entity\Utilisateur;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class BaseController extends AbstractController
{
    public function getCurrentUser(): Utilisateur
    {
        /** @var \App\Entity\Utilisateur */
        return $this->getUser();
    }
}
