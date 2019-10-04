import {EntityRepository, Repository} from 'typeorm';

import {Component} from '../models/Component';

@EntityRepository(Component)
export class ComponentRepository extends Repository<Component> {

}
