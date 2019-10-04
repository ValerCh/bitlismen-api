import {Service} from 'typedi';
import {OrmRepository} from 'typeorm-typedi-extensions';
import uuid from 'uuid';

import {EventDispatcher, EventDispatcherInterface} from '../../decorators/EventDispatcher';
import {Logger, LoggerInterface} from '../../decorators/Logger';
import {Opportunity} from '../models/Opportunity';
import {OpportunityRepository} from '../repositories/OpportunityRepository';
import {events} from '../subscribers/events';
import {Res} from 'routing-controllers';
import mysql from 'mysql';

@Service()
export class OpportunityService {

  public connection = mysql.createConnection({
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    user: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
  });

  constructor(
    @OrmRepository() private opportunityRepository: OpportunityRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Logger(__filename) private log: LoggerInterface
  ) {
  }

  public find(): Promise<Opportunity[]> {
    this.log.info('Find all opportunities');
    return this.opportunityRepository.find({
      relations: [
        'tags',
        'trainers',
        'trainers.tags',
        // 'trainers.services',
        // 'trainers.services.tags',
        // 'trainers.services.shop',
        // 'trainers.modules',
        // 'trainers.modules.tags',
        // 'trainers.modules.components',
        // 'trainers.modules.components.tags',
        // 'trainers.modules.components.vendor',
        // 'trainers.modules.components.primaryShop',
        // 'trainers.modules.components.secondaryShop',
        // 'trainers.modules.components.tertiaryShop',
        // 'trainers.modules.services',
        // 'trainers.modules.services.tags',
        // 'trainers.modules.services.shop',
        // 'trainers.modules.assemblies',
        // 'trainers.modules.assemblies.tags',
        // 'trainers.modules.assemblies.components',
        // 'trainers.modules.assemblies.components.tags',
        // 'trainers.modules.assemblies.components.vendor',
        // 'trainers.modules.assemblies.components.primaryShop',
        // 'trainers.modules.assemblies.components.secondaryShop',
        // 'trainers.modules.assemblies.components.tertiaryShop',
        // 'trainers.modules.assemblies.services',
        // 'trainers.modules.assemblies.services.tags',
        // 'trainers.modules.assemblies.services.shop',
        'services',
        'services.tags',
        'services.shop',
        'customer',
        'reseller',
        'owninguser',
        // 'owninguser.role',
      ],
    });
  }

  public findByOwningUser(owningUser: any): Promise<Opportunity[]> {
    this.log.info('Find all opportunities');
    return this.opportunityRepository.find({
      where: {
        OwningUser: owningUser,
      },
      relations: [
        'tags',
        'trainers',
        'trainers.tags',
        // 'trainers.services',
        // 'trainers.services.tags',
        // 'trainers.services.shop',
        // 'trainers.modules',
        // 'trainers.modules.tags',
        // 'trainers.modules.components',
        // 'trainers.modules.components.tags',
        // 'trainers.modules.components.vendor',
        // 'trainers.modules.components.primaryShop',
        // 'trainers.modules.components.secondaryShop',
        // 'trainers.modules.components.tertiaryShop',
        // 'trainers.modules.services',
        // 'trainers.modules.services.tags',
        // 'trainers.modules.services.shop',
        // 'trainers.modules.assemblies',
        // 'trainers.modules.assemblies.tags',
        // 'trainers.modules.assemblies.components',
        // 'trainers.modules.assemblies.components.tags',
        // 'trainers.modules.assemblies.components.vendor',
        // 'trainers.modules.assemblies.components.primaryShop',
        // 'trainers.modules.assemblies.components.secondaryShop',
        // 'trainers.modules.assemblies.components.tertiaryShop',
        // 'trainers.modules.assemblies.services',
        // 'trainers.modules.assemblies.services.tags',
        // 'trainers.modules.assemblies.services.shop',
        'services',
        'services.tags',
        'services.shop',
        'customer',
        'reseller',
        'owninguser',
        // 'owninguser.role',
      ],
    });
  }

