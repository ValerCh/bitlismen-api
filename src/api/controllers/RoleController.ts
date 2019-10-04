import {
  Authorized,
  Body, CurrentUser, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req, Res
} from 'routing-controllers';

import {Role} from '../models/Role';
import {RoleService} from '../services/RoleService';
import {RoleNotFoundError} from '../errors/RoleNotFoundError';
import {PermissionsService} from '../services/PermissionsService';

@JsonController()
export class VendorController {

  constructor(
    private roleService: RoleService,
    private permissionService: PermissionsService
  ) {
  }

  @Get('/roles')
  // @Authorized()
  public find(): Promise<Role[]> {
    return this.roleService.find();
  }

  @Get('/roles/:id')
  @Authorized()
  @OnUndefined(RoleNotFoundError)
  public one(@Param('id') id: string): Promise<Role | undefined> {
    return this.roleService.findOne(id);
  }

  @Post('/roles')
  @Authorized()
  public create(@CurrentUser({required: true}) user: any, @Body() role: Role, @Req() req: any, @Res() res: any): Promise<Role> {
    if (user.role === 'administrator') {
      return this.roleService.create(role);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Put('/roles/:id')
  @Authorized()
  public async update(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Body() role: any, @Res() res: any): Promise<Role> {
    if (user.role === 'administrator') {
      const permissions: any = [];
      for (const permission of role.permissions) {
        const newPermissions = await this.permissionService.create(permission);
        if (newPermissions && newPermissions.id) {
          permissions.push(newPermissions);
        }
      }
      role.permissions = permissions;
      return this.roleService.update(id, role);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Delete('/roles/:id')
  @Authorized()
  public delete(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Res() res: any): Promise<void> {
    if (user.role === 'administrator') {
      return this.roleService.delete(id, res);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

}
