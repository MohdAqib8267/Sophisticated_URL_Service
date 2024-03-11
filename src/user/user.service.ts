import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './Schemas/user.schema';
import mongoose from 'mongoose';
import { CACHE_MANAGER, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RedisOptions } from '../redis/app-options.constants';


@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private USER:mongoose.Model<User>,

        @Inject(CACHE_MANAGER) private cacheService: Cache,

    ){}
   
    async findUser(email: string): Promise<any> {
        try {
           
            const cachedUser = await this.cacheService.get(`user_${email}`);
            console.log('User retrieved from cache:', cachedUser);
            RedisOptions
            
            if (cachedUser) {
                return cachedUser;
            }
    
            const user = await this.USER.findOne({ email });
    
            if (user) {
                // Cache the user data 
                await this.cacheService.set(`user_${email}`, user, 60 * 1000);
                console.log("add in cache",user);
            }
    
            return user;
        } catch (error) {
            console.error('Error in findUser:', error);
            return null; 
        }
    }
    

    async addUser(name:string,email:string,hashPass:string){
        const user=await this.USER.create({
            name:name,
            email:email,
            password:hashPass
        })

        return user;
    }
}


