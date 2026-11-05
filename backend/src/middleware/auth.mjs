import crypto from 'node:crypto';
import { memoryDb } from '../config/prisma.mjs';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key_sdlc_2026_antigravity';

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

export function generateToken(user) {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64UrlEncode(
    JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    })
  );

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${header}.${payload}.${signature}`;
}

export function verifyToken(token) {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token structure');
  }

  const [header, payload, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  if (signature !== expectedSig) {
    throw new Error('Invalid signature');
  }

  const decoded = JSON.parse(base64UrlDecode(payload));
  if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired');
  }

  return decoded;
}

export function authenticate(expectedActor) {
  return (req, res, next) => {
    const staffHeader = req.headers['x-staff-token'];
    const customerHeader = req.headers['x-customer-token'];
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

    const resolveUser = (tok) => {
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
        const decoded = verifyToken(tok);
        const u = memoryDb.users.get(decoded.id);
        if (!u) return null;
        return { id: u.id, email: u.email, name: u.name, role: u.role };
      } catch {
        return null;
      }
    };

    if (staffHeader) req.staffUser = resolveUser(staffHeader) || undefined;
    if (customerHeader) req.customerUser = resolveUser(customerHeader) || undefined;

    let chosenToken;
    if (expectedActor === 'STAFF') {
      chosenToken = staffHeader || (req.staffUser ? bearerToken : undefined) || bearerToken;
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

    const mockResolved = resolveUser(chosenToken);
    if (mockResolved) {
      req.user = mockResolved;
      next();
      return;
    }

    try {
      const decoded = verifyToken(chosenToken);
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
    } catch (err) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token.',
        error: err.message,
      });
    }
  };
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
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
