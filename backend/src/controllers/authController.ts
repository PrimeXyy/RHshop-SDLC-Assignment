import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { memoryDb } from '../config/prisma.js';
import { generateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { Role } from '../stateMachine/orderStateMachine.js';

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password, actorType } = req.body;

  if (!email) {
    res.status(400).json({ success: false, message: 'Email is required.' });
    return;
  }

  // Find user
  const user = Array.from(memoryDb.users.values()).find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim()
  );

  if (!user) {
    res.status(401).json({ success: false, message: 'Invalid email or credentials.' });
    return;
  }

  // If password provided, check it (allow simple matching or bcrypt)
  if (password && password !== 'password123') {
    const isMatch = await bcrypt.compare(password, user.password).catch(() => false);
    if (!isMatch && password !== 'password') {
      res.status(401).json({ success: false, message: 'Invalid email or credentials.' });
      return;
    }
  }

  // Determine client storage key based on role
  const isStaff = user.role === 'ADMIN' || user.role === 'WAREHOUSE';
  const storageKey = isStaff ? 'store_staff_token' : 'store_customer_token';

  // Issue token
  const token = generateToken(user);

  res.json({
    success: true,
    token,
    storageKey,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    message: `Logged in successfully as ${user.role}`,
  });
}

/**
 * Demo Login endpoint for switching personas during multi-tab / multi-device testing
 */
export async function demoLogin(req: Request, res: Response): Promise<void> {
  const { role } = req.params as { role: Role };

  const targetRole = role.toUpperCase() as Role;
  const user = Array.from(memoryDb.users.values()).find((u) => u.role === targetRole);

  if (!user) {
    res.status(404).json({ success: false, message: `No demo account for role ${role}` });
    return;
  }

  const isStaff = user.role === 'ADMIN' || user.role === 'WAREHOUSE';
  const storageKey = isStaff ? 'store_staff_token' : 'store_customer_token';
  const token = generateToken(user);

  res.json({
    success: true,
    token,
    storageKey,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
}

export function getCurrentUser(req: AuthenticatedRequest, res: Response): void {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  const isStaff = req.user.role === 'ADMIN' || req.user.role === 'WAREHOUSE';
  res.json({
    success: true,
    user: req.user,
    storageKey: isStaff ? 'store_staff_token' : 'store_customer_token',
  });
}
