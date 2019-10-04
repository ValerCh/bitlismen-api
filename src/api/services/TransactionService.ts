import {Service} from 'typedi';
import {OrmRepository} from 'typeorm-typedi-extensions';
import uuid from 'uuid';

import {EventDispatcher, EventDispatcherInterface} from '../../decorators/EventDispatcher';
import {Logger, LoggerInterface} from '../../decorators/Logger';
import {Transaction} from '../models/Transaction';
import {TransactionRepository} from '../repositories/TransactionRepository';
import {events} from '../subscribers/events';
import {Res} from 'routing-controllers';

@Service()
export class TransactionService {

  constructor(
    @OrmRepository() private transactionRepository: TransactionRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Logger(__filename) private log: LoggerInterface
  ) {
  }

  public find(): Promise<Transaction[]> {
    this.log.info('Find all transactions');
    return this.transactionRepository.find({
      relations: [
        'components',
        'components.tags',
        'components.vendor',
        'components.primaryShop',
        'components.secondaryShop',
        'components.tertiaryShop',
        'modules',
        'modules.tags',
        'assemblies',
        'assemblies.tags',
        'shop',
        'opportunity',
      ],
    });
  }

  public findOne(id: string): Promise<Transaction | undefined> {
    this.log.info('Find one transaction');
    return this.transactionRepository.findOne({id}, {
      relations: [
        'components',
        'components.tag',
        'components.vendor',
        'components.primaryShop',
        'components.secondaryShop',
        'components.tertiaryShop',
        'modules',
        'assemblies',
        'shop',
        'opportunity',
      ],
    });
  }

  public async create(transaction: Transaction): Promise<Transaction> {
    this.log.info('Create a new transaction => ', transaction.toString());
    transaction.id = uuid.v1();
    const new_transaction = await this.transactionRepository.save(transaction);
    this.eventDispatcher.dispatch(events.transaction.created, new_transaction);
    return new_transaction;
  }

  public update(id: string, stock: Transaction): Promise<Transaction> {
    this.log.info('Update a transaction');
    stock.id = id;
    return this.transactionRepository.save(stock);
  }

  public async delete(id: string, @Res() res: any): Promise<void> {
    this.log.info('Delete a transaction');
    const deletedTransaction: any = await this.transactionRepository.delete(id);
    if (deletedTransaction.raw.affectedRows === 1) {
      return res.status(200).send({message: 'Transaction deleted successfully.'});
    } else {
      return res.status(404).send({error: 'Transaction not found.'});
    }
  }

}
