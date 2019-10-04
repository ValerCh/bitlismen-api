import {
  Authorized,
  Body, CurrentUser, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req, Res
} from 'routing-controllers';

import {UserNotFoundError} from '../errors/UserNotFoundError';
import {User} from '../models/User';
import {UsersService} from '../services/UsersService';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import {InputValidation} from '../validators/auth';

@JsonController()
export class UsersController {

  constructor(
    private usersService: UsersService
  ) {
  }

  @Get('/users')
  @Authorized()
  public async find(@CurrentUser({required: true}) rfq_user: any, @Res() res: any): Promise<User[]> {
    const canDo = 'everything';
    const allow = await this.usersService.currentUserCanDo(rfq_user, res, canDo);
    if (allow || rfq_user.role === 'opportunity_owner' || rfq_user.role === 'opportunity_designer') {
      return this.usersService.find();
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  // @Get('/me')
  // @Authorized()
  // public findMe(@Req() req: any): Promise<User[]> {
  //   return req.user;
  // }

  @Get('/user/:id')
  @Authorized()
  @OnUndefined(UserNotFoundError)
  public async one(@CurrentUser({required: true}) rfq_user: any, @Param('id') id: string, @Res() res: any): Promise<User | undefined> {
    const canDo = 'everything';
    const allow = await this.usersService.currentUserCanDo(rfq_user, res, canDo);
    if (allow) {
      return this.usersService.findOne(id);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Post('/register')
  public async create(@CurrentUser({required: true}) rfq_user: any, @Body() user: any, @Res() res: any): Promise<User> {
    const canDo = 'everything';
    const allow = await this.usersService.currentUserCanDo(rfq_user, res, canDo);
    if (allow) {
      const {errors, isValid} = InputValidation.validateRegisterInput(user);
      if (!isValid) {
        return res.json({success: false, errors});
      }
      const userIsExist = await this.usersService.findOneByEmail(user.email);
      if (userIsExist) {
        return res.status(409).json({success: false, message: 'Email address already in use.'});
      }
      return await this.usersService.create(user);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Post('/reset/password')
  @Authorized()
  public async resetPassword(@CurrentUser({required: true}) rfq_user: any, @Body() data: any, @Res() res: any): Promise<any> {
    const canDo = 'everything';
    const allow = await this.usersService.currentUserCanDo(rfq_user, res, canDo);
    if (allow) {
      const resetPassword: any = {password: await User.hashPassword(data.new_password)};
      await this.usersService.update(data.user_id, resetPassword).then();
      return res.status(200).send({message: 'Password changed successfully.'});
    }
  }

  @Post('/forgot/password')
  public async forgotPassword(@Body() data: any, @Req() req: any, @Res() res: any): Promise<any> {
    const verifyTxt = crypto.randomBytes(4).toString('hex');
    const rfqUser = await this.usersService.findOneByEmail(data.email);
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        // TODO:Gmail account credentials.
        user: '',
        pass: '',
      },
    });
    if (rfqUser) {
      const mailOptions = {
        from: 'PLE',
        to: data.email,
        subject: 'Password Reset Request',
        html:
          '<a href="http://www.bitlismen.com/"><img width="300px" ' +
          'src="http://www.bitlismen.com/wp-content/uploads/2017/05/rsz_cropped-logo.png"/></a><br><br>' +
          'Hi <b>' + rfqUser.first_name + ' ' + rfqUser.last_name + '</b>,' +
          '<br> We were told that you forgot your password on <a href="http://www.bitlismen.com/">BitlisMen.</a><br><br>' +
          'To reset your password, please use a code.<br> Reset code is <b>' + verifyTxt + '</b>.<br><br><br>' +
          // TODO:Contact us email address.
          'If you still having trouble logging into your account, please <a href="mailto:">contact us</a>.',
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.end('error');
        } else {
          const resetCode: any = {reset_code: verifyTxt};
          this.usersService.update(rfqUser.id, resetCode).then();
          console.log('Email sent: ' + info.response);
          res.end('sent');
        }
      });
      return res.status(200).send({message: 'Email send successfully. Please check your email.'});
    } else {
      return res.status(409).send({message: 'Email is incorrect. User not found.'});
    }
  }

  @Post('/restore/password')
  public async restorePassword(@Body() data: any, @Res() res: any): Promise<any> {
    const userIsExist = await this.usersService.findByResetCode(data.reset_code);
    if (userIsExist) {
      const new_password = await User.hashPassword(data.new_password);
      const resetPassword: any = {password: new_password, reset_code: ''};
      this.usersService.update(userIsExist.id, resetPassword).then();
      return res.status(200).send({message: 'Password changed successfully.'});
    } else {
      return res.status(409).send({message: 'Reset code is incorrect. Please check your email.'});
    }
  }

  @Put('/user/:id')
  @Authorized()
  public async update(@CurrentUser({required: true}) rfq_user: any, @Param('id') id: string, @Body() user: User, @Res() res: any): Promise<User> {
    const canDo = 'everything';
    const allow = await this.usersService.currentUserCanDo(rfq_user, res, canDo);
    if (allow) {
      return this.usersService.update(id, user);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }

  @Delete('/user/:id')
  @Authorized()
  public async delete(@CurrentUser({required: true}) rfq_user: any, @Param('id') id: string, @Res() res: any): Promise<void> {
    const canDo = 'everything';
    const allow = await this.usersService.currentUserCanDo(rfq_user, res, canDo);
    if (allow) {
      return this.usersService.delete(id, res);
    } else {
      return res.status(550).send({message: 'Permission denied.'});
    }
  }
}
