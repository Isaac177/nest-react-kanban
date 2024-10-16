import { Request } from 'express';

export interface UserPayload {
  userId: string;
  username: string;
}

export interface AuthenticatedRequest extends Request {
  user: UserPayload;
}
