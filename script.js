// Initial page load
document.addEventListener('DOMContentLoaded', function() {
    const loader = document.querySelector('.loader-overlay');
    loader.style.display = 'flex';
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                loader.style.opacity = '1';
            }, 200);
        }, 500);
    });
});

// Modal operations
const modalOverlay = document.querySelector('.modal-overlay');
const modal = document.querySelector('.modal');
const modalIcon = document.querySelector('.modal-icon');
const modalTitle = document.querySelector('.modal-title');
const modalMessage = document.querySelector('.modal-message');
const modalConfirmBtn = document.querySelector('.modal-btn.confirm');
const modalCancelBtn = document.querySelector('.modal-btn.cancel');

const ICONS = {
    success: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    error: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    warning: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
};

// Button Icons
const BUTTON_ICONS = {
    complete: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    undo: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"></path><path d="M3 13c0-4.97 4.03-9 9-9a9 9 0 0 1 9 9 9 9 0 0 1-9 9 9 9 0 0 1-6-2.3"></path></svg>',
    delete: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>',
    add: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>'
};

// Modal close function
function closeModal() {
    modal.classList.remove('show');
    setTimeout(() => {
        modalOverlay.style.display = 'none';
        // Clear modal content
        modalIcon.className = 'modal-icon';
        modalIcon.innerHTML = '';
        modalTitle.textContent = '';
        modalMessage.textContent = '';
        modalConfirmBtn.textContent = '';
        // Clear event listeners
        modalConfirmBtn.onclick = null;
        modalCancelBtn.onclick = null;
        modalOverlay.onclick = null;
    }, 300);
}

function showModal(type, title, message, confirmText, onConfirm = null) {
    // Clear previous event listeners
    modalConfirmBtn.onclick = null;
    modalCancelBtn.onclick = null;
    modalOverlay.onclick = null;

    // Set modal content
    modalIcon.className = `modal-icon ${type}`;
    modalIcon.innerHTML = ICONS[type];
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalConfirmBtn.textContent = confirmText;
    
    // Show modal
    modalOverlay.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);

    // Add event listeners
    modalConfirmBtn.onclick = () => {
        if (onConfirm) onConfirm();
        closeModal();
    };

    modalCancelBtn.onclick = closeModal;

    // Close modal when clicking overlay (only if no onConfirm)
    modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay && !onConfirm) {
            closeModal();
        }
    };

    // Prevent event propagation when clicking modal
    modal.onclick = (e) => {
        e.stopPropagation();
    };

    // Show cancel button only if onConfirm exists
    modalCancelBtn.style.display = onConfirm ? 'block' : 'none';
    modalCancelBtn.textContent = 'Cancel';
}

// Loader operations
const loaderOverlay = document.querySelector('.loader-overlay');
const MIN_LOADER_TIME = 300; // Minimum loader display time in ms
let loaderStartTime = 0;
let loaderTimer = null;

function showLoader() {
    // Clear any existing timers
    clearTimeout(loaderTimer);
    
    // Reset opacity and display
    loaderOverlay.style.opacity = '1';
    loaderOverlay.style.display = 'flex';
    
    // Store start time
    loaderStartTime = Date.now();
}

function hideLoader() {
    const elapsedTime = Date.now() - loaderStartTime;
    const remainingTime = Math.max(0, MIN_LOADER_TIME - elapsedTime);

    // Clear any existing timers
    clearTimeout(loaderTimer);

    // Set timer to hide loader
    loaderTimer = setTimeout(() => {
        // Fade out
        loaderOverlay.style.opacity = '0';
        
        // After fade out animation, hide completely
        setTimeout(() => {
            loaderOverlay.style.display = 'none';
            loaderOverlay.style.opacity = '1';
        }, 200); // Match this with CSS transition time
    }, remainingTime);
}

// Toggle task status
function toggleStatus(taskId) {
    showLoader();
    fetch(`toggle_status.php?id=${taskId}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success) {
            const taskElement = document.querySelector(`[data-id="${taskId}"]`);
            const targetList = data.status === 'completed' ? 
                document.getElementById('completedTasks') : 
                document.getElementById('pendingTasks');
            
            updateTaskCount(data.status === 'completed' ? 'completed' : 'pending');
            
            // Create due date HTML if exists
            let dueDateHtml = '';
            if (data.due_date) {
                const dueDate = new Date(data.due_date);
                const isOverdue = dueDate < new Date().setHours(0,0,0,0);
                dueDateHtml = `
                    <div class="task-due-date ${isOverdue ? 'overdue' : ''}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        Due: ${dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                `;
            }

            // Update task HTML
            const title = taskElement.querySelector('h3').innerHTML;
            const description = taskElement.querySelector('p').innerHTML;
            taskElement.innerHTML = `
                <h3>${title}</h3>
                <p>${description}</p>
                ${dueDateHtml}
                <div class="task-actions">
                    <button onclick="toggleStatus(${taskId})">
                        ${data.status === 'completed' ? BUTTON_ICONS.undo + ' Undo' : BUTTON_ICONS.complete + ' Complete'}
                    </button>
                    <button onclick="deleteTask(${taskId})">${BUTTON_ICONS.delete} Delete</button>
                </div>
            `;
            
            taskElement.className = `task-item${data.status === 'completed' ? ' completed' : ''}`;
            targetList.appendChild(taskElement);

            showModal(
                'success',
                'Status Updated',
                data.status === 'completed' ? 'Task completed successfully!' : 'Task moved back to pending.',
                'OK'
            );
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showModal('error', 'Error!', 'An error occurred while updating the task status.', 'OK');
    })
    .finally(() => {
        hideLoader();
    });
}