  public findOne(id: string): Promise<Opportunity | undefined> {
    this.log.info('Find one opportunity');
    return this.opportunityRepository.findOne({id}, {
      relations: [
        'tags',
        'trainers',
        'trainers.tags',
        // 'trainers.services',
        // 'trainers.services.tags',
        // 'trainers.services.shop',
        // 'trainers.modules',
        // 'trainers.modules.tags',
        // 'trainers.modules.components',
        // 'trainers.modules.components.tags',
        // 'trainers.modules.components.vendor',
        // 'trainers.modules.components.primaryShop',
        // 'trainers.modules.components.secondaryShop',
        // 'trainers.modules.components.tertiaryShop',
        // 'trainers.modules.services',
        // 'trainers.modules.services.tags',
        // 'trainers.modules.services.shop',
        // 'trainers.modules.assemblies',
        // 'trainers.modules.assemblies.tags',
        // 'trainers.modules.assemblies.components',
        // 'trainers.modules.assemblies.components.tags',
        // 'trainers.modules.assemblies.components.vendor',
        // 'trainers.modules.assemblies.components.primaryShop',
        // 'trainers.modules.assemblies.components.secondaryShop',
        // 'trainers.modules.assemblies.components.tertiaryShop',
        // 'trainers.modules.assemblies.services',
        // 'trainers.modules.assemblies.services.tags',
        // 'trainers.modules.assemblies.services.shop',
        'services',
        'services.tags',
        'services.shop',
        'customer',
        'reseller',
        'owninguser',
        // 'owninguser.role',
      ],
    });
  }

  public async create(opportunity: Opportunity): Promise<Opportunity> {
    this.log.info('Create a new opportunity => ', opportunity.toString());
    opportunity.id = uuid.v1();
    const new_opportunity = await this.opportunityRepository.save(opportunity);
    this.eventDispatcher.dispatch(events.opportunity.created, new_opportunity);
    return new_opportunity;
  }

  public update(id: string, opportunity: Opportunity): Promise<Opportunity> {
    this.log.info('Update an opportunity');
    opportunity.id = id;
    return this.opportunityRepository.save(opportunity);
  }

  public async delete(id: string, @Res() res: any): Promise<void> {
    this.log.info('Delete an opportunity.');
    const opportunity: any = await this.findOne(id);
    const deletedOpportunity: any = await this.opportunityRepository.delete(id);
    if (deletedOpportunity.raw.affectedRows === 1) {
      for (const trainer of opportunity.trainers) {
        await this.deleteOpportunityTrainer(id, trainer.id);
      }
      for (const service of opportunity.services) {
        await this.deleteOpportunityService(id, service.id);
      }
      return res.status(200).send({message: 'Opportunity deleted successfully.'});
    } else {
      return res.status(404).send({error: 'Opportunity not found.'});
    }
  }

  public getOpportunityTrainers(id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from opportunity_trainers_trainer WHERE opportunityId = '" + id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public getOpportunityTrainersByID(opportunity_id: any, trainer_id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from opportunity_trainers_trainer WHERE opportunityId = '" + opportunity_id + "' and trainerId = '" + trainer_id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public getOpportunityServices(id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from opportunity_services_services WHERE opportunityId = '" + id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public getOpportunityServicesByID(opportunity_id: any, service_id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from opportunity_services_services WHERE opportunityId = '" + opportunity_id + "' and servicesId = '" + service_id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public updateOpportunityTrainer(opportunity_id: any, trainer_id: any, quantity: any): any {
    return new Promise((resolve, reject) => {
      const oppTra = 'UPDATE opportunity_trainers_trainer SET OpportunityTrainerQty = "' + quantity + '" ' +
        'WHERE opportunityId = "' + opportunity_id + '" and trainerId = "' + trainer_id + '"';
      this.connection.query(oppTra, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public updateOpportunityService(opportunity_id: any, service_id: any, quantity: any): any {
    return new Promise((resolve, reject) => {
      const oppSer = 'UPDATE opportunity_services_services SET OpportunityServiceQty = "' + quantity + '" ' +
        'WHERE opportunityId = "' + opportunity_id + '" and servicesId = "' + service_id + '"';
      this.connection.query(oppSer, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public deleteOpportunityTrainer(opportunity_id: any, trainer_id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "DELETE from opportunity_trainers_trainer WHERE opportunityId = '" + opportunity_id + "' and trainerId = '" + trainer_id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public deleteOpportunityService(opportunity_id: any, service_id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "DELETE from opportunity_services_services WHERE opportunityId = '" + opportunity_id + "' and servicesId = '" + service_id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

}
