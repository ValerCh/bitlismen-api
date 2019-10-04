import {
  Authorized,
  Body, CurrentUser, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req, Res
} from 'routing-controllers';

import {Vendor} from '../models/Vendor';
import {VendorService} from '../services/VendorService';
import {VendorNotFoundError} from '../errors/VendorNotFoundError';
import {UsersService} from '../services/UsersService';

@JsonController()
export class VendorController {

  constructor(
    private vendorService: VendorService,
    private usersService: UsersService
  ) {
  }

  @Get('/vendors')
  @Authorized()
  public async find(@CurrentUser({required: true}) user: any, @Res() res: any): Promise<Vendor[]> {
    const canDo = 'vendor-read';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.vendorService.find();
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Get('/vendors/:id')
  @Authorized()
  @OnUndefined(VendorNotFoundError)
  public async one(@CurrentUser({required: true}) user: any, @Res() res: any, @Param('id') id: string): Promise<Vendor | undefined> {
    const canDo = 'vendor-read';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.vendorService.findOne(id);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Post('/vendors')
  @Authorized()
  public async create(@CurrentUser({required: true}) user: any, @Body() vendor: Vendor, @Req() req: any, @Res() res: any): Promise<Vendor> {
    const canDo = 'vendor-create';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.vendorService.create(vendor);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Put('/vendors/:id')
  @Authorized()
  public async update(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Body() vendor: Vendor, @Res() res: any): Promise<Vendor> {
    const canDo = 'vendor-write';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.vendorService.update(id, vendor);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Delete('/vendors/:id')
  @Authorized()
  public async delete(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Res() res: any): Promise<void> {
    const canDo = 'vendor-delete';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.vendorService.delete(id, res);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

}
