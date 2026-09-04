<?php
header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;
$name_en = $data['name_en'] ?? '';
$name_pt = $data['name_pt'] ?? '';
$game_category = $data['game_category'] ?? '';
$edition = $data['edition'] ?? '';
$image_url = $data['image_url'] ?? '';
$rarity = $data['rarity'] ?? '';

if(empty($name_en) || empty($game_category) || empty($edition)) {
    echo json_encode(['success' => false, 'message' => 'Preencha os campos obrigatórios.']);
    exit;
}

try {
    if ($id) {
        $stmt = $pdo->prepare("UPDATE cards SET name_en=?, name_pt=?, game_category=?, edition=?, image_url=?, rarity=? WHERE id=?");
        $stmt->execute([$name_en, $name_pt, $game_category, $edition, $image_url, $rarity, $id]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO cards (name_en, name_pt, game_category, edition, image_url, rarity) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$name_en, $name_pt, $game_category, $edition, $image_url, $rarity]);
    }
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro no banco: ' . $e->getMessage()]);
}
?>