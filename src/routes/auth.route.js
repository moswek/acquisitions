import express from 'express';

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/sign-up', (req, res) => {
  res.send(' POST /api/auth/sign-up response');
});
router.post('/sign-in', (req, res) => {
  res.send(' POST /api/auth/sign-in response');
});
router.post('/sign-out', (req, res) => {
  res.send(' POST /api/auth/sign-out response');
});
