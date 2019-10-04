import {HttpError} from 'routing-controllers';

export class TrainerNotFoundError extends HttpError {
  constructor() {
    super(404, 'Trainer not found!');
  }
}
