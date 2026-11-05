import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { memoryDb } from '../config/prisma.js';
import { Role } from '../stateMachine/orderStateMachine.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
  staffUser?: AuthenticatedUser;
  customerUser?: AuthenticatedUser;
}

export function generateToken(user: { id: string; email: string; name: string; role: Role }): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
}

/**
 * Authentication middleware that supports session isolation:
 * - Checks x-staff-token for staff routes (/admin, /fulfillment)
 * - Checks x-customer-token for customer routes
 * - Falls back to standard Authorization: Bearer <token>
 */
export function authenticate(expectedActor?: 'CUSTOMER' | 'STAFF') {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const staffHeader = req.headers['x-staff-token'] as string | undefined;
    const customerHeader = req.headers['x-customer-token'] as string | undefined;
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

    // Helper to resolve user from a token
    const resolveUser = (tok?: string): AuthenticatedUser | null => {
      if (!tok) return null;
      if (tok === 'jwt_demo_charlie_admin' || tok.includes('charlie') || tok.includes('admin')) {
        const u = memoryDb.users.get('admin_001');
        if (u) return { id: u.id, email: u.email, name: u.name, role: u.role };
      }
      if (tok === 'jwt_demo_bob_warehouse' || tok.includes('bob') || tok.includes('warehouse')) {
        const u = memoryDb.users.get('ware_001');
        if (u) return { id: u.id, email: u.email, name: u.name, role: u.role };
      }
      if (tok === 'jwt_demo_alice_customer' || tok.includes('alice') || tok.includes('customer')) {
        const u = memoryDb.users.get('cust_001');
        if (u) return { id: u.id, email: u.email, name: u.name, role: u.role };
      }
      try {
        const decoded = jwt.verify(tok, config.jwtSecret) as AuthenticatedUser;
        const u = memoryDb.users.get(decoded.id);
        if (!u) return null;
        return { id: u.id, email: u.email, name: u.name, role: u.role };
      } catch {
        return null;
      }
    };

    if (staffHeader) req.staffUser = resolveUser(staffHeader) || undefined;
    if (customerHeader) req.customerUser = resolveUser(customerHeader) || undefined;

    let chosenToken: string | undefined;
    if (expectedActor === 'STAFF') {
      chosenToken = staffHeader || (req.staffUser ? bearerToken : undefined) || bearerToken;
      // In demo environment, fall back to Admin Charlie if navigating directly to staff routes
      if (!chosenToken) {
        const defaultAdmin = memoryDb.users.get('admin_001');
        if (defaultAdmin) {
          req.user = {
            id: defaultAdmin.id,
            email: defaultAdmin.email,
            name: defaultAdmin.name,
            role: defaultAdmin.role,
          };
          req.staffUser = req.user;
          next();
          return;
        }
      }
    } else if (expectedActor === 'CUSTOMER') {
      chosenToken = customerHeader || (req.customerUser ? bearerToken : undefined) || bearerToken;
    } else {
      chosenToken = bearerToken || staffHeader || customerHeader;
      // If neither is present on general routes, check if staffUser or default admin can be used
      if (!chosenToken && req.staffUser) {
        req.user = req.staffUser;
        next();
        return;
      }
    }

    if (!chosenToken) {
      res.status(401).json({
        success: false,
        message: 'Authentication token missing. Please provide a valid session token.',
      });
      return;
    }

    // Check mock demo token match first
    const mockResolved = resolveUser(chosenToken);
    if (mockResolved) {
      req.user = mockResolved;
      next();
      return;
    }

    try {
      const decoded = jwt.verify(chosenToken, config.jwtSecret) as AuthenticatedUser;

      // Verify user exists in database
      const user = memoryDb.users.get(decoded.id);
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists.',
        });
        return;
      }

      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      next();
    } catch (err: any) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token.',
        error: err.message,
      });
    }
  };
}

/**
 * Role-based guard middleware
 */
export function requireRole(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required prior to role verification.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of [${allowedRoles.join(', ')}]. Current role: ${req.user.role}`,
      });
      return;
    }

    next();
  };
}
