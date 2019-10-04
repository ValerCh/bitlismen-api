import { HttpError } from 'routing-controllers';

export class RoleNotFoundError extends HttpError {
    constructor() {
        super(404, 'Role not found!');
    }
}
