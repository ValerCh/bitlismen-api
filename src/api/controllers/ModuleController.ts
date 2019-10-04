import mysql from 'mysql';
import {
  Authorized, Body, CurrentUser, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req,
  Res
} from 'routing-controllers';

import {ModuleNotFoundError} from '../errors/ModuleNotFoundError';
import {Module} from '../models/Module';
import {AssemblyService} from '../services/AssemblyService';
import {ModuleService} from '../services/ModuleService';
import {UsersService} from '../services/UsersService';

@JsonController()
export class ModuleController {

  public connection = mysql.createConnection({
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    user: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
  });

  constructor(
    private moduleService: ModuleService,
    private assemblyService: AssemblyService,
    private usersService: UsersService
  ) {
  }

  @Get('/modules')
  @Authorized()
  public async find(@CurrentUser({required: true}) user: any, @Res() res: any): Promise<Module[]> {
    const canDo = 'module-read';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator' || user.role === 'opportunity_owner') {
      const modules: any = await this.moduleService.find();
      for (const mod of modules) {
        for (const assembly of mod.assemblies) {
          assembly.APhoto = Buffer.from(assembly.APhoto || '').toString();
          if (assembly.components) {
            for (const component of assembly.components) {
              component.CPoto = Buffer.from(component.CPoto || '').toString();
              const assemblyComponents: any = await this.assemblyService.getAssemblyComponentsByID(assembly.id, component.id);
              for (const assemblyComponent of assemblyComponents) {
                if (component.id === assemblyComponent.componentId) {
                  component.AssemblyComponentQty = assemblyComponent.AssemblyComponentQty;
                }
              }
            }
          }
          if (assembly.services) {
            for (const service of assembly.services) {
              const assemblyServices: any = await this.assemblyService.getAssemblyServicesByID(assembly.id, service.id);
              for (const assemblyService of assemblyServices) {
                if (service.id === assemblyService.servicesId) {
                  service.AssemblyServiceQty = assemblyService.AssemblyServiceQty;
                }
              }
            }
          }
          const moduleAssemblies: any = await this.moduleService.getModuleAssembliesByID(mod.id, assembly.id);
          for (const moduleAssembly of moduleAssemblies) {
            if (assembly.id === moduleAssembly.assemblyId) {
              assembly.ModuleAssemblyQty = moduleAssembly.ModuleAssemblyQty;
            }
          }
        }
        if (mod.components) {
          for (const component of mod.components) {
            const moduleComponents: any = await this.moduleService.getModuleComponentsByID(mod.id, component.id);
            for (const moduleComponent of moduleComponents) {
              if (component.id === moduleComponent.componentId) {
                component.ModuleComponentQty = moduleComponent.ModuleComponentQty;
              }
            }
          }
        }
        if (mod.services) {
          for (const service of mod.services) {
            const moduleServices: any = await this.moduleService.getModuleServicesByID(mod.id, service.id);
            for (const moduleService of moduleServices) {
              if (service.id === moduleService.servicesId) {
                service.ModuleServiceQty = moduleService.ModuleServiceQty;
              }
            }
          }
        }
        mod.MPhoto = Buffer.from(mod.MPhoto).toString();
      }
      return modules;
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Get('/modules/:id')
  @Authorized()
  @OnUndefined(ModuleNotFoundError)
  public async one(@CurrentUser({required: true}) user: any, @Res() res: any, @Param('id') id: string): Promise<any | undefined> {
    const canDo = 'module-read';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      const mod: any = await this.moduleService.findOne(id);
      if (mod.assemblies) {
        for (const assembly of mod.assemblies) {
          assembly.APhoto = Buffer.from(assembly.APhoto || '').toString();
          if (assembly.components) {
            for (const component of assembly.components) {
              component.CPoto = Buffer.from(component.CPoto || '').toString();
              const assemblyComponents: any = await this.assemblyService.getAssemblyComponentsByID(assembly.id, component.id);
              for (const assemblyComponent of assemblyComponents) {
                if (component.id === assemblyComponent.componentId) {
                  component.AssemblyComponentQty = assemblyComponent.AssemblyComponentQty;
                }
              }
            }
          }
          if (assembly.services) {
            for (const service of assembly.services) {
              const assemblyServices: any = await this.assemblyService.getAssemblyServicesByID(assembly.id, service.id);
              for (const assemblyService of assemblyServices) {
                if (service.id === assemblyService.servicesId) {
                  service.AssemblyServiceQty = assemblyService.AssemblyServiceQty;
                }
              }
            }
          }
          const moduleAssemblies: any = await this.moduleService.getModuleAssembliesByID(mod.id, assembly.id);
          for (const moduleAssembly of moduleAssemblies) {
            if (assembly.id === moduleAssembly.assemblyId) {
              assembly.ModuleAssemblyQty = moduleAssembly.ModuleAssemblyQty;
            }
          }
        }
      }
      if (mod.components) {
        for (const component of mod.components) {
          const moduleComponents: any = await this.moduleService.getModuleComponentsByID(mod.id, component.id);
          for (const moduleComponent of moduleComponents) {
            if (component.id === moduleComponent.componentId) {
              component.ModuleComponentQty = moduleComponent.ModuleComponentQty;
            }
          }
        }
      }
      if (mod.services) {
        for (const service of mod.services) {
          const moduleServices: any = await this.moduleService.getModuleServicesByID(mod.id, service.id);
          for (const moduleService of moduleServices) {
            if (service.id === moduleService.servicesId) {
              service.ModuleServiceQty = moduleService.ModuleServiceQty;
            }
          }
        }
      }
      mod.MPhoto = Buffer.from(mod.MPhoto).toString();
      return mod;
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Post('/modules')
  @Authorized()
  public async create(@CurrentUser({required: true}) user: any,
                      @Body() modules: any,
                      @Req() req: any,
                      @Res() res: any): Promise<Module> {

    const canDo = 'module-create';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      const newModule = await this.moduleService.create(modules);
      if (newModule) {
        for (const component of modules.components) {
          if (component.ModuleComponentQty > 1) {
            await this.moduleService.updateModuleComponent(newModule.id, component.id, component.ModuleComponentQty);
          }
        }

        for (const service of modules.services) {
          if (service.ModuleServiceQty > 1) {
            await this.moduleService.updateModuleService(newModule.id, service.id, service.ModuleServiceQty);
          }
        }

        for (const assembly of modules.assemblies) {
          if (assembly.ModuleAssemblyQty > 1) {
            await this.moduleService.updateModuleAssembly(newModule.id, assembly.id, assembly.ModuleAssemblyQty);
          }
        }
      }

      return newModule;
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Put('/modules/:id')
  @Authorized()
  public async update(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Body() modules: any, @Res() res: any): Promise<Module> {
    const canDo = 'module-write';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      const ModuleComponent: any = await this.moduleService.getModuleComponents(id);
      const ModuleServices: any = await this.moduleService.getModuleServices(id);
      const ModuleAssemblies: any = await this.moduleService.getModuleAssemblies(id);
      if (modules.components && ModuleComponent) {
        for (const component of ModuleComponent) {
          modules.components.push({
            id: component.componentId,
            ModuleComponentQty: component.ModuleComponentQty,
          });
          await this.moduleService.deleteModuleComponent(component.moduleId, component.componentId);
        }
      }
      if (modules.services && ModuleServices) {
        for (const service of ModuleServices) {
          modules.services.push({
            id: service.servicesId,
            ModuleServiceQty: service.ModuleServiceQty,
          });
          await this.moduleService.deleteModuleService(service.moduleId, service.servicesId);
        }
      }
      if (modules.assemblies && ModuleAssemblies) {
        for (const assembly of ModuleAssemblies) {
          modules.assemblies.push({
            id: assembly.assemblyId,
            ModuleAssemblyQty: assembly.ModuleAssemblyQty,
          });
          await this.moduleService.deleteModuleAssembly(assembly.moduleId, assembly.assemblyId);
        }
      }
      const updatedModule: any = await this.moduleService.update(id, modules);
      if (updatedModule.components) {
        for (const component of updatedModule.components) {
          if (component.ModuleComponentQty > 1) {
            await this.moduleService.updateModuleComponent(id, component.id, component.ModuleComponentQty);
            // const modCom = 'UPDATE module_components_component SET ModuleComponentQty = "' + component.ModuleComponentQty + '" ' +
            //   'WHERE moduleId = "' + id + '" and componentId = "' + component.id + '"';
            // await this.connection.query(modCom, (e, compOfModel) => {
            //   if (e) {
            //     throw e;
            //   }
            // });
          }
        }
      }
      if (updatedModule.services) {
        for (const service of updatedModule.services) {
          if (service.ModuleServiceQty > 1) {
            await this.moduleService.updateModuleService(id, service.id, service.ModuleServiceQty);
            // const modSer = 'UPDATE module_services_services SET ModuleServiceQty = "' + service.ModuleServiceQty + '" ' +
            //   'WHERE moduleId = "' + id + '" and servicesId = "' + service.id + '"';
            // await this.connection.query(modSer, (err, serOfModule) => {
            //   if (err) {
            //     throw err;
            //   }
            // });
          }
        }
      }
      if (updatedModule.assemblies) {
        for (const assembly of updatedModule.assemblies) {
          if (assembly.ModuleAssemblyQty > 1) {
            await this.moduleService.updateModuleAssembly(id, assembly.id, assembly.ModuleAssemblyQty);
            // const modAss = 'UPDATE module_assemblies_assembly SET ModuleAssemblyQty = "' + assembly.ModuleAssemblyQty + '" ' +
            //   'WHERE moduleId = "' + id + '" and assemblyId = "' + assembly.id + '"';
            // await this.connection.query(modAss, (error, assOfModule) => {
            //   if (error) {
            //     throw error;
            //   }
            // });
          }
        }
      }
      return updatedModule;
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Delete('/modules/:id')
  @Authorized()
  public async delete(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Res() res: any): Promise<void> {
    const canDo = 'module-delete';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.moduleService.delete(id, res);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Put('/update/module/assembly/:moduleId/:assemblyId')
  @Authorized()
  public async updateModuleAssembly(
    @CurrentUser({required: true}) user: any,
    @Param('moduleId') moduleId: string,
    @Param('assemblyId') assemblyId: string,
    @Body() data: any,
    @Res() res: any
  ): Promise<any> {
    const canDo = 'module-write';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return await this.moduleService.updateModuleAssembly(moduleId, assemblyId, data.ModuleAssemblyQty);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Put('/update/module/component/:moduleId/:componentId')
  @Authorized()
  public async updateModuleComponent(
    @CurrentUser({required: true}) user: any,
    @Param('moduleId') moduleId: string,
    @Param('componentId') componentId: string,
    @Body() data: any,
    @Res() res: any
  ): Promise<any> {
    const canDo = 'module-write';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return await this.moduleService.updateModuleComponent(moduleId, componentId, data.ModuleComponentQty);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Put('/update/module/service/:moduleId/:servicesId')
  @Authorized()
  public async updateModuleService(
    @CurrentUser({required: true}) user: any,
    @Param('moduleId') moduleId: string,
    @Param('servicesId') servicesId: string,
    @Body() data: any,
    @Res() res: any
  ): Promise<any> {
    const canDo = 'module-write';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return await this.moduleService.updateModuleService(moduleId, servicesId, data.ModuleServiceQty);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Delete('/module/assembly/:moduleId/:assemblyId')
  @Authorized()
  public async deleteModuleAssembly(
    @CurrentUser({required: true}) user: any,
    @Param('moduleId') moduleId: string,
    @Param('assemblyId') assemblyId: string,
    @Res() res: any): Promise<any> {
    const canDo = 'module-delete';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return await this.moduleService.deleteModuleAssembly(moduleId, assemblyId);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Delete('/module/component/:moduleId/:componentId')
  @Authorized()
  public async deleteModuleComponent(
    @CurrentUser({required: true}) user: any,
    @Param('moduleId') moduleId: string,
    @Param('componentId') componentId: string,
    @Res() res: any): Promise<any> {
    const canDo = 'module-delete';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return await this.moduleService.deleteModuleComponent(moduleId, componentId);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Delete('/module/service/:moduleId/:servicesId')
  @Authorized()
  public async deleteModuleService(
    @CurrentUser({required: true}) user: any,
    @Param('moduleId') moduleId: string,
    @Param('servicesId') servicesId: string,
    @Res() res: any): Promise<any> {
    const canDo = 'module-delete';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return await this.moduleService.deleteModuleService(moduleId, servicesId);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }
}
