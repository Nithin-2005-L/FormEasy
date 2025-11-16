import express from 'express';
import {
  register,
  login,
  googleCallback,
  getCurrentUser,
  updateProfile,
  changePassword,
  logout
} from '../controllers/authController.js';
import { authMiddleware, asyncHandler } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Public routes
 */
// Register new user
router.post('/register', asyncHandler(register));

// Login with email and password
router.post('/login', asyncHandler(login));

// Google OAuth callback
router.post('/google', asyncHandler(googleCallback));

/**
 * Protected routes - require authentication
 */
// Get current user
router.get('/me', authMiddleware, asyncHandler(getCurrentUser));

// Update profile
router.put('/profile', authMiddleware, asyncHandler(updateProfile));

// Change password
router.post('/change-password', authMiddleware, asyncHandler(changePassword));

// Logout
router.post('/logout', authMiddleware, asyncHandler(logout));

export default router;
