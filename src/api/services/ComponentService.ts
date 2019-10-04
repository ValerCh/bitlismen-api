import mysql from 'mysql';
import { Res } from 'routing-controllers';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import uuid from 'uuid';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Component } from '../models/Component';
import { ComponentRepository } from '../repositories/ComponentRepository';
import { events } from '../subscribers/events';

@Service()
export class ComponentService {

  public connection = mysql.createConnection({
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    user: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
  });

  constructor(
    @OrmRepository() private componentRepository: ComponentRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Logger(__filename) private log: LoggerInterface
  ) {
  }

  public find(): Promise<Component[]> {
    this.log.info('Find all components');
    return this.componentRepository.find({relations: ['vendor', 'primaryShop', 'secondaryShop', 'tertiaryShop', 'tag', 'tags']});
  }

  public findOne(id: string): Promise<Component | undefined> {
    this.log.info('Find one component');
    return this.componentRepository.findOne({id}, {relations: ['vendor', 'primaryShop', 'secondaryShop', 'tertiaryShop', 'tag', 'tags']});
  }

  public async create(component: Component): Promise<Component> {
    this.log.info('Create a new component => ', component.toString());
    component.id = uuid.v1();
    const new_component = await this.componentRepository.save(component);
    this.eventDispatcher.dispatch(events.component.created, new_component);
    return new_component;
  }

  public update(id: string, component: Component): Promise<Component> {
    this.log.info('Update a component');
    component.id = id;
    return this.componentRepository.save(component);
  }

  public async delete(id: string, @Res() res: any): Promise<void> {
    this.log.info('Delete a component');
    const relations: any = ['assembly', 'module'];
    const deletedComponent = await this.componentRepository.delete(id);
    if (deletedComponent.raw.affectedRows === 1) {
      for (const relation of relations) {
        await this.deleteComponentsRelations(relation, id);
      }
      return res.status(200).send({message: 'Component deleted successfully.'});
    } else {
      return res.status(404).send({error: 'Component not found.'});
    }
  }

  public deleteComponentsRelations(name: any, component_id: any): any {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE from ' + name + '_components_component WHERE componentId = "' + component_id + '"';
      this.connection.query(sql, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      });
    });
  }

}
