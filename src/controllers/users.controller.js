import logger from '#config/logger.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '#services/users.services.js';
import {
  updateUserSchema,
  userIdSchema,
} from '#validations/auth.validation.js';
import { formatValidationError } from '#utils/format.js';

export const fetchUsers = async (req, res, next) => {
  try {
    logger.info('Getting users...');
    const allUsers = await getAllUsers();
    res.json({
      message: 'Users retrieved successfully',
      users: allUsers,
      count: allUsers.length,
    });
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

export const fetchUserById = async (req, res, next) => {
  try {
    const validation = userIdSchema.safeParse(req.params);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: formatValidationError(validation.error),
      });
    }
    const { id } = validation.data;
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    logger.info(`User ${id} retrieved successfully`);
    res.json({ message: 'User retrieved successfully', user });
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    const idValidation = userIdSchema.safeParse(req.params);
    if (!idValidation.success) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: formatValidationError(idValidation.error),
      });
    }
    const { id } = idValidation.data;

    // Only allow users to update their own info unless admin
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own information',
      });
    }

    const bodyValidation = updateUserSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: formatValidationError(bodyValidation.error),
      });
    }

    const updates = bodyValidation.data;

    // Only admins can change roles
    if (updates.role && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'Forbidden', message: 'Only admins can change roles' });
    }

    const updatedUser = await updateUser(id, updates);
    logger.info(`User ${id} updated successfully`);
    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (e) {
    if (e.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    logger.error(e);
    next(e);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    const validation = userIdSchema.safeParse(req.params);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: formatValidationError(validation.error),
      });
    }
    const { id } = validation.data;

    // Only allow admins or the user themselves to delete
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only delete your own account',
      });
    }

    const result = await deleteUser(id);
    logger.info(`User ${id} deleted successfully`);
    res.json(result);
  } catch (e) {
    if (e.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    logger.error(e);
    next(e);
  }
};
