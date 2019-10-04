import { HttpError } from 'routing-controllers';

export class ModuleNotFoundError extends HttpError {
    constructor() {
        super(404, 'Module not found!');
    }
}
