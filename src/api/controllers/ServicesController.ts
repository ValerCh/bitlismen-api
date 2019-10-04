import {
  Authorized,
  Body, CurrentUser, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req, Res
} from 'routing-controllers';

import {Services} from '../models/Service';
import {ServicesService} from '../services/ServicesService';
import {ServiceNotFoundError} from '../errors/ServiceNotFoundError';
import {UsersService} from '../services/UsersService';

@JsonController()
export class ServicesController {

  constructor(
    private servicesService: ServicesService,
    private usersService: UsersService
  ) {
  }

  @Get('/services')
  @Authorized()
  public async find(@CurrentUser({required: true}) user: any, @Res() res: any): Promise<Services[]> {
    const canDo = 'service-read';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator' || user.role === 'opportunity_owner') {
      return this.servicesService.find();
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Get('/services/:id')
  @Authorized()
  @OnUndefined(ServiceNotFoundError)
  public async one(@CurrentUser({required: true}) user: any, @Res() res: any, @Param('id') id: string): Promise<Services | undefined> {
    const canDo = 'service-read';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator' || user.role === 'opportunity_owner') {
      return this.servicesService.findOne(id);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Post('/services')
  @Authorized()
  public async create(@CurrentUser({required: true}) user: any, @Body() service: Services, @Req() req: any, @Res() res: any): Promise<Services> {
    const canDo = 'service-create';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.servicesService.create(service);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Put('/services/:id')
  @Authorized()
  public async update(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Body() service: Services, @Res() res: any): Promise<Services> {
    const canDo = 'service-write';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.servicesService.update(id, service);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Delete('/services/:id')
  @Authorized()
  public async delete(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Res() res: any): Promise<void> {
    const canDo = 'service-delete';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.servicesService.delete(id, res);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

}
