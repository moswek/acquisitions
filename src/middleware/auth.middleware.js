import logger from '#config/logger.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';

export const authenticateToken = (req, res, next) => {
  try {
    const token = cookies.get(req, 'token');

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No access token provided',
      });
    }

    const decoded = jwttoken.verify(token);
    req.user = decoded;
    next();
  } catch (e) {
    logger.warn('Authentication failed', { error: e.message });
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }
};

export const requireRole = roles => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'No access token provided',
    });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'You do not have permission to perform this action',
    });
  }
  next();
};
