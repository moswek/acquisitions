import logger from '#config/logger.js';
import { signupSchema, signInSchema } from '#validations/auth.validation.js';
import { formatValidationError } from '#utils/format.js';
import { createUser, authenticateUser } from '#services/auth.service.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';

export const signup = async (req, res, next) => {
  try {
    const validationResult = signupSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { name, email, password, role } = validationResult.data;

    // AUTH SERVICE
    const user = await createUser({ name, email, password, role });
    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, 'token', token);
    logger.info(`User registered successfully: ${email}`);
    res.status(201).json({
      message: 'User registered',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    logger.error('Signup error', e);
    if (e.message === 'User with this email already exists') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    next(e);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const validationResult = signInSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;

    // AUTH SERVICE
    const user = await authenticateUser({ email, password });
    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, 'token', token);
    logger.info(`User signed in successfully: ${email}`);
    res.status(200).json({
      message: 'User signed in',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    logger.error('Sign-in error', e);
    if (e.message === 'User not found' || e.message === 'Invalid password') {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    next(e);
  }
};

export const signOut = async (req, res, next) => {
  try {
    const token = cookies.get(req, 'token');
    
    if (!token) {
      logger.info('Sign-out attempted with no active session');
      return res.status(200).json({ 
        message: 'User signed out successfully',
        note: 'No active session was found'
      });
    }

    try {
      // Verify token to get user info for logging
      const decoded = jwttoken.verify(token);
      cookies.clear(res, 'token');
      logger.info(`User signed out successfully: ${decoded.email}`);
    } catch (verifyError) {
      // Token is invalid, but still clear it
      cookies.clear(res, 'token');
      logger.info('Invalid token cleared during sign-out');
    }
    
    res.status(200).json({
      message: 'User signed out successfully',
    });
  } catch (e) {
    logger.error('Sign-out error', e);
    next(e);
  }
};
