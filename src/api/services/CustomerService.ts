import {Service} from 'typedi';
import {OrmRepository} from 'typeorm-typedi-extensions';
import uuid from 'uuid';

import {EventDispatcher, EventDispatcherInterface} from '../../decorators/EventDispatcher';
import {Logger, LoggerInterface} from '../../decorators/Logger';
import {Customer} from '../models/Customer';
import {CustomerRepository} from '../repositories/CustomerRepository';
import {events} from '../subscribers/events';
import {Res} from 'routing-controllers';

@Service()
export class CustomerService {

  constructor(
    @OrmRepository() private customerRepository: CustomerRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Logger(__filename) private log: LoggerInterface
  ) {
  }

  public find(): Promise<Customer[]> {
    this.log.info('Find all customers');
    return this.customerRepository.find();
  }

  public findOne(id: string): Promise<Customer | undefined> {
    this.log.info('Find one customer');
    return this.customerRepository.findOne({id});
  }

  public async create(customer: Customer): Promise<Customer> {
    this.log.info('Create a new customer => ', customer.toString());
    customer.id = uuid.v1();
    const new_customer = await this.customerRepository.save(customer);
    this.eventDispatcher.dispatch(events.customer.created, new_customer);
    return new_customer;
  }

  public update(id: string, customer: Customer): Promise<Customer> {
    this.log.info('Update a customer');
    customer.id = id;
    return this.customerRepository.save(customer);
  }

  public async delete(id: string, @Res() res: any): Promise<void> {
    this.log.info('Delete a customer');
    const deletedCustomer = await this.customerRepository.delete(id);
    if (deletedCustomer.raw.affectedRows === 1) {
      return res.status(200).send({message: 'Customer deleted successfully.'});
    } else {
      return res.status(404).send({error: 'Customer not found.'});
    }
  }

}
