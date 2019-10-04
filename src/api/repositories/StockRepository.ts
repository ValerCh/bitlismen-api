import {EntityRepository, Repository} from 'typeorm';

import {Stock} from '../models/Stock';

@EntityRepository(Stock)
export class StockRepository extends Repository<Stock> {

}
