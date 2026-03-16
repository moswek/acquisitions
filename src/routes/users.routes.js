import express from 'express';
import {
  fetchUsers,
  fetchUserById,
  updateUserById,
  deleteUserById,
} from '#controllers/users.controller.js';

const router = express.Router();

router.get('/', fetchUsers);
router.get('/:id', fetchUserById);
router.put('/:id', updateUserById);
router.delete('/:id', deleteUserById);

export default router;
