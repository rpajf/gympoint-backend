import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new Error('Token not provided');
      /* return res.status(401).json({ error: 'Token not provided' }); */
    }

    const [, token] = authHeader.split(' ');
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.decoded = decoded.id;
    /* o id do usuario está no req */

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
