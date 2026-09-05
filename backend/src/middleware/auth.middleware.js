import { verifyToken } from '../utils/jwt.util.js';
import { User } from '../models/user/user.model.js';
import { AppError } from '../utils/asyncHandler.js';

export async function authenticate(req, _res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      throw new AppError('Authentication required', 401);
    }

    const token = header.split(' ')[1];
    const payload = verifyToken(token);

    const user = await User.findById(payload.sub);
    if (!user) {
      throw new AppError('User no longer exists', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AppError('Invalid or expired token', 401));
    }

    next(error);
  }
}
