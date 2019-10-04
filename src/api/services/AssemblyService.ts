import mysql from 'mysql';
import { Res } from 'routing-controllers';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import uuid from 'uuid';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Assembly } from '../models/Assembly';
import { AssemblyRepository } from '../repositories/AssemblyRepository';
import { events } from '../subscribers/events';

@Service()
export class AssemblyService {

  public connection = mysql.createConnection({
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    user: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
  });

  constructor(
    @OrmRepository() private assemblyRepository: AssemblyRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Logger(__filename) private log: LoggerInterface
  ) {
  }

  public find(): Promise<Assembly[]> {
    this.log.info('Find all assemblies');
    return this.assemblyRepository.find({
      relations: [
        'tag',
        'tags',
        'components',
        'components.tag',
        'components.tags',
        'components.vendor',
        'components.primaryShop',
        'components.secondaryShop',
        'components.tertiaryShop',
        'services',
        'services.tag',
        'services.tags',
        'services.shop',
      ],
    });
  }

  public findOne(id: string): Promise<Assembly | undefined> {
    this.log.info('Find one assembly');
    return this.assemblyRepository.findOne({id}, {
      relations: [
        'tag',
        'tags',
        'components',
        'components.tag',
        'components.tags',
        'components.vendor',
        'components.primaryShop',
        'components.secondaryShop',
        'components.tertiaryShop',
        'services',
        'services.tag',
        'services.tags',
        'services.shop',
      ],
    });
  }

  public async create(assembly: Assembly): Promise<Assembly> {
    this.log.info('Create a new assembly => ', assembly.toString());
    assembly.id = uuid.v1();
    const new_assembly = await this.assemblyRepository.save(assembly);
    this.eventDispatcher.dispatch(events.assembly.created, new_assembly);
    return new_assembly;
  }

  public update(id: string, assembly: Assembly): Promise<Assembly> {
    this.log.info('Update a assembly');
    assembly.id = id;
    return this.assemblyRepository.save(assembly);
  }

  public async delete(id: string, @Res() res: any): Promise<void> {
    this.log.info('Delete a assembly');
    const assembly: any = await this.findOne(id);
    const deletedAssembly = await this.assemblyRepository.delete(id);
    if (deletedAssembly.raw.affectedRows === 1) {
      await this.deleteAssembliesRelations(id);
      for (const component of assembly.components) {
        await this.deleteAssemblyComponent(id, component.id);
      }
      for (const service of assembly.services) {
        await this.deleteAssemblyService(id, service.id);
      }
      return res.status(200).send({message: 'Assembly deleted successfully.'});
    } else {
      return res.status(404).send({error: 'Assembly not found.'});
    }
  }

  public getAssemblyComponents(id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from assembly_components_component WHERE assemblyId = '" + id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public getAssemblyComponentsByID(assembly_id: any, component_id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from assembly_components_component WHERE assemblyId = '" + assembly_id + "' and componentId = '" + component_id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public getAssemblyServices(id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from assembly_services_services WHERE assemblyId = '" + id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public getAssemblyServicesByID(assembly_id: any, service_id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from assembly_services_services WHERE assemblyId = '" + assembly_id + "' and servicesId = '" + service_id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public updateAssemblyComponent(assembly_id: any, component_id: any, quantity: any): any {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE assembly_components_component SET AssemblyComponentQty = '" + quantity + "' " +
        "WHERE assemblyId = '" + assembly_id + "' and componentId = '" + component_id + "'";
      this.connection.query(sql, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      });
    });
  }

  public updateAssemblyService(assembly_id: any, service_id: any, quantity: any): any {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE assembly_services_services SET AssemblyServiceQty = '" + quantity + "' " +
        "WHERE assemblyId = '" + assembly_id + "' and servicesId = '" + service_id + "'";
      this.connection.query(sql, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      });
    });
  }

  public deleteAssemblyComponent(assembly_id: any, component_id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "DELETE from assembly_components_component WHERE assemblyId = '" + assembly_id + "' and componentId= '" + component_id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public deleteAssemblyService(assembly_id: any, service_id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "DELETE from assembly_services_services WHERE assemblyId = '" + assembly_id + "' and servicesId= '" + service_id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public deleteAssembliesRelations(assembly_id: any): any {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE from module_assemblies_assembly where assemblyId = "' + assembly_id + '"';
      this.connection.query(sql, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      });
    });
  }

}
