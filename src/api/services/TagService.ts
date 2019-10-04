import {Service} from 'typedi';
import {OrmRepository} from 'typeorm-typedi-extensions';
import uuid from 'uuid';

import {EventDispatcher, EventDispatcherInterface} from '../../decorators/EventDispatcher';
import {Logger, LoggerInterface} from '../../decorators/Logger';
import {Tag} from '../models/Tag';
import {TagRepository} from '../repositories/TagRepository';
import {events} from '../subscribers/events';
import {Res} from 'routing-controllers';

@Service()
export class TagService {

  constructor(
    @OrmRepository() private tagRepository: TagRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Logger(__filename) private log: LoggerInterface
  ) {
  }

  public find(): Promise<Tag[]> {
    this.log.info('Find all tags');
    return this.tagRepository.find();
  }

  public findOne(id: string): Promise<Tag | undefined> {
    this.log.info('Find one tag');
    return this.tagRepository.findOne({id});
  }

  public async create(tag: Tag): Promise<Tag> {
    this.log.info('Create a new tag => ', tag.toString());
    tag.id = uuid.v1();
    const new_tag = await this.tagRepository.save(tag);
    this.eventDispatcher.dispatch(events.tag.created, new_tag);
    return new_tag;
  }

  public update(id: string, tag: Tag): Promise<Tag> {
    this.log.info('Update a tag');
    tag.id = id;
    return this.tagRepository.save(tag);
  }

  public async delete(id: string, @Res() res: any): Promise<void> {
    this.log.info('Delete a tag');
    const deletedTag: any = await this.tagRepository.delete(id);
    if (deletedTag.raw.affectedRows === 1) {
      return res.status(200).send({message: 'Tag deleted successfully.'});
    } else {
      return res.status(404).send({error: 'Tag not found.'});
    }
  }

}
