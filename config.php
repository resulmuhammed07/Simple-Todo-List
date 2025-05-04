<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'todolist');
define('DB_USER', 'root');
define('DB_PASS', '');

try {
    $db = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->exec("SET NAMES 'utf8'");
} catch(PDOException $e) {
    echo "Bağlantı hatası: " . $e->getMessage();
    die();
}
?> 