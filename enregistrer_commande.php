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
    $type_commande = trim($_POST["type_commande"] ?? "");
    $adresse = trim($_POST["adresse"] ?? "");
    $note = trim($_POST["note"] ?? "");
    $total = floatval($_POST["total"] ?? 0);
    $produits_json = $_POST["produits"] ?? "";

    // Vérifications
    if ($nom === "") {
        throw new Exception("Le nom est obligatoire.");
    }

    if ($telephone === "") {
        throw new Exception("Le numéro de téléphone est obligatoire.");
    }

    if (!in_array($type_commande, ["livraison", "retrait"], true)) {
        throw new Exception("Type de commande invalide.");
    }

    if ($type_commande === "livraison" && $adresse === "") {
        throw new Exception("L'adresse de livraison est obligatoire.");
    }

    if ($total <= 0) {
        throw new Exception("Le montant de la commande est invalide.");
    }

    // Convertir les produits JSON
    $produits = json_decode($produits_json, true);

    if (!is_array($produits) || empty($produits)) {
        throw new Exception("Le panier est vide.");
    }

    // Démarrer une transaction
    $pdo->beginTransaction();

    // Enregistrer la commande
    $sql = "
        INSERT INTO commandes
        (nom_client, telephone, type_commande, adresse, note, total)
        VALUES
        (:nom, :telephone, :type_commande, :adresse, :note, :total)
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":nom" => $nom,
        ":telephone" => $telephone,
        ":type_commande" => $type_commande,
        ":adresse" => $adresse,
        ":note" => $note,
        ":total" => $total
    ]);

    // Récupérer l'identifiant de la commande
    $commande_id = $pdo->lastInsertId();

    // Préparer l'insertion des produits
    $sqlProduit = "
        INSERT INTO details_commande
        (commande_id, produit, prix, quantite, sous_total)
        VALUES
        (:commande_id, :produit, :prix, :quantite, :sous_total)
    ";

    $stmtProduit = $pdo->prepare($sqlProduit);

    foreach ($produits as $produit) {

        $nomProduit = trim($produit["name"] ?? "");
        $prix = floatval($produit["price"] ?? 0);
        $quantite = intval($produit["quantity"] ?? 0);

        if ($nomProduit === "" || $prix <= 0 || $quantite <= 0) {
            throw new Exception("Un produit de la commande est invalide.");
        }

        $sousTotal = $prix * $quantite;

        $stmtProduit->execute([
            ":commande_id" => $commande_id,
            ":produit" => $nomProduit,
            ":prix" => $prix,
            ":quantite" => $quantite,
            ":sous_total" => $sousTotal
        ]);
    }

    // Valider toutes les opérations
    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Commande enregistrée avec succès.",
        "commande_id" => $commande_id
    ]);

} catch (Exception $e) {

    // Annuler la transaction en cas d'erreur
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}