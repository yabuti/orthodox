const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { pool } = require('../database/connection');
const router = express.Router();

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate 6-digit verification code
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send verification email
const sendVerificationEmail = async (email, code, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Ethiopian Orthodox Church - Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1E40AF; text-align: center;">✝️ Ethiopian Orthodox Church</h2>
        <p>Dear ${name},</p>
        <p>Your verification code is:</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #DC143C;">${code}</span>
        </div>
        <p>This code expires in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
};

// POST /api/auth/register - Register new user
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    // Validate input
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    // Check if user exists
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE email = ? OR phone = ?',
      [email, phone]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email or phone already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user and mark as verified immediately (no email verification)
    const [result] = await pool.execute(
      'INSERT INTO users (full_name, email, phone, password_hash, is_verified) VALUES (?, ?, ?, ?, TRUE)',
      [fullName, email, phone, passwordHash]
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful. You can now log in.',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
});

// POST /api/auth/verify - Verify email code
router.post('/verify', async (req, res) => {
  try {
    const { email, code } = req.body;

    const [users] = await pool.execute(
      'SELECT id, verification_code, verification_expires FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = users[0];

    if (user.verification_code !== code) {
      return res.status(400).json({ success: false, message: 'Invalid verification code' });
    }

    if (new Date() > new Date(user.verification_expires)) {
      return res.status(400).json({ success: false, message: 'Verification code expired' });
    }

    // Mark as verified
    await pool.execute(
      'UPDATE users SET is_verified = TRUE, verification_code = NULL WHERE id = ?',
      [user.id]
    );

    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
});

// POST /api/auth/resend-code - Resend verification code
router.post('/resend-code', async (req, res) => {
  try {
    const { email } = req.body;

    const [users] = await pool.execute('SELECT id, full_name FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const code = generateCode();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await pool.execute(
      'UPDATE users SET verification_code = ?, verification_expires = ? WHERE email = ?',
      [code, expires, email]
    );

    await sendVerificationEmail(email, code, users[0].full_name);

    res.json({ success: true, message: 'Verification code sent' });
  } catch (error) {
    console.error('Resend code error:', error);
    res.status(500).json({ success: false, message: 'Failed to resend code' });
  }
});

// POST /api/auth/login - Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.execute(
      'SELECT id, full_name, email, phone, password_hash, is_verified FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = users[0];

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.is_verified) {
      return res.status(403).json({ success: false, message: 'Please verify your email first', needsVerification: true });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// GET /api/auth/me - Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    
    const [users] = await pool.execute(
      'SELECT id, full_name, email, phone FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user: users[0] });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

module.exports = router;
