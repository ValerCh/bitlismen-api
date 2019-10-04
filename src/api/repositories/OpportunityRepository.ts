import {EntityRepository, Repository} from 'typeorm';

import {Opportunity} from '../models/Opportunity';

@EntityRepository(Opportunity)
export class OpportunityRepository extends Repository<Opportunity> {

}
