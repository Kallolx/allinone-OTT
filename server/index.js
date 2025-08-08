const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const pool = require('./db');

dotenv.config();

// Function to automatically deactivate expired users
async function deactivateExpiredUsers() {
  try {
    const [result] = await pool.query(
      'UPDATE users SET status = "inactive" WHERE expires_at < NOW() AND expires_at IS NOT NULL AND status = "active"'
    );
    if (result.affectedRows > 0) {
      console.log(`${result.affectedRows} expired user(s) automatically deactivated at ${new Date().toISOString()}`);
    }
  } catch (error) {
    console.error('Error deactivating expired users:', error);
  }
}

// Run the deactivation check every minute (60000 ms)
setInterval(deactivateExpiredUsers, 60000);

// Run once on server start
deactivateExpiredUsers();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['https://allinoneott.com', 'http://localhost:8080', '*'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Root route for API health check
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Movie Server API is running',
    version: '1.0.0'
  });
});

// API status route
// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT 1');
    res.json({
      status: 'success',
      message: 'Database connection successful',
      data: result
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});

// Admin Login Route
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Get admin from database
    const [admins] = await pool.query(
      'SELECT * FROM admin WHERE username = ?',
      [username]
    );

    if (admins.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = admins[0];

    // Verify password - try both password_hash and password columns
    const isValidPassword = await bcrypt.compare(
      password, 
      admin.password_hash || admin.password // try both column names
    );
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Send success response
    res.json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.sqlMessage || error.message
    });
  }
});

