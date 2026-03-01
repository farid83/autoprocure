<?php

namespace App\Entity;

use App\Repository\DemandeMaterielRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: DemandeMaterielRepository::class)]
#[ORM\Table(name: 'demande_materiels')]
class DemandeMateriel
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['demande:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'demandeMateriels')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Demande $demande = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['demande:read'])]
    private ?Materiel $materiel = null;

    #[ORM\Column]
    #[Groups(['demande:read'])]
    private ?int $quantiteDemandee = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['demande:read'])]
    private ?int $quantiteAccordee = null;

    #[ORM\Column(length: 50)]
    #[Groups(['demande:read'])]
    private ?string $statut = 'en attente';

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $dateValidation = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $dateCreation = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $dateModification = null;

    public function __construct()
    {
        $this->dateCreation = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDemande(): ?Demande
    {
        return $this->demande;
    }

    public function setDemande(?Demande $demande): static
    {
        $this->demande = $demande;

        return $this;
    }

    public function getMateriel(): ?Materiel
    {
        return $this->materiel;
    }

    public function setMateriel(?Materiel $materiel): static
    {
        $this->materiel = $materiel;

        return $this;
    }

    public function getQuantiteDemandee(): ?int
    {
        return $this->quantiteDemandee;
    }

    public function setQuantiteDemandee(int $quantiteDemandee): static
    {
        $this->quantiteDemandee = $quantiteDemandee;

        return $this;
    }

    public function getQuantiteAccordee(): ?int
    {
        return $this->quantiteAccordee;
    }

    public function setQuantiteAccordee(?int $quantiteAccordee): static
    {
        $this->quantiteAccordee = $quantiteAccordee;

        return $this;
    }

    public function getStatut(): ?string
    {
        return $this->statut;
    }

    public function setStatut(string $statut): static
    {
        $this->statut = $statut;

        return $this;
    }

    public function getDateValidation(): ?\DateTimeInterface
    {
        return $this->dateValidation;
    }

    public function setDateValidation(?\DateTimeInterface $dateValidation): static
    {
        $this->dateValidation = $dateValidation;

        return $this;
    }
}
