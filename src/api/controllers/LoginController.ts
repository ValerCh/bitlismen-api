import {Body, JsonController, Post, Res} from 'routing-controllers';
import {AuthService} from '../../auth/AuthService';
import jwt from 'jsonwebtoken';
import {InputValidation} from '../validators/auth';

@JsonController()
export class LoginController {

  public tokenList = {};

  constructor(
    private authService: AuthService
  ) {
  }

  @Post('/login')
  public async token(@Body() user: any, @Res() res: any): Promise<any> {
    const rfq_user = await this.authService.validateUser(user.email, user.password);
    let jwt_token;
    let refresh_token;
    const {errors, isValid} = InputValidation.validateLoginInput(user);
    if (!isValid) {
      return res.json({success: false, errors});
    }
    if (rfq_user) {
      jwt_token = jwt.sign({
        data: {
          email: rfq_user.email,
          id: rfq_user.id,
          role: rfq_user.role.role_internal_name,
        },
      }, process.env.JWT_SECRET, {
        expiresIn: 86400,
        algorithm: 'HS256',
      });

      refresh_token = jwt.sign({
        data: {
          email: rfq_user.email,
          id: rfq_user.id,
          role: rfq_user.role.role_internal_name,
        },
      }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: 86400,
      });
    } else {
      return res.status(403).send({message: 'Email and/or password is incorrect.'});
    }

    this.tokenList[refresh_token] = refresh_token;
    delete rfq_user.password;
    return {rfq_user, jwt_token, refresh_token};

  }

  @Post('/token')
  public async refreshToken(@Body() data: any, @Res() res: any): Promise<any> {
    if ((data.refresh_token) && (data.refresh_token in this.tokenList)) {
      return jwt.verify(data.refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, decodedToken) => {
        const jwt_token = jwt.sign({
            data: {email: decodedToken.data.email, id: decodedToken.data.id, role: decodedToken.data.role},
          },
          process.env.JWT_SECRET, {
            expiresIn: 86400,
          });
        const refresh_token = jwt.sign({
            data: {email: decodedToken.data.email, id: decodedToken.data.id, role: decodedToken.data.role},
          },
          process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: 86400,
          }
        );

        this.tokenList[refresh_token] = refresh_token;
        return {jwt_token, refresh_token};
      });

    } else {
      return res.status(403).send({message: 'Refresh token time out.'});

    }
  }
}
