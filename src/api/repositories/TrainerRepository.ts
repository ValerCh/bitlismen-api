import {EntityRepository, Repository} from 'typeorm';

import {Trainer} from '../models/Trainer';

@EntityRepository(Trainer)
export class TrainerRepository extends Repository<Trainer> {

}
