import createHttpError from 'http-errors';

import { SessionCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

export async function authenticate(req, res, next) {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    next(createHttpError(401, 'Please provide Authorization header'));
    return;
  }

  const [bearer, accessToken] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !accessToken) {
    next(createHttpError(401, 'Auth header should be of type Bearer'));
    return;
  }

  const session = await SessionCollection.findOne({ accessToken });

  if (!session) {
    next(createHttpError(401, 'Session not found'));
    return;
  }

  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isAccessTokenExpired) {
    next(createHttpError(401, 'Access token expired'));
    return;
  }

  const user = await UsersCollection.findById(session.userId);

  if (!user) {
    next(createHttpError(401));
    return;
  }

  req.user = user;

  next();
}