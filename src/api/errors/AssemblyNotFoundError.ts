import { HttpError } from 'routing-controllers';

export class AssemblyNotFoundError extends HttpError {
    constructor() {
        super(404, 'Assembly not found!');
    }
}
