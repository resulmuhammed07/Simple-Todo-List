<?php
require_once 'config.php';

header('Content-Type: application/json');

if (isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    
    // Check current status
    $stmt = $db->prepare("SELECT status, due_date FROM tasks WHERE id = :id");
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    $task = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($task) {
        $newStatus = $task['status'] === 'pending' ? 'completed' : 'pending';
        
        // Update status
        $stmt = $db->prepare("UPDATE tasks SET status = :status WHERE id = :id");
        $stmt->bindParam(':status', $newStatus, PDO::PARAM_STR);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        
        echo json_encode([
            'success' => true,
            'status' => $newStatus,
            'due_date' => $task['due_date']
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Task not found'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request'
    ]);
} 