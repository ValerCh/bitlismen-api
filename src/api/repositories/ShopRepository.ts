import {EntityRepository, Repository} from 'typeorm';

import {Shop} from '../models/Shop';

@EntityRepository(Shop)
export class ShopRepository extends Repository<Shop> {

}
