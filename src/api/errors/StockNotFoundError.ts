import { HttpError } from 'routing-controllers';

export class StockNotFoundError extends HttpError {
    constructor() {
        super(404, 'Stock not found!');
    }
}
