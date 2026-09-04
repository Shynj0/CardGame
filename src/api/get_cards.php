<?php
header('Content-Type: application/json');
require 'db.php';

try {
    $stmt = $pdo->query("SELECT * FROM cards ORDER BY id DESC");
    $cards = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($cards);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>