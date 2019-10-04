import {
  Authorized,
  Body, CurrentUser, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req, Res
} from 'routing-controllers';

import {Component} from '../models/Component';
import {ComponentService} from '../services/ComponentService';
import {ComponentNotFoundError} from '../errors/ComponentNotFoundError';
import {UsersService} from '../services/UsersService';

@JsonController()
export class ComponentController {

  constructor(
    private componentService: ComponentService,
    private usersService: UsersService
  ) {
  }

  @Get('/components')
  @Authorized()
  public async find(@CurrentUser({required: true}) user: any, @Res() res: any): Promise<Component[]> {
    const canDo = 'component-read';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator' || user.role === 'opportunity_owner') {
      const components: any = await this.componentService.find();
      for (const component of components) {
        component.CPoto = Buffer.from(component.CPoto || '').toString();
      }
      return components;
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Get('/components/:id')
  @Authorized()
  @OnUndefined(ComponentNotFoundError)
  public async one(@CurrentUser({required: true}) user: any, @Res() res: any, @Param('id') id: string): Promise<Component | undefined> {
    const canDo = 'component-read';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      const component: any = await this.componentService.findOne(id);
      component.CPoto = Buffer.from(component.CPoto || '').toString();
      return component;
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Post('/components')
  @Authorized()
  public async create(@CurrentUser({required: true}) user: any,
                      @Body() component: Component,
                      @Req() req: any,
                      @Res() res: any): Promise<Component> {
    const canDo = 'component-create';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      component.CTag = '';
      const newComponent = await this.componentService.create(component);
      return newComponent;
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Put('/components/:id')
  @Authorized()
  public async update(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Body() component: Component, @Res() res: any): Promise<Component> {
    const canDo = 'component-write';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.componentService.update(id, component);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Delete('/components/:id')
  @Authorized()
  public async delete(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Res() res: any): Promise<void> {
    const canDo = 'component-delete';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.componentService.delete(id, res);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

}
