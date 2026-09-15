<?php

/* =========================================================
   CONNEXION PDO — fonctionne en LOCAL (XAMPP) et en LIGNE
   (InfinityFree) sans modification : on détecte l'hôte.
========================================================= */

// --- Configuration LOCALE (XAMPP) ---
$config_local = [
    "host"     => "localhost",
    "dbname"   => "noire_restaurant",
    "username" => "root",
    "password" => "",
];

// --- Configuration INFINITYFREE ---
// À COMPLÉTER une seule fois avec tes identifiants
// (panneau InfinityFree → "MySQL Databases").
$config_prod = [
    "host"     => "sqlXXX.infinityfree.com",   // ex: sql123.infinityfree.com
    "dbname"   => "if0_00000000_noire",        // ex: if0_12345678_noire
    "username" => "if0_00000000",              // ex: if0_12345678
    "password" => "REMPLISSE_TON_MOT_DE_PASSE",
];

// Détection : localhost / 127.0.0.1 => local, sinon => hébergement
$http_host = $_SERVER["HTTP_HOST"] ?? "localhost";
$is_local  = ($http_host === "localhost" || $http_host === "127.0.0.1" || strpos($http_host, "localhost:") === 0);

$config = $is_local ? $config_local : $config_prod;

try {

    $pdo = new PDO(
        "mysql:host={$config['host']};dbname={$config['dbname']};charset=utf8mb4",
        $config["username"],
        $config["password"]
    );

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (PDOException $e) {

    // Réponse JSON cohérente avec les endpoints (jamais de HTML)
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        "success" => false,
        "message" => "Erreur de connexion à la base de données."
    ]);
    exit;

}
