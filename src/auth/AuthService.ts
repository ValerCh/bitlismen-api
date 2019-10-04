import {Service} from 'typedi';
import {OrmRepository} from 'typeorm-typedi-extensions';

import {User} from '../api/models/User';
import {UsersRepository} from '../api/repositories/UsersRepository';
import jwt from 'jsonwebtoken';

@Service()
export class AuthService {

  constructor(
    @OrmRepository() private usersRepository: UsersRepository
  ) {
  }

  public async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
      relations: ['role', 'role.permissions'],
    });

    if (user !== undefined) {

      if (await User.comparePassword(user, password)) {
        return user;
      }

      return undefined;
    }

    return undefined;

  }

  public validateToken(request: any): boolean {

    if (request.headers.authorization) {
      const token = request.headers.authorization.split(' ')[1];
      return jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        console.log(decodedToken);
        return !(err || !decodedToken);
      });
    }

    return false;
  }

}
