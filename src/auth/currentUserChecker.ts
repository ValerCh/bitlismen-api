import {Action} from 'routing-controllers';
import {Connection} from 'typeorm';

import {User} from '../api/models/User';
import jwt from 'jsonwebtoken';

export function currentUserChecker(connection: Connection): (action: Action) => Promise<User | undefined> {
  return async function innerCurrentUserChecker(action: Action): Promise<User | undefined> {
    const token = action.request.headers.authorization.split(' ')[1];
    return jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      return {id: decodedToken.data.id, role: decodedToken.data.role};
    });
  };
}
