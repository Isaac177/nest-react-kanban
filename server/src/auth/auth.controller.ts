import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/RegisterDto';
import { VerifyEmailDto } from './dto/VerifyEmailDto';
import { LoginDto } from './dto/LoginDto';
import { RefreshTokenDto } from './dto/RefreshTokenDto';
import { ForgotPasswordDto } from './dto/ForgotPasswordDto';
import { ResetPasswordDto } from './dto/ResetPasswordDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.username,
      registerDto.email,
      registerDto.password,
    );
  }

  @Post('verify-email')
  async verifyEmail(@Query() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto.token);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }
}
