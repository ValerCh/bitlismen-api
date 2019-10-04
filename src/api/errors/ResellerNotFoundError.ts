import {HttpError} from 'routing-controllers';

export class ResellerNotFoundError extends HttpError {
  constructor() {
    super(404, 'Reseller not found!');
  }
}
