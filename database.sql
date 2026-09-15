-- =========================================================
--  NOIRÉ — Restaurant Gastronomique
--  Schéma de la base de données (identique à l'installation existante)
--  À importer dans phpMyAdmin (ou: mysql -u root < database.sql)
-- =========================================================

CREATE DATABASE IF NOT EXISTS noire_restaurant
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE noire_restaurant;

-- ---------------------------------------------------------
--  Administrateurs (back-office)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS administrateurs (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nom             VARCHAR(100)    NOT NULL,
    email           VARCHAR(150)    NOT NULL UNIQUE,
    mot_de_passe    VARCHAR(255)    NOT NULL,
    date_creation   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
--  Commandes (en-tête)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS commandes (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nom_client      VARCHAR(100)    NOT NULL,
    telephone       VARCHAR(30)     NOT NULL,
    type_commande   ENUM('livraison', 'retrait') NOT NULL,
    adresse         VARCHAR(255)    NULL,
    note            TEXT            NULL,
    total           DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    statut          ENUM('nouvelle', 'confirmee', 'preparee', 'livree', 'terminee', 'annulee') NOT NULL DEFAULT 'nouvelle',
    date_commande   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
--  Détails de commande (lignes du panier)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS details_commande (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    commande_id     INT             NOT NULL,
    produit         VARCHAR(150)    NOT NULL,
    prix            DECIMAL(10,2)   NOT NULL,
    quantite        INT             NOT NULL DEFAULT 1,
    sous_total      DECIMAL(10,2)   NOT NULL,
    CONSTRAINT fk_details_commande
        FOREIGN KEY (commande_id) REFERENCES commandes(id)
        ON DELETE CASCADE,
    INDEX idx_details_commande_id (commande_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
--  Réservations de table
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS reservations (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    nom_client          VARCHAR(100)    NOT NULL,
    telephone           VARCHAR(30)     NOT NULL,
    date_reservation    DATE            NOT NULL,
    heure_reservation   TIME            NOT NULL,
    nombre_personnes    INT             NOT NULL,
    message             TEXT            NULL,
    statut              ENUM('nouvelle', 'confirmee', 'terminee', 'annulee') NOT NULL DEFAULT 'nouvelle',
    date_creation       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
