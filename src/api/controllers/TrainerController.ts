import mysql from 'mysql';
import {
    Authorized, Body, CurrentUser, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req,
    Res
} from 'routing-controllers';

import { TrainerNotFoundError } from '../errors/TrainerNotFoundError';
import { Trainer } from '../models/Trainer';
import { AssemblyService } from '../services/AssemblyService';
import { ModuleService } from '../services/ModuleService';
import { TrainerService } from '../services/TrainerService';
import { UsersService } from '../services/UsersService';

@JsonController()
export class TrainerController {

  public connection = mysql.createConnection({
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    user: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
  });

  constructor(
    private trainerService: TrainerService,
    private moduleService: ModuleService,
    private assemblyService: AssemblyService,
    private usersService: UsersService
  ) {
  }

  @Get('/trainers')
  @Authorized()
  public async find(@CurrentUser({required: true}) user: any, @Res() res: any): Promise<Trainer[]> {
    const canDo = 'trainer-read';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator' || user.role === 'opportunity_owner') {
      const trainers: any = await this.trainerService.find();
      for (const trainer of trainers) {
        if (trainer.modules) {
          for (const mod of trainer.modules) {
            if (mod.assemblies) {
              for (const assembly of mod.assemblies) {
                assembly.APhoto = Buffer.from(assembly.APhoto || '').toString();
                const moduleAssemblies: any = await this.moduleService.getModuleAssembliesByID(mod.id, assembly.id);
                for (const component of assembly.components) {
                  component.CPoto = Buffer.from(component.CPoto || '').toString();
                  const assemblyComponents: any = await this.assemblyService.getAssemblyComponentsByID(assembly.id, component.id);
                  for (const assemblyComponent of assemblyComponents) {
                    if (component.id === assemblyComponent.componentId) {
                      component.AssemblyComponentQty = assemblyComponent.AssemblyComponentQty;
                    }
                  }
                }
                for (const service of assembly.services) {
                  const assemblyServices: any = await this.assemblyService.getAssemblyServicesByID(assembly.id, service.id);
                  for (const assemblyService of assemblyServices) {
                    if (service.id === assemblyService.servicesId) {
                      service.AssemblyServiceQty = assemblyService.AssemblyServiceQty;
                    }
                  }
                }
                for (const moduleAssembly of moduleAssemblies) {
                  if (assembly.id === moduleAssembly.assemblyId) {
                    assembly.ModuleAssemblyQty = moduleAssembly.ModuleAssemblyQty;
                  }
                }
              }
            }
            if (mod.components) {
              for (const component of mod.components) {
                component.CPoto = Buffer.from(component.CPoto || '').toString();
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
                const moduleServices: any = await this.moduleService.getModuleServicesByID(mod, service.id);
                for (const moduleService of moduleServices) {
                  if (service.id === moduleService.servicesId) {
                    service.ModuleServiceQty = moduleService.ModuleServiceQty;
                  }
                }
              }
            }
            mod.MPhoto = Buffer.from(mod.MPhoto || '').toString();
            const trainerModules: any = await this.trainerService.getTrainerModulesByID(trainer.id, mod.id);
            for (const trainerModule of trainerModules) {
              if (mod.id === trainerModule.moduleId) {
                mod.TrainerModuleQty = trainerModule.TrainerModuleQty;
              }
            }
          }
        }
        if (trainer.services) {
          for (const service of trainer.services) {
            const trainerServices: any = await this.trainerService.getTrainerServicesByID(trainer.id, service.id);
            for (const trainerService of trainerServices) {
              if (service.id === trainerService.servicesId) {
                service.TrainerServiceQty = trainerService.TrainerServiceQty;
              }
            }
          }
        }
      }
      return trainers;
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Get('/trainers/:id')
  @Authorized()
  @OnUndefined(TrainerNotFoundError)
  public async one(@CurrentUser({required: true}) user: any, @Res() res: any, @Param('id') id: string): Promise<Trainer | undefined> {
    const canDo = 'trainer-read';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator' || user.role === 'opportunity_owner') {
      const trainer: any = await this.trainerService.findOne(id);
      for (const mod of trainer.modules) {
        if (mod.assemblies) {
          for (const assembly of mod.assemblies) {
            assembly.APhoto = Buffer.from(assembly.APhoto || '').toString();
            const moduleAssemblies: any = await this.moduleService.getModuleAssembliesByID(mod.id, assembly.id);
            for (const component of assembly.components) {
              component.CPoto = Buffer.from(component.CPoto || '').toString();
              const assemblyComponents: any = await this.assemblyService.getAssemblyComponentsByID(assembly.id, component.id);
              for (const assemblyComponent of assemblyComponents) {
                if (component.id === assemblyComponent.componentId) {
                  component.AssemblyComponentQty = assemblyComponent.AssemblyComponentQty;
                }
              }
            }
            for (const service of assembly.services) {
              const assemblyServices: any = await this.assemblyService.getAssemblyServicesByID(assembly.id, service.id);
              for (const assemblyService of assemblyServices) {
                if (service.id === assemblyService.servicesId) {
                  service.AssemblyServiceQty = assemblyService.AssemblyServiceQty;
                }
              }
            }
            for (const moduleAssembly of moduleAssemblies) {
              if (assembly.id === moduleAssembly.assemblyId) {
                assembly.ModuleAssemblyQty = moduleAssembly.ModuleAssemblyQty;
              }
            }
          }
        }
        if (mod.components) {
          for (const component of mod.components) {
            component.CPoto = Buffer.from(component.CPoto || '').toString();
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
            const moduleServices: any = await this.moduleService.getModuleServicesByID(mod, service.id);
            for (const moduleService of moduleServices) {
              if (service.id === moduleService.servicesId) {
                service.ModuleServiceQty = moduleService.ModuleServiceQty;
              }
            }
          }
        }
        mod.MPhoto = Buffer.from(mod.MPhoto || '').toString();
        const trainerModules: any = await this.trainerService.getTrainerModulesByID(trainer.id, mod.id);
        for (const trainerModule of trainerModules) {
          if (mod.id === trainerModule.moduleId) {
            mod.TrainerModuleQty = trainerModule.TrainerModuleQty;
          }
        }
      }
      for (const service of trainer.services) {
        const trainerServices: any = await this.trainerService.getTrainerServicesByID(trainer.id, service.id);
        for (const trainerService of trainerServices) {
          if (service.id === trainerService.servicesId) {
            service.TrainerServiceQty = trainerService.TrainerServiceQty;
          }
        }
      }
      return trainer;
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Post('/trainers')
  @Authorized()
  public async create(@CurrentUser({required: true}) user: any,
                      @Body() trainer: any,
                      @Req() req: any,
                      @Res() res: any): Promise<Trainer> {

    const canDo = 'trainer-create';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      const newTrainer = await this.trainerService.create(trainer);
      if (newTrainer) {
        for (const mod of trainer.modules) {
          if (mod.TrainerModuleQty > 1) {
            await this.trainerService.updateTrainerModule(newTrainer.id, mod.id, mod.TrainerModuleQty);
          }
        }

        for (const service of trainer.services) {
          if (service.TrainerServiceQty > 1) {
            await this.trainerService.updateTrainerService(newTrainer.id, service.id, service.TrainerServiceQty);
          }
        }
      }

      return newTrainer;
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Put('/trainers/:id')
  @Authorized()
  public async update(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Body() trainer: any, @Res() res: any): Promise<Trainer> {
    const canDo = 'trainer-write';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      const TrainerServices: any = await this.trainerService.getTrainerServices(id);
      const TrainerModule: any = await this.trainerService.getTrainerModules(id);
      if (trainer.services && TrainerServices) {
        for (const service of TrainerServices) {
          trainer.services.push({
            id: service.servicesId,
            TrainerServiceQty: service.TrainerServiceQty,
          });
          await this.trainerService.deleteTrainerService(service.trainerId, service.servicesId);
        }
      }
      if (trainer.modules && TrainerModule) {
        for (const mod of TrainerModule) {
          trainer.modules.push({
            id: mod.moduleId,
            TrainerModuleQty: mod.TrainerModuleQty,
          });
          await this.trainerService.deleteTrainerModule(mod.trainerId, mod.moduleId);
        }
      }
      const updatedTrainer: any = await this.trainerService.update(id, trainer);
      if (updatedTrainer.services) {
        for (const service of updatedTrainer.services) {
          if (service.TrainerServiceQty > 1) {
            await this.trainerService.updateTrainerService(id, service.id, service.TrainerServiceQty);
          }
        }
      }
      if (updatedTrainer.modules) {
        for (const mod of updatedTrainer.modules) {
          if (mod.TrainerModuleQty > 1) {
            await this.trainerService.updateTrainerModule(id, mod.id, mod.TrainerModuleQty);
          }
        }
      }
      return updatedTrainer;
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Delete('/trainers/:id')
  @Authorized()
  public async delete(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Res() res: any): Promise<void> {
    const canDo = 'trainer-delete';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.trainerService.delete(id, res);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Put('/update/trainer/module/:trainerId/:moduleId')
  @Authorized()
  public async updateTrainerModule(
    @CurrentUser({required: true}) user: any,
    @Param('trainerId') trainerId: string,
    @Param('moduleId') moduleId: string,
    @Body() data: any,
    @Res() res: any
  ): Promise<any> {
    const canDo = 'trainer-write';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return await this.trainerService.updateTrainerModule(trainerId, moduleId, data.TrainerModuleQty);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Put('/update/trainer/service/:trainerId/:servicesId')
  @Authorized()
  public async updateTrainerService(
    @CurrentUser({required: true}) user: any,
    @Param('trainerId') trainerId: string,
    @Param('servicesId') servicesId: string,
    @Body() data: any,
    @Res() res: any
  ): Promise<any> {
    const canDo = 'trainer-write';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return await this.trainerService.updateTrainerService(trainerId, servicesId, data.TrainerServiceQty);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Delete('/trainer/module/:trainerId/:moduleId')
  @Authorized()
  public async deleteTrainerModule(
    @CurrentUser({required: true}) user: any,
    @Param('trainerId') trainerId: string,
    @Param('moduleId') moduleId: string,
    @Res() res: any): Promise<any> {
    const canDo = 'trainer-delete';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return await this.trainerService.deleteTrainerModule(trainerId, moduleId);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Delete('/trainer/service/:trainerId/:servicesId')
  @Authorized()
  public async deleteTrainerService(
    @CurrentUser({required: true}) user: any,
    @Param('trainerId') trainerId: string,
    @Param('servicesId') servicesId: string,
    @Res() res: any): Promise<any> {
    const canDo = 'trainer-delete';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return await this.trainerService.deleteTrainerService(trainerId, servicesId);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }
}
