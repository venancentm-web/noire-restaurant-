<?php

header('Content-Type: application/json; charset=utf-8');

require_once "connexion.php";

try {

    // Vérifier que la requête est bien en POST
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        throw new Exception("Méthode non autorisée.");
    }

    // Récupérer les données envoyées
    $nom = trim($_POST["nom"] ?? "");
    $telephone = trim($_POST["telephone"] ?? "");
    $date = trim($_POST["date"] ?? "");
    $heure = trim($_POST["heure"] ?? "");
    $nombre_personnes = intval($_POST["nombre_personnes"] ?? 0);
    $message = trim($_POST["message"] ?? "");

    // Vérifications
    if ($nom === "") {
        throw new Exception("Le nom est obligatoire.");
    }

    if ($telephone === "") {
        throw new Exception("Le numéro de téléphone est obligatoire.");
    }

    // Date au format AAAA-MM-JJ
    $dateObj = DateTime::createFromFormat("Y-m-d", $date);
    if (!$dateObj || $dateObj->format("Y-m-d") !== $date) {
        throw new Exception("La date de réservation est invalide.");
    }

    // Interdire les dates passées
    $aujourdHui = new DateTime("today");
    if ($dateObj < $aujourdHui) {
        throw new Exception("La date de réservation est déjà passée.");
    }

    // Heure au format HH:MM
    if (!preg_match('/^([01]\d|2[0-3]):([0-5]\d)$/', $heure)) {
        throw new Exception("L'heure de réservation est invalide.");
    }

    if ($nombre_personnes < 1 || $nombre_personnes > 8) {
        throw new Exception("Le nombre de personnes est invalide (1 à 8).");
    }

    // Enregistrer la réservation
    $sql = "
        INSERT INTO reservations
        (nom_client, telephone, date_reservation, heure_reservation, nombre_personnes, message)
        VALUES
        (:nom, :telephone, :date, :heure, :nombre_personnes, :message)
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":nom" => $nom,
        ":telephone" => $telephone,
        ":date" => $date,
        ":heure" => $heure,
        ":nombre_personnes" => $nombre_personnes,
        ":message" => $message
    ]);

    $reservation_id = $pdo->lastInsertId();

    echo json_encode([
        "success" => true,
        "message" => "Réservation enregistrée avec succès.",
        "reservation_id" => $reservation_id
    ]);

} catch (Exception $e) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
