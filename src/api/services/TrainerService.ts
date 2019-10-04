import mysql from 'mysql';
import { Res } from 'routing-controllers';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import uuid from 'uuid';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Trainer } from '../models/Trainer';
import { TrainerRepository } from '../repositories/TrainerRepository';
import { events } from '../subscribers/events';

@Service()
export class TrainerService {

  public connection = mysql.createConnection({
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    user: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
  });

  constructor(
    @OrmRepository() private trainerRepository: TrainerRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Logger(__filename) private log: LoggerInterface
  ) {
  }

  public find(): Promise<Trainer[]> {
    this.log.info('Find all trainers');
    return this.trainerRepository.find({
      relations: [
        'tag',
        'tags',
        'modules',
        'modules.tag',
        'modules.tags',
        // 'modules.components',
        // 'modules.components.tag',
        // 'modules.components.tags',
        // 'modules.components.vendor',
        // 'modules.components.primaryShop',
        // 'modules.components.secondaryShop',
        // 'modules.components.tertiaryShop',
        // 'modules.services',
        // 'modules.services.tag',
        // 'modules.services.tags',
        // 'modules.services.shop',
        // 'modules.assemblies',
        // 'modules.assemblies.tag',
        // 'modules.assemblies.tags',
        // 'modules.assemblies.components',
        // 'modules.assemblies.components.tag',
        // 'modules.assemblies.components.tags',
        // 'modules.assemblies.components.vendor',
        // 'modules.assemblies.components.primaryShop',
        // 'modules.assemblies.components.secondaryShop',
        // 'modules.assemblies.components.tertiaryShop',
        // 'modules.assemblies.services',
        // 'modules.assemblies.services.tag',
        // 'modules.assemblies.services.tags',
        // 'modules.assemblies.services.shop',
        'services',
        'services.tag',
        'services.tags',
        'services.shop',
      ],
    });
  }

  public findOne(id: string): Promise<Trainer | undefined> {
    this.log.info('Find one trainer');
    return this.trainerRepository.findOne({id}, {
      relations: [
        'tag',
        'tags',
        'modules',
        'modules.tag',
        'modules.tags',
        // 'modules.components',
        // 'modules.components.tag',
        // 'modules.components.tags',
        // 'modules.components.vendor',
        // 'modules.components.primaryShop',
        // 'modules.components.secondaryShop',
        // 'modules.components.tertiaryShop',
        // 'modules.services',
        // 'modules.services.tag',
        // 'modules.services.tags',
        // 'modules.services.shop',
        // 'modules.assemblies',
        // 'modules.assemblies.tag',
        // 'modules.assemblies.tags',
        // 'modules.assemblies.components',
        // 'modules.assemblies.components.tag',
        // 'modules.assemblies.components.tags',
        // 'modules.assemblies.components.vendor',
        // 'modules.assemblies.components.primaryShop',
        // 'modules.assemblies.components.secondaryShop',
        // 'modules.assemblies.components.tertiaryShop',
        // 'modules.assemblies.services',
        // 'modules.assemblies.services.tag',
        // 'modules.assemblies.services.tags',
        // 'modules.assemblies.services.shop',
        'services',
        'services.tag',
        'services.tags',
        'services.shop',
      ],
    });
  }

  public async create(trainer: Trainer): Promise<Trainer> {
    this.log.info('Create a new module => ', trainer.toString());
    trainer.id = uuid.v1();
    const new_trainer = await this.trainerRepository.save(trainer);
    this.eventDispatcher.dispatch(events.trainer.created, new_trainer);
    return new_trainer;
  }

  public update(id: string, trainer: Trainer): Promise<Trainer> {
    this.log.info('Update a trainer');
    trainer.id = id;
    return this.trainerRepository.save(trainer);
  }

  public async delete(id: string, @Res() res: any): Promise<void> {
    this.log.info('Delete a trainer');
    const trainer: any = await this.findOne(id);
    const deletedTrainer: any = await this.trainerRepository.delete(id);
    if (deletedTrainer.raw.affectedRows === 1) {
      for (const mod of trainer.modules) {
        await this.deleteTrainerModule(id, mod.id);
      }
      for (const service of trainer.services) {
        await this.deleteTrainerService(id, service.id);
      }
      return res.status(200).send({message: 'Trainer deleted successfully.'});
    } else {
      return res.status(404).send({message: 'Trainer not found.'});
    }
  }

  public getTrainerModules(id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from trainer_modules_module WHERE trainerId = '" + id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public getTrainerModulesByID(trainer_id: any, module_id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from trainer_modules_module WHERE trainerId = '" + trainer_id + "' and moduleId = '" + module_id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public getTrainerServices(id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from trainer_services_services WHERE trainerId = '" + id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public getTrainerServicesByID(trainer_id: any, service_id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from trainer_services_services WHERE trainerId = '" + trainer_id + "' and servicesId = '" + service_id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public updateTrainerModule(trainer_id: any, module_id: any, quantity: any): any {
    return new Promise((resolve, reject) => {
      const traMod = 'UPDATE trainer_modules_module SET TrainerModuleQty = "' + quantity + '" ' +
        'WHERE trainerId = "' + trainer_id + '" and moduleId = "' + module_id + '"';
      this.connection.query(traMod, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public updateTrainerService(trainer_id: any, service_id: any, quantity: any): any {
    return new Promise((resolve, reject) => {
      const traSer = 'UPDATE trainer_services_services SET TrainerServiceQty = "' + quantity + '" ' +
        'WHERE trainerId = "' + trainer_id + '" and servicesId = "' + service_id + '"';
      this.connection.query(traSer, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public deleteTrainerModule(trainer_id: any, module_id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "DELETE from trainer_modules_module WHERE trainerId = '" + trainer_id + "' and moduleId = '" + module_id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public deleteTrainerService(trainer_id: any, service_id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "DELETE from trainer_services_services WHERE trainerId = '" + trainer_id + "' and servicesId = '" + service_id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

}
