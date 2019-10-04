import {Service} from 'typedi';
import {OrmRepository} from 'typeorm-typedi-extensions';
import uuid from 'uuid';

import {EventDispatcher, EventDispatcherInterface} from '../../decorators/EventDispatcher';
import {Logger, LoggerInterface} from '../../decorators/Logger';
import {Vendor} from '../models/Vendor';
import {VendorRepository} from '../repositories/VendorRepository';
import {events} from '../subscribers/events';
import {Res} from 'routing-controllers';

@Service()
export class VendorService {

  constructor(
    @OrmRepository() private vendorRepository: VendorRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Logger(__filename) private log: LoggerInterface
  ) {
  }

  public find(): Promise<Vendor[]> {
    this.log.info('Find all vendors');
    return this.vendorRepository.find();
  }

  public findOne(id: string): Promise<Vendor | undefined> {
    this.log.info('Find one vendor');
    return this.vendorRepository.findOne({id});
  }

  public async create(vendor: Vendor): Promise<Vendor> {
    this.log.info('Create a new vendor => ', vendor.toString());
    vendor.id = uuid.v1();
    const new_vendor = await this.vendorRepository.save(vendor);
    this.eventDispatcher.dispatch(events.vendor.created, new_vendor);
    return new_vendor;
  }

  public update(id: string, vendor: Vendor): Promise<Vendor> {
    this.log.info('Update a vendor');
    vendor.id = id;
    return this.vendorRepository.save(vendor);
  }

  public async delete(id: string, @Res() res: any): Promise<void> {
    this.log.info('Delete a vendor');
    const deletedVendor: any = await this.vendorRepository.delete(id);
    if (deletedVendor.raw.affectedRows === 1) {
      return res.status(200).send({message: 'Vendor deleted successfully.'});
    } else {
      return res.status(404).send({error: 'Vendor not found.'});
    }
  }

}
