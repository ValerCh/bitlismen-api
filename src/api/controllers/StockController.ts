import {
  Authorized,
  Body, CurrentUser, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req, Res
} from 'routing-controllers';

import {Stock} from '../models/Stock';
import {StockService} from '../services/StockService';
import {StockNotFoundError} from '../errors/StockNotFoundError';
import mysql from 'mysql';

@JsonController()
export class StockController {

  public connection = mysql.createConnection({
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    user: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
  });

  constructor(
    private stockService: StockService
  ) {
  }

  @Get('/stocks')
  // @Authorized()
  public async find(): Promise<Stock[]> {
    const stocks: any = await this.stockService.find();
    for (const stock of stocks) {
      const StockAssembly = await this.stockService.getStockAssemblies(stock.id);
      const StockComponent = await this.stockService.getStockComponents(stock.id);
      const StockModule = await this.stockService.getStockModules(stock.id);
      if (stock.components) {
        for (let sc = 0; sc < stock.components.length; sc++) {
          stock.components[sc].CPoto = Buffer.from(stock.components[sc].CPoto).toString();
          if (stock.components[sc].id === StockComponent[sc].componentId) {
            stock.components[sc].StockComponentQty = StockComponent[sc].StockComponentQty;
            stock.components[sc].StockComponentPrice = StockComponent[sc].StockComponentPrice;
          }
        }
      }
      if (stock.modules) {
        for (let sm = 0; sm < stock.modules.length; sm++) {
          stock.modules[sm].MPhoto = Buffer.from(stock.modules[sm].MPhoto).toString();
          if (stock.modules[sm].id === StockModule[sm].moduleId) {
            stock.modules[sm].StockModuleQty = StockModule[sm].StockModuleQty;
            stock.modules[sm].StockModulePrice = StockModule[sm].StockModulePrice;
          }
        }
      }
      if (stock.assemblies) {
        for (let sa = 0; sa < stock.assemblies.length; sa++) {
          stock.assemblies[sa].APhoto = Buffer.from(stock.assemblies[sa].APhoto).toString();
          if (stock.assemblies[sa].id === StockAssembly[sa].assemblyId) {
            stock.assemblies[sa].StockAssemblyQty = StockAssembly[sa].StockAssemblyQty;
            stock.assemblies[sa].StockAssemblyPrice = StockAssembly[sa].StockAssemblyPrice;
          }
        }
      }
    }
    return stocks;
  }

  @Get('/stocks/:id')
  @Authorized()
  @OnUndefined(StockNotFoundError)
  public async one(@Param('id') id: string): Promise<Stock | undefined> {
    const stock: any = await this.stockService.findOne(id);
    const StockAssembly = await this.stockService.getStockAssemblies(id);
    const StockComponent = await this.stockService.getStockComponents(id);
    const StockModule = await this.stockService.getStockModules(id);
    if (stock.components) {
      for (let sc = 0; sc < stock.components.length; sc++) {
        stock.components[sc].CPoto = Buffer.from(stock.components[sc].CPoto).toString();
        if (stock.components[sc].id === StockComponent[sc].componentId) {
          stock.components[sc].StockComponentQty = StockComponent[sc].StockComponentQty;
          stock.components[sc].StockComponentPrice = StockComponent[sc].StockComponentPrice;
        }
      }
    }
    if (stock.modules) {
      for (let sm = 0; sm < stock.modules.length; sm++) {
        stock.modules[sm].MPhoto = Buffer.from(stock.modules[sm].MPhoto).toString();
        if (stock.modules[sm].id === StockModule[sm].moduleId) {
          stock.modules[sm].StockModuleQty = StockModule[sm].StockModuleQty;
          stock.modules[sm].StockModulePrice = StockModule[sm].StockModulePrice;
        }
      }
    }
    if (stock.assemblies) {
      for (let sa = 0; sa < stock.assemblies.length; sa++) {
        stock.assemblies[sa].APhoto = Buffer.from(stock.assemblies[sa].APhoto).toString();
        if (stock.assemblies[sa].id === StockAssembly[sa].assemblyId) {
          stock.assemblies[sa].StockAssemblyQty = StockAssembly[sa].StockAssemblyQty;
          stock.assemblies[sa].StockAssemblyPrice = StockAssembly[sa].StockAssemblyPrice;
        }
      }
    }
    return stock;
  }

