import {EntityRepository, Repository} from 'typeorm';

import {Services} from '../models/Service';

@EntityRepository(Services)
export class ServiceRepository extends Repository<Services> {

}
