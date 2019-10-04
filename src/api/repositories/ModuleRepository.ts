import {EntityRepository, Repository} from 'typeorm';

import {Module} from '../models/Module';

@EntityRepository(Module)
export class ModuleRepository extends Repository<Module> {

}
