import {Service} from 'typedi';
import {OrmRepository} from 'typeorm-typedi-extensions';
import uuid from 'uuid';

import {EventDispatcher, EventDispatcherInterface} from '../../decorators/EventDispatcher';
import {Logger, LoggerInterface} from '../../decorators/Logger';
import {User} from '../models/User';
import {UsersRepository} from '../repositories/UsersRepository';
import {events} from '../subscribers/events';
import {CurrentUser, Res} from 'routing-controllers';

@Service()
export class UsersService {

  constructor(
    @OrmRepository() private usersRepository: UsersRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Logger(__filename) private log: LoggerInterface
  ) {
  }

  public async find(): Promise<User[]> {
    this.log.info('Find all users');
    const users: any = await this.usersRepository.find({relations: ['role', 'role.permissions']});
    if (users.length > 0) {
      for (const user of users) {
        if (user) {
          delete user.password;
        }
      }
    } else {
      delete users.password;
    }
    return users;
  }

  public async findOne(id: string): Promise<User | undefined> {
    this.log.info('Find one user');
    return await this.usersRepository.findOne({id}, {relations: ['role', 'role.permissions']});
  }

  public async findOneByEmail(email: any): Promise<User | undefined> {
    this.log.info('Find one user');
    return await this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  public async findByResetCode(reset_code: any): Promise<User | undefined> {
    this.log.info('Find one user');
    return await this.usersRepository.findOne({
      where: {
        reset_code,
      },
    });
  }

  public async create(user: User): Promise<User> {
    this.log.info('Create a new user => ', user.toString());
    user.id = uuid.v1();
    user.password = await User.hashPassword(user.password);
    const new_User = await this.usersRepository.save(user);
    delete new_User.password;
    this.eventDispatcher.dispatch(events.user.created, new_User);
    return new_User;
  }

  public update(id: string, user: User): Promise<User> {
    this.log.info('Update a user');
    user.id = id;
    return this.usersRepository.save(user);
  }

  public async delete(id: string, @Res() res: any): Promise<void> {
    this.log.info('Delete a user');
    const deletedUser: any = await this.usersRepository.delete(id);
    if (deletedUser.raw.affectedRows === 1) {
      return res.status(200).send({message: 'User deleted successfully.'});
    } else {
      return res.status(404).send({error: 'User not found.'});
    }
  }

  public async currentUserCanDo(@CurrentUser({required: true}) rfq_user: any, @Res() res: any, canDo: any): Promise<any> {
    const currentUser = await this.findOne(rfq_user.id);
    if (currentUser.role.permissions.find(permission => permission.can_do === canDo)) {
      return true;
    }
  }

}
