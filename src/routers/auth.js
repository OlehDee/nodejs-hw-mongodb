import { Router } from 'express';

import {
  registerController,
  loginController,
  refreshSessionController,
  logoutController,
} from '../controllers/auth.js';
import { authRegisterSchema, authLoginSchema } from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = Router();

router.post(
  '/register',
  validateBody(authRegisterSchema),
  ctrlWrapper(registerController),
);

router.post(
  '/login',
  validateBody(authLoginSchema),
  ctrlWrapper(loginController),
);

router.post('/refresh', ctrlWrapper(refreshSessionController));

router.post('/logout', ctrlWrapper(logoutController));

export default router;