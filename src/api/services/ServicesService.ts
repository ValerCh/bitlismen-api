import mysql from 'mysql';
import { Res } from 'routing-controllers';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import uuid from 'uuid';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Services } from '../models/Service';
import { ServiceRepository } from '../repositories/ServiceRepository';
import { events } from '../subscribers/events';

@Service()
export class ServicesService {

  public connection = mysql.createConnection({
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    user: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
  });

  constructor(
    @OrmRepository() private serviceRepository: ServiceRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Logger(__filename) private log: LoggerInterface
  ) {
  }

  public find(): Promise<Services[]> {
    this.log.info('Find all services');
    return this.serviceRepository.find({relations: ['shop', 'tag', 'tags']});
  }

  public findOne(id: string): Promise<Services | undefined> {
    this.log.info('Find one service');
    return this.serviceRepository.findOne({id}, {relations: ['shop', 'tag', 'tags']});
  }

  public async create(service: Services): Promise<Services> {
    this.log.info('Create a new service => ', service.toString());
    service.id = uuid.v1();
    const new_service = await this.serviceRepository.save(service);
    this.eventDispatcher.dispatch(events.service.created, new_service);
    return new_service;
  }

  public update(id: string, service: Services): Promise<Services> {
    this.log.info('Update a service');
    service.id = id;
    return this.serviceRepository.save(service);
  }

  public async delete(id: string, @Res() res: any): Promise<void> {
    this.log.info('Delete a component');
    const relations: any = ['assembly', 'module', 'opportunity', 'trainer'];
    const deletedService: any = await this.serviceRepository.delete(id);
    if (deletedService.raw.affectedRows === 1) {
      for (const relation of relations) {
        await this.deleteServicesRelations(relation, id);
      }
      return res.status(200).send({message: 'Service deleted successfully.'});
    } else {
      return res.status(404).send({error: 'Service not found.'});
    }
  }

  public deleteServicesRelations(name: any, service_id: any): any {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE from ' + name + '_services_services WHERE servicesId = "' + service_id + '"';
      this.connection.query(sql, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      });
    });
  }

}
