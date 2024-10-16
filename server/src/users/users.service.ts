import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly i18n: I18nService
  ) {}

  async create(
    username: string,
    email: string,
    hashedPassword: string,
    verificationToken: string,
  ): Promise<User> {
    console.log('Creating user with:', { username, email, verificationToken });
    const newUser = new this.userModel({
      username,
      email,
      password: hashedPassword,
      verificationToken,
    });
    console.log('New user object:', newUser);
    try {
      const savedUser = await newUser.save();
      console.log('Saved user:', savedUser);
      return savedUser;
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
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
      throw new NotFoundException(await this.i18n.translate('users.userNotFound'));
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    return user.save();
  }

  async setResetToken(id: string, token: string): Promise<User> {
    const user = await this.userModel.findById(new Types.ObjectId(id));
    if (!user) {
      throw new NotFoundException(await this.i18n.translate('users.userNotFound'));
    }
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);
    return user.save();
  }

  async resetPassword(id: string, hashedPassword: string): Promise<User> {
    const user = await this.userModel.findById(new Types.ObjectId(id));
    if (!user) {
      throw new NotFoundException(await this.i18n.translate('users.userNotFound'));
    }
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    return user.save();
  }
}
