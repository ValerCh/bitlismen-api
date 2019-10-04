import {Service} from 'typedi';
import {OrmRepository} from 'typeorm-typedi-extensions';
import uuid from 'uuid';

import {EventDispatcher, EventDispatcherInterface} from '../../decorators/EventDispatcher';
import {Logger, LoggerInterface} from '../../decorators/Logger';
import {Stock} from '../models/Stock';
import {StockRepository} from '../repositories/StockRepository';
import {events} from '../subscribers/events';
import {Res} from 'routing-controllers';
import mysql from 'mysql';

@Service()
export class StockService {

  public connection = mysql.createConnection({
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    user: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
  });

  constructor(
    @OrmRepository() private stockRepository: StockRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Logger(__filename) private log: LoggerInterface
  ) {
  }

  public find(): Promise<Stock[]> {
    this.log.info('Find all stocks');
    return this.stockRepository.find({
      relations: [
        'component',
        'assembly',
        'module',
        // 'components',
        // 'components.tags',
        // 'modules',
        // 'modules.tags',
        // 'assemblies',
        // 'assemblies.tags',
      ],
    });
  }

  public findOne(id: string): Promise<Stock | undefined> {
    this.log.info('Find one stock');
    return this.stockRepository.findOne({id}, {
      relations: [
        'component',
        'assembly',
        'module',
        // 'components',
        // 'components.tags',
        // 'modules',
        // 'modules.tags',
        // 'assemblies',
        // 'assemblies.tags',
      ],
    });
  }

  public getStocksByComponentId(component_id: any): Promise<any> {
    this.log.info('Find one stock');
    return this.stockRepository.findOne({
      where: {
        componentId: component_id,
      },
      relations: [
        'component',
      ],
    });
  }

  public getStocksByAssemblyId(assembly_id: any): Promise<any> {
    this.log.info('Find one stock');
    return this.stockRepository.findOne({
      where: {
        assemblyId: assembly_id,
      },
      relations: [
        'assembly',
      ],
    });
  }

  public getStocksByModuleId(module_id: any): Promise<any> {
    this.log.info('Find one stock');
    return this.stockRepository.findOne({
      where: {
        moduleId: module_id,
      },
      relations: [
        'module',
      ],
    });
  }

  public async create(stock: Stock): Promise<Stock> {
    this.log.info('Create a new stock => ', stock.toString());
    stock.id = uuid.v1();
    const new_stock = await this.stockRepository.save(stock);
    this.eventDispatcher.dispatch(events.stock.created, new_stock);
    return new_stock;
  }

  public update(id: string, stock: Stock): Promise<Stock> {
    this.log.info('Update a stock');
    stock.id = id;
    return this.stockRepository.save(stock);
  }

  public async delete(id: string, @Res() res: any): Promise<void> {
    this.log.info('Delete a stock');
    const deletedStock: any = await this.stockRepository.delete(id);
    if (deletedStock.raw.affectedRows === 1) {
      return res.status(200).send({message: 'Stock deleted successfully.'});
    } else {
      return res.status(404).send({error: 'Stock not found.'});
    }
  }

  public getStockAssemblies(id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from stock_assemblies_assembly WHERE stockId = '" + id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public getStockComponents(id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from stock_components_component WHERE stockId = '" + id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public getStockModules(id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from stock_modules_module WHERE stockId = '" + id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public deleteStockAssembly(stock_id: any, assembly_id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "DELETE from stock_assemblies_assembly WHERE stockId = '" + stock_id + "' and assemblyId = '" + assembly_id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public deleteStockComponent(stock_id: any, component_id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "DELETE from stock_components_component WHERE stockId = '" + stock_id + "' and componentId = '" + component_id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  public deleteStockModule(stock_id: any, module_id: any): any {
    return new Promise((resolve, reject) => {
      const sql = "DELETE from stock_modules_module WHERE stockId = '" + stock_id + "' and moduleId = '" + module_id + "'";
      this.connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

}
