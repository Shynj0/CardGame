<?php
header('Content-Type: application/json');
require 'db.php';

$id = $_GET['id'] ?? null;

if ($id) {
    $stmt = $pdo->prepare("SELECT * FROM cards WHERE id = ?");
    $stmt->execute([$id]);
    $card = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($card);
} else {
    echo json_encode(['error' => 'ID não informado']);
}
?>