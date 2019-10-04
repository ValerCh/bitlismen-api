import {
  Authorized,
  Body, CurrentUser, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req, Res
} from 'routing-controllers';

import {Shop} from '../models/Shop';
import {ShopService} from '../services/ShopService';
import {ShopNotFoundError} from '../errors/ShopNotFoundError';
import {UsersService} from '../services/UsersService';

@JsonController()
export class ShopController {

  constructor(
    private shopService: ShopService,
    private usersService: UsersService
  ) {
  }

  @Get('/shops')
  @Authorized()
  public async find(@CurrentUser({required: true}) user: any, @Res() res: any): Promise<Shop[]> {
    const canDo = 'shop-read';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.shopService.find();
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Get('/shops/:id')
  @Authorized()
  @OnUndefined(ShopNotFoundError)
  public async one(@CurrentUser({required: true}) user: any, @Res() res: any, @Param('id') id: string): Promise<Shop | undefined> {
    const canDo = 'shop-read';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.shopService.findOne(id);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Post('/shops')
  @Authorized()
  public async create(@CurrentUser({required: true}) user: any, @Body() shop: Shop, @Req() req: any, @Res() res: any): Promise<Shop> {
    const canDo = 'shop-create';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.shopService.create(shop);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Put('/shops/:id')
  @Authorized()
  public async update(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Body() shop: Shop, @Res() res: any): Promise<Shop> {
    const canDo = 'shop-write';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.shopService.update(id, shop);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Delete('/shops/:id')
  @Authorized()
  public async delete(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Res() res: any): Promise<void> {
    const canDo = 'shop-delete';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.shopService.delete(id, res);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

}
