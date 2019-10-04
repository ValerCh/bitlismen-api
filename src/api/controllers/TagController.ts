import {
  Authorized,
  Body, CurrentUser, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req, Res
} from 'routing-controllers';

import {Tag} from '../models/Tag';
import {TagService} from '../services/TagService';
import {TagNotFoundError} from '../errors/TagNotFoundError';
import {UsersService} from '../services/UsersService';

@JsonController()
export class TagController {

  constructor(
    private tagService: TagService,
    private usersService: UsersService
  ) {
  }

  @Get('/tags')
  @Authorized()
  public async find(@CurrentUser({required: true}) user: any, @Res() res: any): Promise<Tag[]> {
    const canDo = 'tag-read';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator' || user.role === 'opportunity_owner') {
      return this.tagService.find();
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Get('/tags/:id')
  @Authorized()
  @OnUndefined(TagNotFoundError)
  public async one(@CurrentUser({required: true}) user: any, @Res() res: any, @Param('id') id: string): Promise<Tag | undefined> {
    const canDo = 'tag-read';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator' || user.role === 'opportunity_owner') {
      return this.tagService.findOne(id);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Post('/tags')
  @Authorized()
  public async create(@CurrentUser({required: true}) user: any, @Body() tag: Tag, @Req() req: any, @Res() res: any): Promise<Tag> {
    const canDo = 'tag-create';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.tagService.create(tag);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Put('/tags/:id')
  @Authorized()
  public async update(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Body() tag: Tag, @Res() res: any): Promise<Tag> {
    const canDo = 'tag-write';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.tagService.update(id, tag);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Delete('/tags/:id')
  @Authorized()
  public async delete(@CurrentUser({required: true}) user: any, @Param('id') id: string, @Res() res: any): Promise<void> {
    const canDo = 'tag-delete';
    const allow = await this.usersService.currentUserCanDo(user, res, canDo);
    if (allow || user.role === 'administrator') {
      return this.tagService.delete(id, res);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

}
