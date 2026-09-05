import { Router } from 'express';
import { register, login, getMe } from '../../controllers/auth/auth.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  registerValidation,
  loginValidation,
  validateRequest,
} from '../../validators/auth.validator.js';

const router = Router();

router.post(
  '/register',
  registerValidation,
  validateRequest,
  asyncHandler(register)
);

router.post('/login', loginValidation, validateRequest, asyncHandler(login));

router.get('/me', authenticate, asyncHandler(getMe));

export default router;