  @Post('/stocks')
  @Authorized()
  public async create(@CurrentUser({required: true}) user: any,
                      @Body() stock: any,
                      @Req() req: any,
                      @Res() res: any): Promise<any> {

    if (user.role === 'administrator') {
      let newStock: any;
      if (stock.component.length > 0) {
        const stockComponent = await this.stockService.getStocksByComponentId(stock.component[0].id);
        if (stockComponent) {
          const data: any = {
            StockComponentQty: stock.component[0].StockComponentQty,
            StockComponentPrice: stock.component[0].StockComponentPrice,
          };
          await this.stockService.update(stockComponent.id, data);

          return stockComponent;
        } else {
          stock.StockComponentQty = stock.component[0].StockComponentQty;
          stock.StockComponentPrice = stock.component[0].StockComponentPrice;
          newStock = await this.stockService.create(stock);
          if (newStock) {
            const data: any = {
              componentId: stock.component[0].id,
            };
            await this.stockService.update(newStock.id, data);
          }
        }

        return newStock;
      }
      if (stock.assembly.length > 0) {
        const stockAssembly = await this.stockService.getStocksByAssemblyId(stock.assembly[0].id);
        if (stockAssembly) {
          const data: any = {
            StockAssemblyQty: stock.assembly[0].StockAssemblyQty,
            StockAssemblyPrice: stock.assembly[0].StockAssemblyPrice,
          };
          await this.stockService.update(stockAssembly.id, data);

          return stockAssembly;
        } else {
          stock.StockAssemblyQty = stock.assembly[0].StockAssemblyQty;
          stock.StockAssemblyPrice = stock.assembly[0].StockAssemblyPrice;
          newStock = await this.stockService.create(stock);
          if (newStock) {
            const data: any = {
              assemblyId: stock.assembly[0].id,
            };
            await this.stockService.update(newStock.id, data);
          }
        }

        return newStock;
      }
      if (stock.module.length > 0) {
        const stockModule = await this.stockService.getStocksByModuleId(stock.module[0].id);
        if (stockModule) {
          const data: any = {
            StockModuleQty: stock.module[0].StockModuleQty,
            StockModulePrice: stock.module[0].StockModulePrice,
          };
          await this.stockService.update(stockModule.id, data);

          return stockModule;
        } else {
          stock.StockModuleQty = stock.module[0].StockModuleQty;
          stock.StockModulePrice = stock.module[0].StockModulePrice;
          newStock = await this.stockService.create(stock);
          if (newStock) {
            const data: any = {
              moduleId: stock.module[0].id,
            };
            await this.stockService.update(newStock.id, data);
          }
        }

        return newStock;
      }

    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Put('/stocks/:id')
  @Authorized()
  public async update(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Body() stock: any, @Res() res: any): Promise<Stock> {
    if (user.role === 'administrator') {
      const StockModules: any = await this.stockService.getStockModules(id);
      const StockAssemblies: any = await this.stockService.getStockAssemblies(id);
      const StockComponents: any = await this.stockService.getStockComponents(id);
      if (stock.modules && StockModules) {
        for (const mod of StockModules) {
          stock.modules.push({
            id: mod.moduleId,
            StockModuleQty: mod.StockModuleQty,
            StockModulePrice: mod.StockModulePrice,
          });
          await this.stockService.deleteStockModule(mod.stockId, mod.moduleId);
        }
      }
      if (stock.assemblies && StockAssemblies) {
        for (const assembly of StockAssemblies) {
          stock.assemblies.push({
            id: assembly.assemblyId,
            StockAssemblyQty: assembly.StockAssemblyQty,
            StockAssemblyPrice: assembly.StockAssemblyPrice,
          });
          await this.stockService.deleteStockAssembly(assembly.stockId, assembly.assemblyId);
        }
      }
      if (stock.components && StockComponents) {
        for (const component of StockComponents) {
          stock.components.push({
            id: component.componentId,
            StockComponentQty: component.StockComponentQty,
            StockComponentPrice: component.StockComponentPrice,
          });
          await this.stockService.deleteStockComponent(component.stockId, component.componentId);
        }
      }
      const updatedStock: any = await this.stockService.update(id, stock);
      if (updatedStock.modules) {
        for (const mod of updatedStock.modules) {
          const sql = "UPDATE stock_modules_module SET StockModuleQty = '" + mod.StockModuleQty + "', " +
            "StockModulePrice = '" + mod.StockModulePrice + "' " +
            "WHERE stockId = '" + id + "' and moduleId = '" + mod.id + "'";
          await this.connection.query(sql, (error, result) => {
            if (error) {
              throw error;
            }
          });
        }
      }
      if (updatedStock.assemblies) {
        for (const assembly of updatedStock.assemblies) {
          const sql = "UPDATE stock_assemblies_assembly SET StockAssemblyQty = '" + assembly.StockAssemblyQty + "', " +
            "StockAssemblyPrice = '" + assembly.StockAssemblyPrice + "' " +
            "WHERE stockId = '" + id + "' and assemblyId = '" + assembly.id + "'";
          await this.connection.query(sql, (error, result) => {
            if (error) {
              throw error;
            }
          });
        }
      }
      if (updatedStock.components) {
        for (const component of updatedStock.components) {
          const sql = "UPDATE stock_components_component SET StockComponentQty = '" + component.StockComponentQty + "', " +
            "StockComponentPrice = '" + component.StockComponentPrice + "' " +
            "WHERE stockId = '" + id + "' and componentId = '" + component.id + "'";
          await this.connection.query(sql, (error, result) => {
            if (error) {
              throw error;
            }
          });
        }
      }
      return updatedStock;
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Get('/stock_by_component/:id')
  @Authorized()
  public async findStocks(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Res() res: any): Promise<any> {
    if (user.role === 'administrator') {
      return await this.stockService.getStocksByComponentId(id);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Delete('/stocks/:id')
  @Authorized()
  public delete(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Res() res: any): Promise<void> {
    if (user.role === 'administrator') {
      return this.stockService.delete(id, res);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Delete('/stock/assembly')
  @Authorized()
  public async deleteStockAssembly(@CurrentUser({required: true}) user: any, @Body() data: any, @Res() res: any): Promise<any> {
    if (user.role === 'administrator') {
      return await this.stockService.deleteStockAssembly(data.stockId, data.assemblyId);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Delete('/stock/component')
  @Authorized()
  public async deleteStockComponent(@CurrentUser({required: true}) user: any, @Body() data: any, @Res() res: any): Promise<any> {
    if (user.role === 'administrator') {
      return await this.stockService.deleteStockComponent(data.stockId, data.componentId);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Delete('/stock/module')
  @Authorized()
  public async deleteStockModule(@CurrentUser({required: true}) user: any, @Body() data: any, @Res() res: any): Promise<any> {
    if (user.role === 'administrator') {
      return await this.stockService.deleteStockModule(data.stockId, data.moduleId);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

}
