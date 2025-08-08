-- Test data for user expiry system
-- Run these after creating the database structure

-- Insert test users with different expiry scenarios
INSERT INTO `users` (`full_name`, `phone_number`, `username`, `is_adult`, `status`, `expires_at`, `created_by`) VALUES

-- User that expires tomorrow (for testing expiry warning)
('John Doe', '1234567890', 'john_doe_123', 0, 'active', DATE_ADD(NOW(), INTERVAL 1 DAY), 1),

-- User that expires in 5 days (warning zone)
('Jane Smith', '1234567891', 'jane_smith_456', 1, 'active', DATE_ADD(NOW(), INTERVAL 5 DAY), 1),

-- User that expires in 1 month (safe zone)
('Bob Wilson', '1234567892', 'bob_wilson_789', 0, 'active', DATE_ADD(NOW(), INTERVAL 1 MONTH), 1),

-- User that already expired (should show in red)
('Alice Brown', '1234567893', 'alice_brown_321', 1, 'active', DATE_SUB(NOW(), INTERVAL 2 DAY), 1),

-- User with unlimited access (no expiry)
('Admin User', '1234567894', 'admin_user_999', 1, 'active', NULL, 1),

-- Inactive user with expiry
('Inactive User', '1234567895', 'inactive_user_111', 0, 'inactive', DATE_ADD(NOW(), INTERVAL 1 WEEK), 1);

-- Insert test feedback data
INSERT INTO `feedbacks` (`name`, `email`, `message`, `rating`, `username`, `status`) VALUES
('John Doe', 'john@example.com', 'Great movie collection! Love the interface.', 5, 'john_doe_123', 'approved'),
('Jane Smith', 'jane@example.com', 'Good selection but could use more recent movies.', 4, 'jane_smith_456', 'pending'),
('Bob Wilson', NULL, 'Amazing platform, highly recommended!', 5, 'bob_wilson_789', 'approved'),
('Anonymous User', 'user@example.com', 'Not bad, but the loading is slow sometimes.', 3, NULL, 'rejected');
