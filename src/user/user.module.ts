import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './Schemas/user.schema';
import { UserService } from './user.service';

@Module({
  imports:[
    MongooseModule.forFeature([{name:'User',schema:userSchema}])
  ],
  controllers: [UserController],
  providers:[UserService]
})
export class UserModule {}
