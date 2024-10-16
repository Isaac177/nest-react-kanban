import { IsString, IsUUID, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsUUID('4', { message: 'Invalid token format' })
  token!: string;

  @IsString()
  @MinLength(6, {
    message: 'New password must be at least 6 characters long',
  })
  newPassword!: string;
}
