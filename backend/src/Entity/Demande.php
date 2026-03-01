<?php

namespace App\Entity;

use App\Repository\DemandeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: DemandeRepository::class)]
#[ORM\Table(name: 'demandes')]
class Demande
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['demande:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['demande:read'])]
    private ?Utilisateur $utilisateur = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['demande:read'])]
    private ?Utilisateur $comptableMatiere = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['demande:read'])]
    private ?Utilisateur $administrateur = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['demande:read'])]
    private ?string $commentaireValidation = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['demande:read'])]
    private ?string $commentaireApprobation = null;

    #[ORM\Column]
    #[Groups(['demande:read'])]
    private ?\DateTimeImmutable $dateCreation = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $dateModification = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    #[Groups(['demande:read'])]
    private ?\DateTimeInterface $dateValidation = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    #[Groups(['demande:read'])]
    private ?\DateTimeInterface $dateApprobation = null;

    #[ORM\Column(length: 50)]
    #[Groups(['demande:read'])]
    private ?string $statut = 'en attente';

    #[ORM\OneToMany(mappedBy: 'demande', targetEntity: DemandeMateriel::class, cascade: ['persist', 'remove'])]
    #[Groups(['demande:read'])]
    private Collection $demandeMateriels;

    public function __construct()
    {
        $this->dateCreation = new \DateTimeImmutable();
        $this->demandeMateriels = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUtilisateur(): ?Utilisateur
    {
        return $this->utilisateur;
    }

    public function setUtilisateur(?Utilisateur $utilisateur): static
    {
        $this->utilisateur = $utilisateur;

        return $this;
    }

    public function getComptableMatiere(): ?Utilisateur
    {
        return $this->comptableMatiere;
    }

    public function setComptableMatiere(?Utilisateur $comptableMatiere): static
    {
        $this->comptableMatiere = $comptableMatiere;

        return $this;
    }

    public function getAdministrateur(): ?Utilisateur
    {
        return $this->administrateur;
    }

    public function setAdministrateur(?Utilisateur $administrateur): static
    {
        $this->administrateur = $administrateur;

        return $this;
    }

    public function getCommentaireValidation(): ?string
    {
        return $this->commentaireValidation;
    }

    public function setCommentaireValidation(?string $commentaireValidation): static
    {
        $this->commentaireValidation = $commentaireValidation;

        return $this;
    }

    public function getCommentaireApprobation(): ?string
    {
        return $this->commentaireApprobation;
    }

    public function setCommentaireApprobation(?string $commentaireApprobation): static
    {
        $this->commentaireApprobation = $commentaireApprobation;

        return $this;
    }

    public function getDateCreation(): ?\DateTimeImmutable
    {
        return $this->dateCreation;
    }

    public function setDateCreation(\DateTimeImmutable $dateCreation): static
    {
        $this->dateCreation = $dateCreation;

        return $this;
    }

    public function getDateModification(): ?\DateTimeInterface
    {
        return $this->dateModification;
    }

    public function setDateModification(?\DateTimeInterface $dateModification): static
    {
        $this->dateModification = $dateModification;

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

    public function getDateApprobation(): ?\DateTimeInterface
    {
        return $this->dateApprobation;
    }

    public function setDateApprobation(?\DateTimeInterface $dateApprobation): static
    {
        $this->dateApprobation = $dateApprobation;

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

    /**
     * @return Collection<int, DemandeMateriel>
     */
    public function getDemandeMateriels(): Collection
    {
        return $this->demandeMateriels;
    }

    public function addDemandeMateriel(DemandeMateriel $demandeMateriel): static
    {
        if (!$this->demandeMateriels->contains($demandeMateriel)) {
            $this->demandeMateriels->add($demandeMateriel);
            $demandeMateriel->setDemande($this);
        }

        return $this;
    }

    public function removeDemandeMateriel(DemandeMateriel $demandeMateriel): static
    {
        if ($this->demandeMateriels->removeElement($demandeMateriel)) {
            // set the owning side to null (unless already changed)
            if ($demandeMateriel->getDemande() === $this) {
                // $demandeMateriel->setDemande(null); // Cannot be null
            }
        }

        return $this;
    }
}
