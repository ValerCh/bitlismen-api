import { HttpError } from 'routing-controllers';

export class ComponentNotFoundError extends HttpError {
    constructor() {
        super(404, 'Component not found!');
    }
}
