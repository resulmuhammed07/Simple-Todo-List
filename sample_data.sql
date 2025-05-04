USE todolist;

INSERT INTO tasks (title, description, status, due_date, created_at) VALUES
('Project Presentation', 'Prepare slides for the client meeting', 'pending', DATE_ADD(CURDATE(), INTERVAL 2 DAY), NOW()),
('Weekly Report', 'Complete and submit weekly progress report', 'pending', DATE_ADD(CURDATE(), INTERVAL 1 DAY), NOW()),
('Team Meeting', 'Organize team meeting for project updates', 'completed', DATE_ADD(CURDATE(), INTERVAL -1 DAY), NOW()),
('Code Review', 'Review pull requests from the development team', 'pending', DATE_ADD(CURDATE(), INTERVAL 3 DAY), NOW()),
('Database Backup', 'Perform monthly database backup', 'pending', DATE_ADD(CURDATE(), INTERVAL 5 DAY), NOW()),
('Client Call', 'Follow up call with client about new requirements', 'completed', CURDATE(), NOW()),
('Bug Fixes', 'Fix reported bugs in the login module', 'pending', DATE_ADD(CURDATE(), INTERVAL 1 DAY), NOW()),
('Documentation', 'Update API documentation', 'pending', DATE_ADD(CURDATE(), INTERVAL 4 DAY), NOW()),
('Server Maintenance', 'Schedule server maintenance window', 'completed', DATE_ADD(CURDATE(), INTERVAL -2 DAY), NOW()),
('Security Audit', 'Conduct monthly security audit', 'pending', DATE_ADD(CURDATE(), INTERVAL 7 DAY), NOW()),
('Email Campaign', 'Design and schedule monthly newsletter', 'pending', DATE_ADD(CURDATE(), INTERVAL 3 DAY), NOW()),
('Performance Review', 'Complete team performance evaluations', 'pending', DATE_ADD(CURDATE(), INTERVAL 10 DAY), NOW()); 