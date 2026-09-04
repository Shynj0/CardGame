CREATE DATABASE IF NOT EXISTS firecards;
USE firecards;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_pt VARCHAR(255),
    game_category ENUM('magic', 'pokemon', 'yugioh') NOT NULL,
    edition VARCHAR(100) NOT NULL,
    image_url VARCHAR(500),
    rarity VARCHAR(50)
);

-- Senha de teste: 'admin123' (hash gerado com password_hash do PHP)
INSERT INTO users (email, password_hash) VALUES 
('admin@firecards.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');