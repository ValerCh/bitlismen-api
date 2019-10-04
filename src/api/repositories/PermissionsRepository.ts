import {EntityRepository, Repository} from 'typeorm';

import {Permissions} from '../models/Permissions';

@EntityRepository(Permissions)
export class PermissionsRepository extends Repository<Permissions> {

}
