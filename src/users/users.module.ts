import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserDocument, UserSchema } from 'src/db/schemas/User.schema';
import { handleSaveError, setUpdateSettings } from 'src/db/hooks';
import {
  Session,
  SessionDocument,
  SessionSchema,
} from 'src/db/schemas/Session.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '24h' },
    }),
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          UserSchema.post('save', handleSaveError<UserDocument>);
          UserSchema.pre('findOneAndUpdate', setUpdateSettings<UserDocument>);
          UserSchema.post('findOneAndUpdate', handleSaveError<UserDocument>);
          return UserSchema;
        },
      },
      {
        name: Session.name,
        useFactory: () => {
          SessionSchema.post('save', handleSaveError<SessionDocument>);
          SessionSchema.pre(
            'findOneAndUpdate',
            setUpdateSettings<SessionDocument>,
          );
          SessionSchema.post(
            'findOneAndUpdate',
            handleSaveError<SessionDocument>,
          );
          return SessionSchema;
        },
      },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
