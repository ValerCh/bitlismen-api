import { HttpError } from 'routing-controllers';

export class VendorNotFoundError extends HttpError {
    constructor() {
        super(404, 'Vendor not found!');
    }
}
