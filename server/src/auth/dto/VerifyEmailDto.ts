import { IsUUID } from 'class-validator';

export class VerifyEmailDto {
  @IsUUID('4', { message: 'Invalid token format' })
  token: string;
}
