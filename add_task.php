<?php
require_once 'config.php';

header('Content-Type: application/json');

try {
    $title = trim($_POST['title']);
    $description = trim($_POST['description']);
    $due_date = !empty($_POST['due_date']) ? $_POST['due_date'] : null;
    
    if (empty($title)) {
        throw new Exception('Title is required');
    }
    
    if ($due_date && strtotime($due_date) < strtotime(date('Y-m-d'))) {
        throw new Exception('Due date cannot be in the past');
    }
    
    $stmt = $db->prepare("INSERT INTO tasks (title, description, due_date) VALUES (:title, :description, :due_date)");
    $stmt->bindParam(':title', $title, PDO::PARAM_STR);
    $stmt->bindParam(':description', $description, PDO::PARAM_STR);
    $stmt->bindParam(':due_date', $due_date, PDO::PARAM_STR);
    $stmt->execute();
    
    $taskId = $db->lastInsertId();
    
    // Get the newly added task
    $stmt = $db->prepare("SELECT * FROM tasks WHERE id = :id");
    $stmt->bindParam(':id', $taskId, PDO::PARAM_INT);
    $stmt->execute();
    $task = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'task' => [
            'id' => $task['id'],
            'title' => htmlspecialchars($task['title']),
            'description' => htmlspecialchars($task['description']),
            'due_date' => $task['due_date'],
            'status' => $task['status']
        ]
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} 