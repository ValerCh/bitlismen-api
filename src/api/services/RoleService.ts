import {Service} from 'typedi';
import {OrmRepository} from 'typeorm-typedi-extensions';
import uuid from 'uuid';

import {EventDispatcher, EventDispatcherInterface} from '../../decorators/EventDispatcher';
import {Logger, LoggerInterface} from '../../decorators/Logger';
import {Role} from '../models/Role';
import {RoleRepository} from '../repositories/RoleRepository';
import {events} from '../subscribers/events';
import {Res} from 'routing-controllers';

@Service()
export class RoleService {

  constructor(
    @OrmRepository() private roleRepository: RoleRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Logger(__filename) private log: LoggerInterface
  ) {
  }

  public find(): Promise<Role[]> {
    this.log.info('Find all roles');
    return this.roleRepository.find({relations: ['permissions']});
  }

  public findOne(id: string): Promise<Role | undefined> {
    this.log.info('Find one role');
    return this.roleRepository.findOne({id}, {relations: ['permissions']});
  }

  public async create(role: Role): Promise<Role> {
    this.log.info('Create a new role => ', role.toString());
    role.id = uuid.v1();
    const new_role = await this.roleRepository.save(role);
    this.eventDispatcher.dispatch(events.role.created, new_role);
    return new_role;
  }

  public update(id: string, role: Role): Promise<Role> {
    this.log.info('Update a role');
    role.id = id;
    return this.roleRepository.save(role);
  }

  public async delete(id: string, @Res() res: any): Promise<void> {
    this.log.info('Delete a role');
    await this.roleRepository.delete(id);
    return res.status(200).send({message: 'Role deleted successfully.'});
  }

}
