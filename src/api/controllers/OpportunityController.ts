import {
  Authorized,
  Body, CurrentUser, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req, Res
} from 'routing-controllers';

import {Opportunity} from '../models/Opportunity';
import {OpportunityService} from '../services/OpportunityService';
import {OpportunityNotFoundError} from '../errors/OpportunityNotFoundError';
import mysql from 'mysql';
import {TrainerService} from '../services/TrainerService';
import {ModuleService} from '../services/ModuleService';
import {AssemblyService} from '../services/AssemblyService';
import {UsersService} from '../services/UsersService';

@JsonController()
export class OpportunityController {

  public connection = mysql.createConnection({
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    user: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
  });

  constructor(
    private opportunityService: OpportunityService,
    private trainerService: TrainerService,
    private moduleService: ModuleService,
    private assemblyService: AssemblyService,
    private usersService: UsersService
  ) {
  }

  @Get('/opportunities')
  @Authorized()
  public async find(@CurrentUser({required: true}) user: any, @Res() res: any): Promise<Opportunity[]> {
    const canDo = 'opportunity-read';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      let opportunities: any;
      if (user.role === 'opportunity_owner') {
        opportunities = await this.opportunityService.findByOwningUser(user.id);
      } else {
        opportunities = await this.opportunityService.find();
      }
      for (const opportunity of opportunities) {
        if (opportunity.trainers) {
          for (const trainer of opportunity.trainers) {
            if (trainer.modules) {
              for (const mod of trainer.modules) {
                mod.MPhoto = Buffer.from(mod.MPhoto || '').toString();
                for (const assembly of mod.assemblies) {
                  assembly.APhoto = Buffer.from(assembly.APhoto || '').toString();
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
                  const moduleAssemblies: any = await this.moduleService.getModuleAssembliesByID(mod.id, assembly.id);
                  for (const moduleAssembly of moduleAssemblies) {
                    if (assembly.id === moduleAssembly.assemblyId) {
                      assembly.ModuleAssemblyQty = moduleAssembly.ModuleAssemblyQty;
                    }
                  }
                }
                for (const component of mod.components) {
                  component.CPoto = Buffer.from(component.CPoto || '').toString();
                  const moduleComponents: any = await this.moduleService.getModuleComponentsByID(mod.id, component.id);
                  for (const moduleComponent of moduleComponents) {
                    if (component.id === moduleComponent.componentId) {
                      component.ModuleComponentQty = moduleComponent.ModuleComponentQty;
                    }
                  }
                }
                for (const service of mod.services) {
                  const moduleServices: any = await this.moduleService.getModuleServicesByID(mod, service.id);
                  for (const moduleService of moduleServices) {
                    if (service.id === moduleService.servicesId) {
                      service.ModuleServiceQty = moduleService.ModuleServiceQty;
                    }
                  }
                }
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
            const opportunityTrainers: any = await this.opportunityService.getOpportunityTrainersByID(opportunity.id, trainer.id);
            for (const opportunityTrainer of opportunityTrainers) {
              if (trainer.id === opportunityTrainer.trainerId) {
                trainer.OpportunityTrainerQty = opportunityTrainer.OpportunityTrainerQty;
                trainer.OpportunityTrainerSellingPrice = opportunityTrainer.OpportunityTrainerSellingPrice;
              }
            }
          }
        }
        if (opportunity.services) {
          for (const service of opportunity.services) {
            const opportunityServices: any = await this.opportunityService.getOpportunityServicesByID(opportunity.id, service.id);
            for (const opportunityService of opportunityServices) {
              if (service.id === opportunityService.servicesId) {
                service.OpportunityServiceQty = opportunityService.OpportunityServiceQty;
                service.OpportunityServiceSellingPriceUSD = opportunityService.OpportunityServiceSellingPriceUSD;
              }
            }
          }
        }
      }
      return opportunities;
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Get('/opportunities/:id')
  @Authorized()
  @OnUndefined(OpportunityNotFoundError)
  public async one(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Res() res: any): Promise<Opportunity | undefined> {
    const canDo = 'opportunity-read';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      let opportunity: any;
      if (user.role === 'opportunity_owner') {
        opportunity = await this.opportunityService.findByOwningUser(user.id);
      } else {
        opportunity = await this.opportunityService.findOne(id);
      }
      if (opportunity.owninguser) {
        delete opportunity.owninguser.password;
      }
      if (opportunity.trainers) {
        for (const trainer of opportunity.trainers) {
          if (trainer.modules) {
            for (const mod of trainer.modules) {
              mod.MPhoto = Buffer.from(mod.MPhoto || '').toString();
              for (const assembly of mod.assemblies) {
                assembly.APhoto = Buffer.from(assembly.APhoto || '').toString();
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
                const moduleAssemblies: any = await this.moduleService.getModuleAssembliesByID(mod.id, assembly.id);
                for (const moduleAssembly of moduleAssemblies) {
                  if (assembly.id === moduleAssembly.assemblyId) {
                    assembly.ModuleAssemblyQty = moduleAssembly.ModuleAssemblyQty;
                  }
                }
              }
              for (const component of mod.components) {
                component.CPoto = Buffer.from(component.CPoto || '').toString();
                const moduleComponents: any = await this.moduleService.getModuleComponentsByID(mod.id, component.id);
                for (const moduleComponent of moduleComponents) {
                  if (component.id === moduleComponent.componentId) {
                    component.ModuleComponentQty = moduleComponent.ModuleComponentQty;
                  }
                }
              }
              for (const service of mod.services) {
                const moduleServices: any = await this.moduleService.getModuleServicesByID(mod, service.id);
                for (const moduleService of moduleServices) {
                  if (service.id === moduleService.servicesId) {
                    service.ModuleServiceQty = moduleService.ModuleServiceQty;
                  }
                }
              }
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
          const opportunityTrainers: any = await this.opportunityService.getOpportunityTrainersByID(opportunity.id, trainer.id);
          for (const opportunityTrainer of opportunityTrainers) {
            if (trainer.id === opportunityTrainer.trainerId) {
              trainer.OpportunityTrainerQty = opportunityTrainer.OpportunityTrainerQty;
              trainer.OpportunityTrainerSellingPrice = opportunityTrainer.OpportunityTrainerSellingPrice;
            }
          }
        }
      }
      if (opportunity.services) {
        for (const service of opportunity.services) {
          const opportunityServices: any = await this.opportunityService.getOpportunityServicesByID(opportunity.id, service.id);
          for (const opportunityService of opportunityServices) {
            if (service.id === opportunityService.servicesId) {
              service.OpportunityServiceQty = opportunityService.OpportunityServiceQty;
              service.OpportunityServiceSellingPriceUSD = opportunityService.OpportunityServiceSellingPriceUSD;
            }
          }
        }
      }
      return opportunity;
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Post('/opportunities')
  @Authorized()
  public async create(@CurrentUser({required: true}) user: any,
                      @Body() opportunity: any,
                      @Req() req: any,
                      @Res() res: any): Promise<Opportunity> {

    const canDo = 'opportunity-create';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      const newOpportunity = await this.opportunityService.create(opportunity);
      if (newOpportunity) {
        for (const service of opportunity.services) {
          const oppSer = 'UPDATE opportunity_services_services SET OpportunityServiceQty = "' + service.OpportunityServiceQty + '", ' +
            'OpportunityServiceSellingPriceUSD = "' + service.OpportunityServiceSellingPriceUSD + '" ' +
            'WHERE opportunityId = "' + newOpportunity.id + '" and servicesId = "' + service.id + '"';
          await this.connection.query(oppSer, (e, serOfOpportunity) => {
            if (e) {
              throw e;
            }
            return serOfOpportunity;
          });
        }

        for (const trainer of opportunity.trainers) {
          const oppTra = 'UPDATE opportunity_trainers_trainer SET OpportunityTrainerQty = "' + trainer.OpportunityTrainerQty + '", ' +
            'OpportunityTrainerSellingPrice = "' + trainer.OpportunityTrainerSellingPrice + '" ' +
            'WHERE opportunityId = "' + newOpportunity.id + '" and trainerId = "' + trainer.id + '"';
          await this.connection.query(oppTra, (err, traOfOpportunity) => {
            if (err) {
              throw err;
            }
            return traOfOpportunity;
          });
        }
      }

      return newOpportunity;
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Put('/opportunities/:id')
  @Authorized()
  public async update(@CurrentUser({required: true}) user: any,
                      @Param('id') id: string,
                      @Body() opportunity: any,
                      @Res() res: any): Promise<Opportunity> {
    const canDo = 'opportunity-write';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      const OpportunityServices: any = await this.opportunityService.getOpportunityServices(id);
      const OpportunityTrainers: any = await this.opportunityService.getOpportunityTrainers(id);
      if (opportunity.services && OpportunityServices) {
        for (const service of OpportunityServices) {
          opportunity.services.push({
            id: service.servicesId,
            OpportunityServiceQty: service.OpportunityServiceQty,
            OpportunityServiceSellingPriceUSD: service.OpportunityServiceSellingPriceUSD,
          });
          await this.opportunityService.deleteOpportunityService(service.opportunityId, service.servicesId);
        }
      }
      if (opportunity.trainers && OpportunityTrainers) {
        for (const trainer of OpportunityTrainers) {
          opportunity.trainers.push({
            id: trainer.trainerId,
            OpportunityTrainerQty: trainer.OpportunityTrainerQty,
            OpportunityTrainerSellingPrice: trainer.OpportunityTrainerSellingPrice,
          });
          await this.opportunityService.deleteOpportunityTrainer(trainer.opportunityId, trainer.trainerId);
        }
      }
      const updatedOpportunity: any = await this.opportunityService.update(id, opportunity);
      if (updatedOpportunity.services) {
        for (const service of updatedOpportunity.services) {
          const oppSer = 'UPDATE opportunity_services_services SET OpportunityServiceQty = "' + service.OpportunityServiceQty + '", ' +
            'OpportunityServiceSellingPriceUSD = "' + service.OpportunityServiceSellingPriceUSD + '" ' +
            'WHERE opportunityId = "' + id + '" and servicesId = "' + service.id + '"';
          await this.connection.query(oppSer, (e, serOfOpportunity) => {
            if (e) {
              throw e;
            }
            return serOfOpportunity;
          });
        }
      }
      if (updatedOpportunity.trainers) {
        for (const trainer of updatedOpportunity.trainers) {
          const oppTra = 'UPDATE opportunity_trainers_trainer SET OpportunityTrainerQty = "' + trainer.OpportunityTrainerQty + '", ' +
            'OpportunityTrainerSellingPrice = "' + trainer.OpportunityTrainerSellingPrice + '" ' +
            'WHERE opportunityId = "' + id + '" and trainerId = "' + trainer.id + '"';
          await this.connection.query(oppTra, (err, traOfOpportunity) => {
            if (err) {
              throw err;
            }
            return traOfOpportunity;
          });
        }
      }
      return updatedOpportunity;
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Delete('/opportunities/:id')
  @Authorized()
  public async delete(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Res() res: any): Promise<void> {
    const canDo = 'opportunity-delete';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.opportunityService.delete(id, res);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Put('/update/opportunity/trainer/:opportunityId/:trainerId')
  @Authorized()
  public async updateOpportunityTrainer(
    @CurrentUser({required: true}) user: any,
    @Param('opportunityId') opportunityId: string,
    @Param('trainerId') trainerId: string,
    @Body() data: any,
    @Res() res: any
  ): Promise<any> {
    const canDo = 'opportunity-write';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return await this.opportunityService.updateOpportunityTrainer(opportunityId, trainerId, data.OpportunityTrainerQty);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Put('/update/opportunity/service/:opportunityId/:serviceId')
  @Authorized()
  public async updateOpportunityService(
    @CurrentUser({required: true}) user: any,
    @Param('opportunityId') opportunityId: string,
    @Param('serviceId') serviceId: string,
    @Body() data: any,
    @Res() res: any
  ): Promise<any> {
    const canDo = 'opportunity-write';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return await this.opportunityService.updateOpportunityService(opportunityId, serviceId, data.OpportunityServiceQty);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Delete('/opportunity/trainer/:opportunityId/:trainerId')
  @Authorized()
  public async deleteOpportunityTrainer(
    @CurrentUser({required: true}) user: any,
    @Param('opportunityId') opportunityId: string,
    @Param('trainerId') trainerId: string,
    @Res() res: any): Promise<any> {
    const canDo = 'opportunity-delete';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return await this.opportunityService.deleteOpportunityTrainer(opportunityId, trainerId);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Delete('/opportunity/service/:opportunityId/:serviceId')
  @Authorized()
  public async deleteOpportunityService(
    @CurrentUser({required: true}) user: any,
    @Param('opportunityId') opportunityId: string,
    @Param('serviceId') serviceId: string,
    @Res() res: any): Promise<any> {
    const canDo = 'opportunity-delete';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return await this.opportunityService.deleteOpportunityService(opportunityId, serviceId);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

}
