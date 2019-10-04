import { HttpError } from 'routing-controllers';

export class ServiceNotFoundError extends HttpError {
    constructor() {
        super(404, 'Service not found!');
    }
}
