import {Service} from 'typedi';
import {OrmRepository} from 'typeorm-typedi-extensions';
import uuid from 'uuid';

import {EventDispatcher, EventDispatcherInterface} from '../../decorators/EventDispatcher';
import {Logger, LoggerInterface} from '../../decorators/Logger';
import {Shop} from '../models/Shop';
import {ShopRepository} from '../repositories/ShopRepository';
import {events} from '../subscribers/events';
import {Res} from 'routing-controllers';

@Service()
export class ShopService {

  constructor(
    @OrmRepository() private shopRepository: ShopRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Logger(__filename) private log: LoggerInterface
  ) {
  }

  public find(): Promise<Shop[]> {
    this.log.info('Find all shops');
    return this.shopRepository.find();
  }

  public findOne(id: string): Promise<Shop | undefined> {
    this.log.info('Find one shop');
    return this.shopRepository.findOne({id});
  }

  public async create(shop: Shop): Promise<any> {
    this.log.info('Create a new shop => ', shop.toString());
    shop.id = uuid.v1();
    const new_shop = await this.shopRepository.save(shop);
    this.eventDispatcher.dispatch(events.shop.created, new_shop);
    return new_shop;
  }

  public update(id: string, shop: Shop): Promise<Shop> {
    this.log.info('Update a shop');
    shop.id = id;
    return this.shopRepository.save(shop);
  }

  public async delete(id: string, @Res() res: any): Promise<void> {
    this.log.info('Delete a shop');
    const deletedShop: any = await this.shopRepository.delete(id);
    if (deletedShop.raw.affectedRows === 1) {
      return res.status(200).send({message: 'Shop deleted successfully.'});
    } else {
      return res.status(404).send({error: 'Shop not found.'});
    }
  }

}
