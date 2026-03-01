<?php
require 'vendor/autoload.php';
$conn = \Doctrine\DBAL\DriverManager::getConnection(['url' => 'postgresql://anjtech:RPtEwka3q8rX2l3wVqwk@127.0.0.1:5432/inventory_api_db?serverVersion=16&charset=utf8']);
$stmt = $conn->prepare('SELECT email, roles FROM utilisateurs');
$result = $stmt->executeQuery();
while ($row = $result->fetchAssociative()) {
    echo $row['email'] . ': ' . $row['roles'] . PHP_EOL;
}
