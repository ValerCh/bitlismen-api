import mysql from 'mysql';
import { Res } from 'routing-controllers';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import uuid from 'uuid';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Module } from '../models/Module';
import { ModuleRepository } from '../repositories/ModuleRepository';
import { events } from '../subscribers/events';

@Service()
export class ModuleService {

  public connection = mysql.createConnection({
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    user: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
  });

  constructor(
    @OrmRepository() private moduleRepository: ModuleRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Logger(__filename) private log: LoggerInterface
  ) {
  }

  public find(): Promise<Module[]> {
    this.log.info('Find all modules');
    return this.moduleRepository.find({
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
        'assemblies',
        'assemblies.tags',
        // 'assemblies.components',
        // 'assemblies.components.tag',
        // 'assemblies.components.tags',
        // 'assemblies.components.vendor',
        // 'assemblies.components.primaryShop',
        // 'assemblies.components.secondaryShop',
        // 'assemblies.components.tertiaryShop',
        // 'assemblies.services',
        // 'assemblies.services.tag',
        // 'assemblies.services.tags',
        // 'assemblies.services.shop',
      ],
    });
  }

  public findOne(id: string): Promise<Module | undefined> {
    this.log.info('Find one module');
    return this.moduleRepository.findOne({id}, {
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
        'assemblies',
        'assemblies.tags',
        // 'assemblies.components',
        // 'assemblies.components.tag',
        // 'assemblies.components.tags',
        // 'assemblies.components.vendor',
        // 'assemblies.components.primaryShop',
        // 'assemblies.components.secondaryShop',
        // 'assemblies.components.tertiaryShop',
        // 'assemblies.services',
        // 'assemblies.services.tag',
        // 'assemblies.services.tags',
        // 'assemblies.services.shop',
      ],
    });
  }

  public async create(modules: Module): Promise<Module> {
    this.log.info('Create a new module => ', modules.toString());
    modules.id = uuid.v1();
    const new_module = await this.moduleRepository.save(modules);
    this.eventDispatcher.dispatch(events.modules.created, new_module);
    return new_module;
  }

  public update(id: string, modules: Module): Promise<Module> {
    this.log.info('Update a module');
    modules.id = id;
    return this.moduleRepository.save(modules);
  }

  public async delete(id: string, @Res() res: any): Promise<void> {
    this.log.info('Delete a module');
    const mod: any = await this.findOne(id);
    const deletedModule: any = await this.moduleRepository.delete(id);
    if (deletedModule.raw.affectedRows === 1) {
      for (const assembly of mod.assemblies) {
        await this.deleteModuleAssembly(id, assembly.id);
      }
      for (const component of mod.components) {
        await this.deleteModuleComponent(id, component.id);
      }
      for (const service of mod.services) {
        await this.deleteModuleService(id, service.id);
      }
      return res.status(200).send({message: 'Module deleted successfully.'});
    } else {
      return res.status(404).send({error: 'Module not found.'});
    }
  }

  public getModuleAssemblies(id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from module_assemblies_assembly WHERE moduleId = '" + id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public getModuleAssembliesByID(module_id: any, assembly_id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from module_assemblies_assembly WHERE moduleId = '" + module_id + "' and assemblyId = '" + assembly_id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public getModuleComponents(id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from module_components_component WHERE moduleId = '" + id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public getModuleComponentsByID(module_id: any, component_id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from module_components_component WHERE moduleId = '" + module_id + "' and componentId = '" + component_id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public getModuleServices(id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from module_services_services WHERE moduleId = '" + id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public getModuleServicesByID(module_id: any, service_id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from module_services_services WHERE moduleId = '" + module_id + "' and servicesId = '" + service_id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public updateModuleAssembly(module_id: any, assembly_id: any, quantity: any): any {
    return new Promise((resolve, reject) => {
      const modAss = 'UPDATE module_assemblies_assembly SET ModuleAssemblyQty = "' + quantity + '" ' +
        'WHERE moduleId = "' + module_id + '" and assemblyId = "' + assembly_id + '"';
      this.connection.query(modAss, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public updateModuleComponent(module_id: any, component_id: any, quantity: any): any {
    return new Promise((resolve, reject) => {
      const modCom = 'UPDATE module_components_component SET ModuleComponentQty = "' + quantity + '" ' +
        'WHERE moduleId = "' + module_id + '" and componentId = "' + component_id + '"';
      this.connection.query(modCom, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public updateModuleService(module_id: any, service_id: any, quantity: any): any {
    return new Promise((resolve, reject) => {
      const modSer = 'UPDATE module_services_services SET ModuleServiceQty = "' + quantity + '" ' +
        'WHERE moduleId = "' + module_id + '" and servicesId = "' + service_id + '"';
      this.connection.query(modSer, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public deleteModuleAssembly(module_id: any, assembly_id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "DELETE from module_assemblies_assembly WHERE moduleId = '" + module_id + "' and assemblyId = '" + assembly_id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public deleteModuleComponent(module_id: any, component_id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "DELETE from module_components_component WHERE moduleId = '" + module_id + "' and componentId = '" + component_id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public deleteModuleService(module_id: any, service_id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "DELETE from module_services_services WHERE moduleId = '" + module_id + "' and servicesId = '" + service_id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

}
