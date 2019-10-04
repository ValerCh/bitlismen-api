import {HttpError} from 'routing-controllers';

export class OpportunityNotFoundError extends HttpError {
  constructor() {
    super(404, 'Opportunity not found!');
  }
}
