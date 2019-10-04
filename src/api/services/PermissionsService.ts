import {Service} from 'typedi';
import {OrmRepository} from 'typeorm-typedi-extensions';
import uuid from 'uuid';

import {EventDispatcher, EventDispatcherInterface} from '../../decorators/EventDispatcher';
import {Logger, LoggerInterface} from '../../decorators/Logger';
import {Permissions} from '../models/Permissions';
import {PermissionsRepository} from '../repositories/PermissionsRepository';
import {events} from '../subscribers/events';

@Service()
export class PermissionsService {

  constructor(
    @OrmRepository() private permissionsRepository: PermissionsRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Logger(__filename) private log: LoggerInterface
  ) {
  }

  public async create(permissions: Permissions): Promise<Permissions> {
    this.log.info('Create a new role => ', permissions.toString());
    permissions.id = uuid.v1();
    const new_permissions = await this.permissionsRepository.save(permissions);
    this.eventDispatcher.dispatch(events.permissions.created, new_permissions);
    return new_permissions;
  }

}
