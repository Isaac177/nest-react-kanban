// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(
    username: string,
    email: string,
    hashedPassword: string,
    verificationToken: string,
  ): Promise<User> {
    const newUser = new this.userModel({
      username,
      email,
      password: hashedPassword,
      verificationToken,
    });
    return newUser.save();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(new Types.ObjectId(id)).exec();
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return this.userModel.findOne({ verificationToken: token }).exec();
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.userModel.findOne({ resetPasswordToken: token }).exec();
  }

  async verifyUser(id: string): Promise<User> {
    const user = await this.userModel.findById(new Types.ObjectId(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    return user.save();
  }

  async setResetToken(id: string, token: string): Promise<User> {
    const user = await this.userModel.findById(new Types.ObjectId(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    return user.save();
  }

  async resetPassword(id: string, hashedPassword: string): Promise<User> {
    const user = await this.userModel.findById(new Types.ObjectId(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    return user.save();
  }
}


