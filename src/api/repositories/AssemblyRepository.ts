import {EntityRepository, Repository} from 'typeorm';

import {Assembly} from '../models/Assembly';

@EntityRepository(Assembly)
export class AssemblyRepository extends Repository<Assembly> {

}
