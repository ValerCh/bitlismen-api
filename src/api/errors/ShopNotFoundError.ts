import { HttpError } from 'routing-controllers';

export class ShopNotFoundError extends HttpError {
    constructor() {
        super(404, 'Shop not found!');
    }
}
