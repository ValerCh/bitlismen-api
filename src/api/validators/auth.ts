import isEmpty from 'is-empty';
import Validator from 'validator';
import {JsonController} from 'routing-controllers';

@JsonController()
export class InputValidation {

  public static validateRegisterInput(data: any): any {
    const errors: any = {};

    data.first_name = !isEmpty(data.first_name) ? data.first_name : '';
    data.last_name = !isEmpty(data.last_name) ? data.last_name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (Validator.isEmpty(data.first_name)) {
      errors.first_name = 'First name field is required';
    }
    if (Validator.isEmpty(data.last_name)) {
      errors.last_name = 'Last name field is required';
    }
    if (Validator.isEmpty(data.email)) {
      errors.email = 'Email field is required';
    }
    if (Validator.isEmpty(data.password)) {
      errors.password = 'Password field is required';
    }

    return {
      errors,
      isValid: isEmpty(errors),
    };
  }

  public static validateLoginInput(data: any): any {
    const errors: any = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (Validator.isEmpty(data.email)) {
      errors.email = 'Email field is required';
    }
    if (Validator.isEmpty(data.password)) {
      errors.password = 'Password field is required';
    }

    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
}
