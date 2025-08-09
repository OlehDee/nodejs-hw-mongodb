import {
  register,
  login,
  refreshSession,
  logout,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';

export async function registerController(req, res) {
  const data = await register(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data,
  });
}

function setupSession(res, session) {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
}

export async function loginController(req, res) {
  const session = await login(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function refreshSessionController(req, res) {
  const session = await refreshSession({
    _id: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function logoutController(req, res) {
  if (req.cookies.sessionId) {
    await logout(req.cookies.sessionId);
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
}

export async function requestResetEmailController(req, res) {
  await requestResetToken(req.body.email);
  res.json({
    message: 'Reset password email was successfully sent!',
    status: 200,
    data: {},
  });
}

export async function resetPasswordController(req, res) {
  await resetPassword(req.body);

  res.json({
    status: 200,
    message: 'Password was successfully reset!',
    data: {},
  });
}