import {
  Authorized,
  Body, CurrentUser, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req, Res, UploadedFile
} from 'routing-controllers';

import {Assembly} from '../models/Assembly';
import {AssemblyService} from '../services/AssemblyService';
import {AssemblyNotFoundError} from '../errors/AssemblyNotFoundError';
import mysql from 'mysql';
import {UsersService} from '../services/UsersService';

@JsonController()
export class ComponentController {

  public connection = mysql.createConnection({
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    user: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
  });

  constructor(
    private assemblyService: AssemblyService,
    private usersService: UsersService
  ) {
  }

  @Get('/assemblies')
  @Authorized()
  public async find(@CurrentUser({required: true}) user: any, @Res() res: any): Promise<Assembly[]> {
    const canDo = 'assembly-read';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator' || user.role === 'opportunity_owner') {
      const assemblies: any = await this.assemblyService.find();
      for (const assembly of assemblies) {
        for (const component of assembly.components) {
          component.CPoto = Buffer.from(component.CPoto).toString();
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
        assembly.APhoto = Buffer.from(assembly.APhoto).toString();
      }
      return assemblies;
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Get('/assemblies/:id')
  @Authorized()
  @OnUndefined(AssemblyNotFoundError)
  public async one(@CurrentUser({required: true}) user: any, @Res() res: any, @Param('id') id: string): Promise<any | undefined> {
    const canDo = 'assembly-read';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      const assembly: any = await this.assemblyService.findOne(id);
      assembly.APhoto = Buffer.from(assembly.APhoto).toString();
      for (const component of assembly.components) {
        component.CPoto = Buffer.from(component.CPoto).toString();
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
      return assembly;
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Post('/assemblies')
  @Authorized()
  public async create(@CurrentUser({required: true}) user: any,
                      @Body() assembly: any,
                      @UploadedFile('file') file: any,
                      @Req() req: any,
                      @Res() res: any): Promise<Assembly> {

    const canDo = 'assembly-create';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      const newAssembly = await this.assemblyService.create(assembly);
      if (newAssembly) {

        for (const component of assembly.components) {
          if (component.AssemblyComponentQty > 1) {
            await this.assemblyService.updateAssemblyComponent(newAssembly.id, component.id, component.AssemblyComponentQty);
          }
        }

        for (const service of assembly.services) {
          if (service.AssemblyServiceQty > 1) {
            await this.assemblyService.updateAssemblyService(newAssembly.id, service.id, service.AssemblyServiceQty);
          }
        }
      }
      return newAssembly;
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Put('/assemblies/:id')
  @Authorized()
  public async update(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Body() assembly: any, @Res() res: any): Promise<Assembly> {
    const canDo = 'assembly-write';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      const assemblyComponent: any = await this.assemblyService.getAssemblyComponents(id);
      const assemblyServices: any = await this.assemblyService.getAssemblyServices(id);
      if (assembly.components && assemblyComponent) {
        for (const component of assemblyComponent) {
          assembly.components.push({
            id: component.componentId,
            AssemblyComponentQty: component.AssemblyComponentQty,
          });
          await this.assemblyService.deleteAssemblyComponent(component.assemblyId, component.componentId);
        }
      }
      if (assembly.services && assemblyServices) {
        for (const service of assemblyServices) {
          assembly.services.push({
            id: service.servicesId,
            AssemblyServiceQty: service.AssemblyServiceQty,
          });
          await this.assemblyService.deleteAssemblyService(service.assemblyId, service.servicesId);
        }
      }
      const updatedAssembly: any = await this.assemblyService.update(id, assembly);
      if (updatedAssembly.components) {
        for (const component of updatedAssembly.components) {
          if (component.AssemblyComponentQty > 1) {
            await this.assemblyService.updateAssemblyComponent(id, component.id, component.AssemblyComponentQty);
          }
        }
      }

      if (updatedAssembly.services) {
        for (const service of updatedAssembly.services) {
          if (service.AssemblyServiceQty > 1) {
            await this.assemblyService.updateAssemblyService(id, service.id, service.AssemblyServiceQty);
          }
        }
      }
      return updatedAssembly;
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Delete('/assemblies/:id')
  @Authorized()
  public async delete(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Res() res: any): Promise<void> {
    const canDo = 'assembly-delete';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.assemblyService.delete(id, res);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Put('/update/assembly/component/:assemblyId/:componentId')
  @Authorized()
  public async updateAssemblyComponent(
    @CurrentUser({required: true}) user: any,
    @Param('assemblyId') assemblyId: string,
    @Param('componentId') componentId: string,
    @Body() data: any,
    @Res() res: any
  ): Promise<any> {
    const canDo = 'module-write';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return await this.assemblyService.updateAssemblyComponent(assemblyId, componentId, data.AssemblyComponentQty);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Put('/update/assembly/service/:assemblyId/:servicesId')
  @Authorized()
  public async updateAssemblyService(
    @CurrentUser({required: true}) user: any,
    @Param('assemblyId') assemblyId: string,
    @Param('servicesId') servicesId: string,
    @Body() data: any,
    @Res() res: any
  ): Promise<any> {
    const canDo = 'module-write';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return await this.assemblyService.updateAssemblyService(assemblyId, servicesId, data.AssemblyServiceQty);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Delete('/assembly/component/:assemblyId/:componentId')
  @Authorized()
  public async deleteAssemblyComponent(
    @CurrentUser({required: true}) user: any,
    @Param('assemblyId') assemblyId: string,
    @Param('componentId') componentId: string,
    @Res() res: any): Promise<any> {
    const canDo = 'assembly-delete';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return await this.assemblyService.deleteAssemblyComponent(assemblyId, componentId);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Delete('/assembly/service/:assemblyId/:serviceId')
  @Authorized()
  public async deleteAssemblyService(
    @CurrentUser({required: true}) user: any,
    @Param('assemblyId') assemblyId: string,
    @Param('serviceId') serviceId: string,
    @Res() res: any): Promise<any> {
    const canDo = 'assembly-delete';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return await this.assemblyService.deleteAssemblyService(assemblyId, serviceId);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

}