// User Management Routes
app.post('/api/users', async (req, res) => {
  try {
    const { full_name, phone_number, is_adult, status, admin_id, duration } = req.body;

    // Generate username from full name
    const baseName = full_name.toLowerCase().replace(/[^a-z]/g, "");
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const username = `${baseName}${randomNum}`;

    // Calculate expiry date based on duration
    let expires_at = null;
    if (duration && duration !== 'unlimited') {
      const now = new Date();
      switch (duration) {
        case '1_week':
          expires_at = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        case '15_days':
          expires_at = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
          break;
        case '1_month':
          expires_at = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          break;
        case '3_months':
          expires_at = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
          break;
        case '6_months':
          expires_at = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);
          break;
        default:
          expires_at = null;
      }
    }

    // Create user
    const [result] = await pool.query(
      'INSERT INTO users (full_name, phone_number, username, is_adult, status, expires_at, created_by, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [full_name, phone_number, username, is_adult, status, expires_at, admin_id, duration || 'unlimited']
    );

    // Get created user
    const [users] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(users[0]);
  } catch (error) {
    console.error('Create user error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Phone number already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Get Users List
app.get('/api/users', async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT * FROM users ORDER BY created_at DESC'
    );
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify User Login
app.post('/api/users/verify', async (req, res) => {
  try {
    const { username } = req.body;

    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ? AND status = "active"',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid username or inactive account' });
    }

    const user = users[0];

    // Additional check for expired users (in case the cron hasn't run yet)
    if (user.expires_at && new Date() > new Date(user.expires_at)) {
      // Auto-deactivate this specific expired user
      await pool.query(
        'UPDATE users SET status = "inactive" WHERE id = ?',
        [user.id]
      );
      return res.status(401).json({ error: 'Account has expired. Please contact admin.' });
    }

    // Convert is_adult to boolean for frontend consistency
    const userResponse = {
      ...user,
      is_adult: user.is_adult === 1
    };

    res.json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update User
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, phone_number, is_adult, status, duration } = req.body;

    // Convert is_adult boolean to 0 or 1 for MySQL
    const isAdultValue = is_adult ? 1 : 0;

    // Calculate expiry date based on duration if provided
    let expires_at = null;
    if (duration !== undefined) {
      if (duration && duration !== 'unlimited') {
        const now = new Date();
        switch (duration) {
          case '1_week':
            expires_at = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            break;
          case '15_days':
            expires_at = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
            break;
          case '1_month':
            expires_at = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            break;
          case '3_months':
            expires_at = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
            break;
          case '6_months':
            expires_at = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);
            break;
          default:
            expires_at = null;
        }
      }

      // Update user with expiry and duration
      await pool.query(
        'UPDATE users SET full_name = ?, phone_number = ?, is_adult = ?, status = ?, expires_at = ?, duration = ? WHERE id = ?',
        [full_name, phone_number, isAdultValue, status, expires_at, duration || 'unlimited', id]
      );
    } else {
      await pool.query(
        'UPDATE users SET full_name = ?, phone_number = ?, is_adult = ?, status = ? WHERE id = ?',
        [full_name, phone_number, isAdultValue, status, id]
      );
    }

    // Get updated user
    const [users] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Update user error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Phone number already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Delete User
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const [users] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user
    await pool.query(
      'DELETE FROM users WHERE id = ?',
      [id]
    );

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Deactivate Expired Users (Admin endpoint)
app.post('/api/admin/deactivate-expired', async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE users SET status = "inactive" WHERE expires_at IS NOT NULL AND expires_at <= NOW() AND status = "active"'
    );

    res.json({
      success: true,
      message: `${result.affectedRows} expired users have been deactivated`,
      deactivatedCount: result.affectedRows
    });
  } catch (error) {
    console.error('Deactivate expired users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin Management Routes

// Change Admin Password
app.put('/api/admin/:id/password', async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Input validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    // Get admin from database
    const [admins] = await pool.query(
      'SELECT * FROM admin WHERE id = ?',
      [id]
    );

    if (admins.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const admin = admins[0];

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword, 
      admin.password_hash || admin.password
    );
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query(
      'UPDATE admin SET password_hash = ? WHERE id = ?',
      [hashedNewPassword, id]
    );

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Feedback Routes

// Submit Feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const { name, email, message, rating, username } = req.body;

    // Input validation
    if (!name || !message || !rating) {
      return res.status(400).json({ error: 'Name, message, and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Insert feedback into database with pending status
    const [result] = await pool.query(
      'INSERT INTO feedbacks (name, email, message, rating, username, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [name, email || null, message, rating, username || null, 'pending']
    );

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      feedbackId: result.insertId
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get All Feedbacks (Admin only)
app.get('/api/feedback', async (req, res) => {
  try {
    const [feedbacks] = await pool.query(
      'SELECT * FROM feedbacks ORDER BY created_at DESC'
    );

    res.json(feedbacks);
  } catch (error) {
    console.error('Get feedbacks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Public Reviews (for footer display)
app.get('/api/feedback/public', async (req, res) => {
  try {
    // Get only approved reviews with rating >= 4 for public display
    const [feedbacks] = await pool.query(
      'SELECT id, name, message, rating, created_at FROM feedbacks WHERE status = ? AND rating >= 4 ORDER BY created_at DESC LIMIT 20',
      ['approved']
    );

    res.json(feedbacks);
  } catch (error) {
    console.error('Get public reviews error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve Feedback (Admin only)
app.put('/api/feedback/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if feedback exists
    const [feedbacks] = await pool.query(
      'SELECT * FROM feedbacks WHERE id = ?',
      [id]
    );

    if (feedbacks.length === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    // Update feedback status to approved
    await pool.query(
      'UPDATE feedbacks SET status = ? WHERE id = ?',
      ['approved', id]
    );

    res.json({ success: true, message: 'Feedback approved successfully' });
  } catch (error) {
    console.error('Approve feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reject Feedback (Admin only)
app.put('/api/feedback/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if feedback exists
    const [feedbacks] = await pool.query(
      'SELECT * FROM feedbacks WHERE id = ?',
      [id]
    );

    if (feedbacks.length === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    // Update feedback status to rejected
    await pool.query(
      'UPDATE feedbacks SET status = ? WHERE id = ?',
      ['rejected', id]
    );

    res.json({ success: true, message: 'Feedback rejected successfully' });
  } catch (error) {
    console.error('Reject feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete Feedback (Admin only)
app.delete('/api/feedback/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if feedback exists
    const [feedbacks] = await pool.query(
      'SELECT * FROM feedbacks WHERE id = ?',
      [id]
    );

    if (feedbacks.length === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    // Delete feedback
    await pool.query('DELETE FROM feedbacks WHERE id = ?', [id]);

    res.json({ success: true, message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/adult-password - Get current adult page password
app.get('/api/admin/adult-password', async (req, res) => {
  try {
    const query = 'SELECT password, updated_at FROM adult_page_settings ORDER BY id DESC LIMIT 1';
    const [rows] = await pool.query(query);
    
    if (rows.length === 0) {
      // If no password exists, create default one
      const insertQuery = 'INSERT INTO adult_page_settings (password) VALUES (?)';
      await pool.query(insertQuery, ['123456']);
      return res.json({ password: '123456', updated_at: new Date() });
    }
    
    res.json({ password: rows[0].password, updated_at: rows[0].updated_at });
  } catch (error) {
    console.error('Error fetching adult page password:', error);
    res.status(500).json({ error: 'Failed to fetch adult page password' });
  }
});

// PUT /api/admin/adult-password - Update adult page password
app.put('/api/admin/adult-password', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    
    if (password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters long' });
    }
    
    // Update or insert the password
    const checkQuery = 'SELECT id FROM adult_page_settings LIMIT 1';
    const [existing] = await pool.query(checkQuery);
    
    if (existing.length > 0) {
      // Update existing password
      const updateQuery = 'UPDATE adult_page_settings SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      await pool.query(updateQuery, [password, existing[0].id]);
    } else {
      // Insert new password
      const insertQuery = 'INSERT INTO adult_page_settings (password) VALUES (?)';
      await pool.query(insertQuery, [password]);
    }
    
    res.json({ 
      message: 'Adult page password updated successfully',
      password: password,
      updated_at: new Date()
    });
  } catch (error) {
    console.error('Error updating adult page password:', error);
    res.status(500).json({ error: 'Failed to update adult page password' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
