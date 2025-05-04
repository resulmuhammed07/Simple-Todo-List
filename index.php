<?php
require 'config.php';
try {
    // Check database connection
    if (!isset($db)) {
        throw new Exception("No database connection");
    }

    $pending='pending';
    $completed='completed';

    //Prepared statements
    $pendingStmt = $db->prepare("SELECT * FROM tasks WHERE status = :stat ORDER BY 
        CASE 
            WHEN due_date IS NULL THEN 1 
            ELSE 0 
        END, 
        due_date ASC, 
        created_at DESC");
        $pendingStmt->bindParam(':stat',$pending);
    $pendingStmt->execute();
    $pendingTasks = $pendingStmt->fetchAll(PDO::FETCH_ASSOC);

    $completedStmt = $db->prepare("SELECT * FROM tasks WHERE status = :stat ORDER BY created_at DESC");
    $completedStmt->bindParam(':stat',$completed);
    $completedStmt->execute();
    $completedTasks = $completedStmt->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    error_log("Veritabanı hatası: " . $e->getMessage());
    die("Bir hata oluştu, lütfen daha sonra tekrar deneyin.");
}

// SVG ikonları için sınıf tanımlama
class Icons {
    public static function getSvgIcon($type, $width = 16, $height = 16) {
        $icons = [
            'add' => '<svg width="{w}" height="{h}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
            'complete' => '<svg width="{w}" height="{h}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
            'delete' => '<svg width="{w}" height="{h}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>'
        ];
        return str_replace(['{w}', '{h}'], [$width, $height], $icons[$type] ?? '');
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo List</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Loader Overlay -->
    <div class="loader-overlay" style="display: none;">
        <div class="loader"></div>
    </div>

    <!-- Modal Overlay -->
    <div class="modal-overlay" style="display: none;">
        <div class="modal">
            <div class="modal-icon">
                <!-- Icon content will be added by JavaScript -->
            </div>
            <h3 class="modal-title"></h3>
            <p class="modal-message"></p>
            <div class="modal-buttons">
                <button class="modal-btn confirm"></button>
                <button class="modal-btn cancel">Cancel</button>
            </div>
        </div>
    </div>

    <!-- Task Detail Modal -->
    <div class="task-detail-modal-overlay">
        <div class="task-detail-modal">
            <div class="modal-header">
                <h2>Task Details</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-content">
                <div class="task-detail-title"></div>
                <div class="task-detail-description"></div>
                <div class="task-detail-dates">
                    <div class="task-detail-due-date"></div>
                    <div class="task-detail-created-at"></div>
                </div>
                <div class="task-detail-status"></div>
            </div>
        </div>
    </div>

    <div class="container">
        <h1>Todo List</h1>
        
        <form id="taskForm" method="POST" class="task-form">
            <input type="text" name="title" placeholder="Task title" >
            <textarea name="description" placeholder="Task description"></textarea>
            <div class="form-row">
                <div class="date-input">
                    <label for="due_date">Due Date:</label>
                    <input type="date" name="due_date" id="due_date" 
                           min="<?php echo date('Y-m-d'); ?>" 
                           value="<?php echo date('Y-m-d'); ?>">
                </div>
            </div>
            <button type="submit" name="add_task"><?php echo Icons::getSvgIcon('add'); ?> Add Task</button>
        </form>

        <div class="task-sections">
            <div class="task-section">
                <h2>Pending Tasks (<?php echo count($pendingTasks); ?>)</h2>
                <div id="pendingTasks" class="task-list">
                    <?php foreach ($pendingTasks as $task): ?>
                    <div class="task-item" data-id="<?php echo $task['id']; ?>" onclick="showTaskDetails(this)">
                        <h3><?php echo htmlspecialchars($task['title']); ?></h3>
                        <p><?php echo htmlspecialchars($task['description']); ?></p>
                        <?php if ($task['due_date']): ?>
                        <div class="task-due-date <?php echo strtotime($task['due_date']) < time() ? 'overdue' : ''; ?>">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            Due: <?php echo date('M j, Y', strtotime($task['due_date'])); ?>
                        </div>
                        <?php endif; ?>
                        <div class="task-actions" onclick="event.stopPropagation();">
                            <button onclick="event.stopPropagation(); toggleStatus(<?php echo $task['id']; ?>)"><?php echo Icons::getSvgIcon('complete'); ?> Complete</button>
                            <button onclick="event.stopPropagation(); deleteTask(<?php echo $task['id']; ?>)"><?php echo Icons::getSvgIcon('delete'); ?> Delete</button>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <div class="task-section">
                <h2>Completed Tasks (<?php echo count($completedTasks); ?>)</h2>
                <div id="completedTasks" class="task-list">
                    <?php foreach ($completedTasks as $task): ?>
                    <div class="task-item completed" data-id="<?php echo $task['id']; ?>" onclick="showTaskDetails(this)">
                        <h3><?php echo htmlspecialchars($task['title']); ?></h3>
                        <p><?php echo htmlspecialchars($task['description']); ?></p>
                        <?php if ($task['due_date']): ?>
                        <div class="task-due-date <?php echo strtotime($task['due_date']) < time() ? 'overdue' : ''; ?>">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            Due: <?php echo date('M j, Y', strtotime($task['due_date'])); ?>
                        </div>
                        <?php endif; ?>
                        <div class="task-actions" onclick="event.stopPropagation();">
                            <button onclick="event.stopPropagation(); toggleStatus(<?php echo $task['id']; ?>)"><?php echo Icons::getSvgIcon('complete'); ?> Undo</button>
                            <button onclick="event.stopPropagation(); deleteTask(<?php echo $task['id']; ?>)"><?php echo Icons::getSvgIcon('delete'); ?> Delete</button>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>