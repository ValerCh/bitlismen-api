import {
  Authorized,
  Body, CurrentUser, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req, Res
} from 'routing-controllers';

import {Reseller} from '../models/Reseller';
import {ResellerService} from '../services/ResellerService';
import {ResellerNotFoundError} from '../errors/ResellerNotFoundError';
import {UsersService} from '../services/UsersService';

@JsonController()
export class ResellerController {

  constructor(
    private resellerService: ResellerService,
    private usersService: UsersService
  ) {
  }

  @Get('/resellers')
  @Authorized()
  public async find(@CurrentUser({required: true}) user: any, @Res() res: any): Promise<Reseller[]> {
    const canDo = 'reseller-read';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator' || user.role === 'opportunity_owner') {
      return this.resellerService.find();
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Get('/resellers/:id')
  @Authorized()
  @OnUndefined(ResellerNotFoundError)
  public async one(@CurrentUser({required: true}) user: any, @Res() res: any, @Param('id') id: string): Promise<Reseller | undefined> {
    const canDo = 'reseller-read';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator' || user.role === 'opportunity_owner') {
      return this.resellerService.findOne(id);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Post('/resellers')
  @Authorized()
  public async create(@CurrentUser({required: true}) user: any, @Body() reseller: Reseller, @Req() req: any, @Res() res: any): Promise<Reseller> {
    const canDo = 'reseller-create';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.resellerService.create(reseller);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Put('/resellers/:id')
  @Authorized()
  public async update(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Body() reseller: Reseller, @Res() res: any): Promise<Reseller> {
    const canDo = 'reseller-write';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.resellerService.update(id, reseller);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Delete('/resellers/:id')
  @Authorized()
  public async delete(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Res() res: any): Promise<void> {
    const canDo = 'reseller-delete';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.resellerService.delete(id, res);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

}
