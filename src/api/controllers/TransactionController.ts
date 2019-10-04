import {
  Authorized,
  Body, CurrentUser, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req, Res
} from 'routing-controllers';

import {Transaction} from '../models/Transaction';
import {TransactionService} from '../services/TransactionService';
import {TransactionNotFoundError} from '../errors/TransactionNotFoundError';
import mysql from 'mysql';
import {UsersService} from '../services/UsersService';
import {StockService} from '../services/StockService';

@JsonController()
export class TransactionController {

  public connection = mysql.createConnection({
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    user: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
  });

  constructor(
    private transactionService: TransactionService,
    private usersService: UsersService,
    private stockService: StockService
  ) {
  }

  @Get('/transactions')
  @Authorized()
  public async find(@CurrentUser({required: true}) user: any, @Res() res: any): Promise<Transaction[]> {
    const canDo = 'transaction-read';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      const transactions: any = await this.transactionService.find();
      for (const transaction of transactions) {
        if (transaction.components) {
          for (const component of transaction.components) {
            component.CPoto = Buffer.from(component.CPoto).toString();
          }
        }
        if (transaction.modules) {
          for (const mod of transaction.modules) {
            mod.MPhoto = Buffer.from(mod.MPhoto).toString();
          }
        }
        if (transaction.assemblies) {
          for (const assembly of transaction.assemblies) {
            assembly.APhoto = Buffer.from(assembly.APhoto).toString();
          }
        }
      }
      return transactions;
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Get('/transactions/:id')
  @Authorized()
  @OnUndefined(TransactionNotFoundError)
  public async one(@CurrentUser({required: true}) user: any, @Res() res: any, @Param('id') id: string): Promise<Transaction | undefined> {
    const canDo = 'transaction-read';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      const transaction: any = await this.transactionService.findOne(id);
      transaction.components[0].CPoto = Buffer.from(transaction.components[0].CPoto).toString();
      return transaction;
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Post('/transactions')
  @Authorized()
  public async create(@CurrentUser({required: true}) user: any, @Body() transaction: any, @Req() req: any, @Res() res: any): Promise<any> {
    const existingComponentsOfStock = [];
    const existingAssembliesOfStock = [];
    const existingModulesOfStock = [];
    const assembliesDoc = [];
    const componentsDoc = [];
    const modulesDoc = [];
    let y = 0;
    const canDo = 'transaction-create';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      if (transaction.TType === 'Procurement') {
        const newTransaction = await this.transactionService.create(transaction);
        if (newTransaction) {
          if (transaction.components) {
            for (let c = 0; c < transaction.components.length; c++) {
              y++;
              componentsDoc.push(y);
              existingComponentsOfStock.push(await this.stockService.getStocksByComponentId(transaction.components[c].id));
              if (existingComponentsOfStock[c] !== undefined) {
                const data: any = {
                  StockComponentQty: parseInt(existingComponentsOfStock[c].StockComponentQty, 10)
                    + parseInt(existingComponentsOfStock[c].TransactionComponentQty, 10),
                  StockComponentPrice: existingComponentsOfStock[c].TransactionComponentPrice,
                };
                await this.stockService.update(existingComponentsOfStock[c].id, data);
              } else {
                return res.status(409).send({
                  componentMessage: 'Selected component is missing from the Stock. ',
                });
              }
            }
          }
          if (transaction.assemblies) {
            for (let a = 0; a < transaction.assemblies.length; a++) {
              y++;
              assembliesDoc.push(y);
              existingAssembliesOfStock.push(await this.stockService.getStocksByAssemblyId(transaction.assemblies[a].id));
              if (existingAssembliesOfStock[a] !== undefined) {
                const data: any = {
                  StockAssemblyQty: parseInt(existingAssembliesOfStock[a].StockAssemblyQty, 10)
                    + parseInt(existingAssembliesOfStock[a].TransactionAssemblyQty, 10),
                  StockAssemblyPrice: existingAssembliesOfStock[a].TransactionAssemblyPrice,
                };
                await this.stockService.update(existingAssembliesOfStock[a].id, data);
              } else {
                return res.status(409).send({
                  assemblyMessage: 'Selected assembly is missing from the Stock. ',
                });
              }
            }
          }
          if (transaction.modules) {
            for (let m = 0; m < transaction.modules.length; m++) {
              y++;
              modulesDoc.push(y);
              existingModulesOfStock.push(await this.stockService.getStocksByModuleId(transaction.modules[m].id));
              if (existingModulesOfStock[m] !== undefined) {
                const data: any = {
                  StockModuleQty: parseInt(existingModulesOfStock[m].StockModuleQty, 10)
                    + parseInt(existingModulesOfStock[m].TransactionModuleQty, 10),
                  StockModulePrice: existingModulesOfStock[m].TransactionModulePrice,
                };
                await this.stockService.update(existingModulesOfStock[m].id, data);
              } else {
                return res.status(409).send({
                  moduleMessage: 'Selected module is missing from the Stock. ',
                });
              }
            }
          }
        }
        return newTransaction;
      } else if (transaction.TType === 'Spending' || transaction.type === 'EarlyWork') {
        const componentDoc = [];
        const assemblyDoc = [];
        const moduleDoc = [];
        let i = 0;
        for (let c = 0; c < transaction.components.length; c++) {
          i++;
          componentDoc.push(i);
          existingComponentsOfStock.push(await this.stockService.getStocksByComponentId(transaction.components[c].id));
          if (existingComponentsOfStock[c] !== undefined) {
            if (existingComponentsOfStock[c].component.id === transaction.components[c].id &&
              parseInt(transaction.components[c].TransactionComponentQty, 10) > parseInt(existingComponentsOfStock[c].StockComponentQty, 10)) {
              return res.status(409).send({
                componentMessage: 'We do not have enough ' + `${existingComponentsOfStock[c].component.CName}` +
                  ' component. Remainder is ' + `${existingComponentsOfStock[c].StockComponentQty}`,
              });
            }
          } else {
            return res.status(409).send({
              componentMessage: 'Selected component is missing from the Stock. ',
            });
          }
        }
        for (let a = 0; a < transaction.assemblies.length; a++) {
          i++;
          assemblyDoc.push(i);
          existingAssembliesOfStock.push(await this.stockService.getStocksByAssemblyId(transaction.assemblies[a].id));
          if (existingAssembliesOfStock[a] !== undefined) {
            if (existingAssembliesOfStock[a].assembly.id === transaction.assemblies[a].id &&
              parseInt(transaction.assemblies[a].TransactionAssemblyQty, 10) > parseInt(existingAssembliesOfStock[a].StockAssemblyQty, 10)) {
              return res.status(409).send({
                assemblyMessage: 'We do not have enough ' + `${existingAssembliesOfStock[a].assembly.AName}` +
                  ' assembly. Remainder is ' + `${existingAssembliesOfStock[a].StockAssemblyQty}`,
              });
            }
          } else {
            return res.status(409).send({
              assemblyMessage: 'Selected assembly is missing from the Stock. ',
            });
          }
        }
        for (let m = 0; m < transaction.modules.length; m++) {
          i++;
          moduleDoc.push(i);
          existingModulesOfStock.push(await this.stockService.getStocksByModuleId(transaction.modules[m].id));
          if (existingModulesOfStock[m] !== undefined) {
            if (existingModulesOfStock[m].module.id === transaction.modules[m].id &&
              parseInt(transaction.modules[m].TransactionModuleQty, 10) > parseInt(existingModulesOfStock[m].StockModuleQty, 10)) {
              return res.status(409).send({
                moduleMessage: 'We do not have enough ' + `${existingModulesOfStock[m].module.MName}` +
                  ' module. Remainder is ' + `${existingModulesOfStock[m].StockModuleQty}`,
              });
            }
          } else {
            return res.status(409).send({
              moduleMessage: 'Selected module is missing from the Stock. ',
            });
          }
        }
        if (componentDoc.length === transaction.components.length
          || assemblyDoc.length === transaction.assemblies.length
          || moduleDoc.length === transaction.modules.length) {
          const newTransaction = await this.transactionService.create(transaction);
          for (let n = 0; n < componentDoc.length; n++) {
            const data: any = {
              StockComponentQty: parseInt(existingComponentsOfStock[n].StockComponentQty, 10) - parseInt(transaction.components[n].TransactionComponentQty, 10),
            };
            await this.stockService.update(existingComponentsOfStock[n].id, data);
          }
          for (let n = 0; n < assemblyDoc.length; n++) {
            const data: any = {
              StockAssemblyQty: parseInt(existingAssembliesOfStock[n].StockAssemblyQty, 10) - parseInt(transaction.assemblies[n].TransactionAssemblyQty, 10),
            };
            await this.stockService.update(existingAssembliesOfStock[n].id, data);
          }
          for (let n = 0; n < moduleDoc.length; n++) {
            const data: any = {
              StockModuleQty: parseInt(existingModulesOfStock[n].StockModuleQty, 10) - parseInt(transaction.modules[n].TransactionModuleQty, 10),
            };
            await this.stockService.update(existingModulesOfStock[n].id, data);
          }
          return newTransaction;
        }
      }

    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Put('/transactions/:id')
  @Authorized()
  public async update(@CurrentUser({required: true}) user: any,
                      @Res() res: any,
                      @Param('id') id: string,
                      @Body() transaction: Transaction): Promise<Transaction> {
    const canDo = 'transaction-write';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.transactionService.update(id, transaction);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Delete('/transactions/:id')
  @Authorized()
  public async delete(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Res() res: any): Promise<void> {
    const canDo = 'transaction-delete';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.transactionService.delete(id, res);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  public async updateTransactionComponent(tCQty: any, tCPrice: any, storeId: any, transactionId: any, componentId: any): Promise<any> {
    const compTrans = 'UPDATE transaction_components_component SET TransactionComponentQty = "' + tCQty + '", ' +
      'TransactionComponentPrice = "' + tCPrice + '", Store_ID = "' + storeId + '"' +
      'WHERE transactionId = "' + transactionId + '" and componentId = "' + componentId + '"';
    await this.connection.query(compTrans, (error, compOfTransaction) => {
      if (error) {
        throw error;
      }
      return compOfTransaction;
    });
  }

  public async updateTransactionAssembly(tAQty: any, tAPrice: any, storeId: any, transactionId: any, assemblyId: any): Promise<any> {
    const assemblyTrans = 'UPDATE transaction_assemblies_assembly SET TransactionAssemblyQty = "' + tAQty + '", ' +
      'TransactionAssemblytPrice = "' + tAPrice + '", Store_ID = "' + storeId + '"' +
      'WHERE transactionId = "' + transactionId + '" and assemblyId = "' + assemblyId + '"';
    await this.connection.query(assemblyTrans, (error, assemblyOfTransaction) => {
      if (error) {
        throw error;
      }
      return assemblyOfTransaction;
    });
  }

  public async updateTransactionModule(tMQty: any, tMPrice: any, storeId: any, transactionId: any, moduleId: any): Promise<any> {
    const moduleTrans = 'UPDATE transaction_modules_module SET TransactionModuleQty = "' + tMQty + '", ' +
      'TransactionModulePrice = "' + tMPrice + '", Store_ID = "' + storeId + '"' +
      'WHERE transactionId = "' + transactionId + '" and moduleId = "' + moduleId + '"';
    await this.connection.query(moduleTrans, (error, moduleOfTransaction) => {
      if (error) {
        throw error;
      }
      return moduleOfTransaction;
    });
  }

}
