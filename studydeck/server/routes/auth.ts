import { Router } from 'express';
import { v4 as uuid } from 'uuid';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', (req, res) => {
  const { email, password } = req.body;
  // Stub — in production, hash password with bcrypt and store
  res.status(201).json({ id: uuid(), email, token: 'stub-jwt-token', refresh_token: 'stub-refresh-token' });
});

// POST /api/v1/auth/login
router.post('/login', (req, res) => {
  const { email } = req.body;
  res.json({ id: 'user-1', email, token: 'stub-jwt-token', refresh_token: 'stub-refresh-token' });
});

// POST /api/v1/auth/refresh
router.post('/refresh', (_req, res) => {
  res.json({ token: 'stub-new-jwt-token' });
});

// DELETE /api/v1/auth/account
router.delete('/account', (_req, res) => {
  res.json({ deleted: true, message: 'Account and all data deleted.' });
});

export default router;
