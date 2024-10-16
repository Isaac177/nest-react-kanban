import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private i18n: I18nService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async register(username: string, email: string, password: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(await this.i18n.translate('auth.emailAlreadyExists'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();
    await this.usersService.create(
      username,
      email,
      hashedPassword,
      verificationToken,
    );
    //await this.sendVerificationEmail(email, verificationToken);

    return {
      message: await this.i18n.translate('auth.registrationSuccessful'),
    };
  }

  async verifyEmail(token: string) {
    const user = await this.usersService.findByVerificationToken(token);
    if (!user) {
      throw new BadRequestException(await this.i18n.translate('auth.invalidVerificationToken'));
    }

    await this.usersService.verifyUser(user._id.toString());
    return { message: await this.i18n.translate('auth.emailVerified') };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException(await this.i18n.translate('auth.invalidCredentials'));
    }

    /*if (!user.isVerified) {
      throw new UnauthorizedException(
        await this.i18n.translate('auth.emailNotVerified')
      );
    }*/

    const payload = { email: user.email, sub: user._id.toString() };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException(await this.i18n.translate('auth.invalidRefreshToken'));
      }

      const newPayload = { email: user.email, sub: user._id.toString() };
      return {
        access_token: this.jwtService.sign(newPayload, { expiresIn: '15m' }),
      };
    } catch (error) {
      throw new UnauthorizedException(await this.i18n.translate('auth.invalidRefreshToken'));
    }
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException(await this.i18n.translate('auth.userNotFound'));
    }

    const resetToken = uuidv4();
    await this.usersService.setResetToken(user._id.toString(), resetToken);

    await this.sendPasswordResetEmail(email, resetToken);

    return { message: await this.i18n.translate('auth.passwordResetInstructionsSent') };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);
    if (!user) {
      throw new BadRequestException(await this.i18n.translate('auth.invalidResetToken'));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.resetPassword(user._id.toString(), hashedPassword);

    return { message: await this.i18n.translate('auth.passwordResetSuccessful') };
  }

  private async sendVerificationEmail(email: string, token: string) {
    const verificationLink = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: await this.i18n.translate('auth.verifyEmailSubject'),
      html: await this.i18n.translate('auth.verifyEmailBody', { args: { verificationLink } }),
    });
  }

  private async sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: await this.i18n.translate('auth.resetPasswordSubject'),
      html: await this.i18n.translate('auth.resetPasswordBody', { args: { resetLink } }),
    });
  }
}
