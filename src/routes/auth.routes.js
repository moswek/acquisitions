import express from 'express';
import { signup, signIn, signOut } from '#controllers/auth.controller.js';

const router = express.Router();

// @route   POST /api/auth/sign-up
// @desc    Register new user
// @access  Public
router.post('/sign-up', signup);

// @route   POST /api/auth/sign-in
// @desc    Authenticate user and get token
// @access  Public
router.post('/sign-in', signIn);

// @route   POST /api/auth/sign-out
// @desc    Sign out user and clear token
// @access  Private
router.post('/sign-out', signOut);

export default router;
