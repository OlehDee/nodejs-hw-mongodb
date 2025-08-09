import { Router } from 'express';

import {
  registerController,
  loginController,
  refreshSessionController,
  logoutController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';
import {
  authRegisterSchema,
  authLoginSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
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

router.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default router;