// Delete task
function deleteTask(taskId) {
    showModal(
        'warning',
        'Delete Task',
        'Are you sure you want to delete this task?',
        'Yes, Delete',
        () => {
            showLoader();
            fetch(`delete_task.php?id=${taskId}`, {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const taskElement = document.querySelector(`[data-id="${taskId}"]`);
                    const isCompleted = taskElement.classList.contains('completed');
                    taskElement.remove();
                    updateTaskCount(isCompleted ? 'completed' : 'pending', -1);
                    
                    showModal('success', 'Success!', 'Task deleted successfully.', 'OK');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showModal('error', 'Error!', 'An error occurred while deleting the task.', 'OK');
            })
            .finally(() => {
                hideLoader();
            });
        }
    );
}

// Update task count
function updateTaskCount(type, change = 1) {
    const pendingHeader = document.querySelector('.task-section:first-child h2');
    const completedHeader = document.querySelector('.task-section:last-child h2');
    
    if (type === 'completed') {
        const completedCount = document.getElementById('completedTasks').children.length + change;
        const pendingCount = document.getElementById('pendingTasks').children.length - change;
        completedHeader.textContent = `Completed Tasks (${completedCount})`;
        pendingHeader.textContent = `Pending Tasks (${pendingCount})`;
    } else {
        const pendingCount = document.getElementById('pendingTasks').children.length + change;
        const completedCount = document.getElementById('completedTasks').children.length - change;
        pendingHeader.textContent = `Pending Tasks (${pendingCount})`;
        completedHeader.textContent = `Completed Tasks (${completedCount})`;
    }
}

// Form submission
document.getElementById('taskForm').addEventListener('submit', function(e) {
    e.preventDefault();
    showLoader();
    
    const formData = new FormData(this);
    
    fetch('add_task.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Clear form
            this.reset();
            
            // Add new task to list
            const dueDateHtml = data.task.due_date ? `
                <div class="task-due-date ${new Date(data.task.due_date) < new Date().setHours(0,0,0,0) ? 'overdue' : ''}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    Due: ${new Date(data.task.due_date).toLocaleDateString('en-en', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
            ` : '';
            
            const taskHtml = `
                <div class="task-item" data-id="${data.task.id}" onclick="showTaskDetails(this)">
                    <h3>${data.task.title}</h3>
                    <p>${data.task.description}</p>
                    ${dueDateHtml}
                    <div class="task-actions">
                        <button onclick="toggleStatus(${data.task.id})">
                            ${BUTTON_ICONS.complete} Complete
                        </button>
                        <button onclick="deleteTask(${data.task.id})">
                            ${BUTTON_ICONS.delete} Delete
                        </button>
                    </div>
                </div>
            `;
            
            const pendingTasks = document.getElementById('pendingTasks');
            pendingTasks.insertAdjacentHTML('afterbegin', taskHtml);
            
            // Update task count
            updateTaskCount('pending', 1);
            
            // Show success message
            showModal('success', 'Success!', 'New task added successfully.', 'OK');
        } else {
            showModal('error', 'Error!', data.message, 'OK');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showModal('error', 'Error!', 'An error occurred while adding the task.', 'OK');
    })
    .finally(() => {
        hideLoader();
    });
});

// Update existing buttons when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Update complete/undo buttons
    document.querySelectorAll('.task-actions button:first-child').forEach(button => {
        const icon = button.textContent.trim() === 'Complete' ? BUTTON_ICONS.complete : BUTTON_ICONS.undo;
        button.innerHTML = icon + ' ' + button.textContent;
    });

    // Update delete buttons
    document.querySelectorAll('.task-actions button:last-child').forEach(button => {
        button.innerHTML = BUTTON_ICONS.delete + ' Delete';
    });

    // Update add task button
    const addButton = document.querySelector('button[name="add_task"]');
    if (addButton) {
        addButton.innerHTML = BUTTON_ICONS.add + ' Add Task';
    }
});

// Task Detail Modal Functions
const taskDetailModal = document.querySelector('.task-detail-modal-overlay');
const closeTaskDetailModal = document.querySelector('.close-modal');

function showTaskDetails(taskElement) {
    const taskId = taskElement.dataset.id;
    fetch(`get_task.php?id=${taskId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const task = data.task;
                document.querySelector('.task-detail-title').textContent = task.title;
                document.querySelector('.task-detail-description').textContent = task.description || 'No description';
                
                // Format dates
                const dueDate = task.due_date ? new Date(task.due_date).toLocaleDateString('en-en', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }) : 'No due date';
                
                const createdAt = new Date(task.created_at).toLocaleDateString('en-en', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                document.querySelector('.task-detail-due-date').textContent = `Due Date: ${dueDate}`;
                document.querySelector('.task-detail-created-at').textContent = `Created: ${createdAt}`;
                
                const statusElement = document.querySelector('.task-detail-status');
                statusElement.textContent = task.status.charAt(0).toUpperCase() + task.status.slice(1);
                statusElement.className = `task-detail-status ${task.status}`;

                taskDetailModal.style.display = 'flex';
            }
        })
        .catch(error => {
            showNotification('Error loading task details', 'error');
        });
}

closeTaskDetailModal.addEventListener('click', () => {
    taskDetailModal.style.display = 'none';
});

taskDetailModal.addEventListener('click', (e) => {
    if (e.target === taskDetailModal) {
        taskDetailModal.style.display = 'none';
    }
}); 