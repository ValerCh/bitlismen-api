import {EntityRepository, Repository} from 'typeorm';

import {Reseller} from '../models/Reseller';

@EntityRepository(Reseller)
export class ResellerRepository extends Repository<Reseller> {

}
