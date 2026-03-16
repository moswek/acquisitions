import express from 'express';
import { fetchUsers } from '#controllers/users.controller.js';

const router = express.Router();

router.get('/', fetchUsers);
router.get('/:id', (req, res) => res.send('GET /users/:id'));
router.put('/:id', (req, res) => res.send('PUT /users/:id'));
router.delete('/:id', (req, res) => res.send('DELETE /users/:id'));

export default router;
