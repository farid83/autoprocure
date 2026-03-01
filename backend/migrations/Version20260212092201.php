<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260212092201 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // 1) Ajouter la colonne, mais SANS NOT NULL
        $this->addSql('ALTER TABLE materiels ADD seuil_alerte INT DEFAULT 5');

        // 2) Mettre à jour les anciennes lignes
        $this->addSql('UPDATE materiels SET seuil_alerte = 5 WHERE seuil_alerte IS NULL');

        // 3) Ajouter la contrainte NOT NULL
        $this->addSql('ALTER TABLE materiels ALTER COLUMN seuil_alerte SET NOT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE materiels DROP seuil_alerte');
    }
}
