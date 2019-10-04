import {
  Authorized,
  Body, CurrentUser, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req, Res
} from 'routing-controllers';

import {Customer} from '../models/Customer';
import {CustomerService} from '../services/CustomerService';
import {CustomerNotFoundError} from '../errors/CustomerNotFoundError';
import {UsersService} from '../services/UsersService';

@JsonController()
export class CustomerController {

  constructor(
    private customerService: CustomerService,
    private usersService: UsersService
  ) {
  }

  @Get('/customers')
  @Authorized()
  public async find(@CurrentUser({required: true}) user: any, @Res() res: any): Promise<Customer[]> {
    const canDo = 'customer-read';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator' || user.role === 'opportunity_owner') {
      return this.customerService.find();
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Get('/customers/:id')
  @Authorized()
  @OnUndefined(CustomerNotFoundError)
  public async one(@CurrentUser({required: true}) user: any, @Res() res: any, @Param('id') id: string): Promise<Customer | undefined> {
    const canDo = 'customer-read';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator' || user.role === 'opportunity_owner') {
      return this.customerService.findOne(id);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Post('/customers')
  @Authorized()
  public async create(@CurrentUser({required: true}) user: any, @Body() customer: Customer, @Req() req: any, @Res() res: any): Promise<Customer> {
    const canDo = 'customer-create';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.customerService.create(customer);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Put('/customers/:id')
  @Authorized()
  public async update(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Body() customer: Customer, @Res() res: any): Promise<Customer> {
    const canDo = 'customer-write';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.customerService.update(id, customer);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Delete('/customers/:id')
  @Authorized()
  public async delete(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Res() res: any): Promise<void> {
    const canDo = 'customer-delete';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.customerService.delete(id, res);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

}
