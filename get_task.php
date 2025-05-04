<?php
require_once 'config.php';

header('Content-Type: application/json');

try {
    if (!isset($_GET['id'])) {
        throw new Exception('Task ID is required');
    }

    $taskId = (int)$_GET['id'];
    
    $stmt = $db->prepare("SELECT * FROM tasks WHERE id = :id");
    $stmt->bindParam(':id', $taskId, PDO::PARAM_INT);
    $stmt->execute();
    
    $task = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$task) {
        throw new Exception('Task not found');
    }
    
    echo json_encode([
        'success' => true,
        'task' => [
            'id' => $task['id'],
            'title' => $task['title'],
            'description' => $task['description'],
            'status' => $task['status'],
            'due_date' => $task['due_date'],
            'created_at' => $task['created_at']
        ]
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} 