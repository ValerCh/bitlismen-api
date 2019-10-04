import {Service} from 'typedi';
import {OrmRepository} from 'typeorm-typedi-extensions';
import uuid from 'uuid';

import {EventDispatcher, EventDispatcherInterface} from '../../decorators/EventDispatcher';
import {Logger, LoggerInterface} from '../../decorators/Logger';
import {Reseller} from '../models/Reseller';
import {ResellerRepository} from '../repositories/ResellerRepository';
import {events} from '../subscribers/events';
import {Res} from 'routing-controllers';

@Service()
export class ResellerService {

  constructor(
    @OrmRepository() private resellerRepository: ResellerRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Logger(__filename) private log: LoggerInterface
  ) {
  }

  public find(): Promise<Reseller[]> {
    this.log.info('Find all resellers');
    return this.resellerRepository.find();
  }

  public findOne(id: string): Promise<Reseller | undefined> {
    this.log.info('Find one reseller');
    return this.resellerRepository.findOne({id});
  }

  public async create(reseller: Reseller): Promise<Reseller> {
    this.log.info('Create a new reseller => ', reseller.toString());
    reseller.id = uuid.v1();
    const new_reseller = await this.resellerRepository.save(reseller);
    this.eventDispatcher.dispatch(events.reseller.created, new_reseller);
    return new_reseller;
  }

  public update(id: string, reseller: Reseller): Promise<Reseller> {
    this.log.info('Update a reseller');
    reseller.id = id;
    return this.resellerRepository.save(reseller);
  }

  public async delete(id: string, @Res() res: any): Promise<void> {
    this.log.info('Delete a reseller');
    const deletedReseller: any = await this.resellerRepository.delete(id);
    if (deletedReseller.raw.affectedRows === 1) {
      return res.status(200).send({message: 'Reseller deleted successfully.'});
    } else {
      return res.status(404).send({error: 'Reseller not found.'});
    }
  }

}
