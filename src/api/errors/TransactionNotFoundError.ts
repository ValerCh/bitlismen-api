import { HttpError } from 'routing-controllers';

export class TransactionNotFoundError extends HttpError {
    constructor() {
        super(404, 'Transaction not found!');
    }
}
