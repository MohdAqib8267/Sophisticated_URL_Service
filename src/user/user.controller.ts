
import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';

import * as bcrypt from "bcryptjs";
import * as jwt from 'jsonwebtoken';


@Controller('api/user')

export class UserController {
    constructor(private userService:UserService){}
 
    @Post('signup')
    async handlesignup( @Body() body: { name: string; email: string; password: string },@Res() res,){
        const { name, email, password } = body;
        try {
            if(!name || !email || !password){
                return res.status(HttpStatus.BAD_REQUEST).json({error:'something is missing'});
            }
            //find user in DB
            const existUser = await this.userService.findUser(email);
            if(existUser){
                return res.status(HttpStatus.CONFLICT).json({error:'User is already exist'});
            }
             // add user in db
           
             const salt = await bcrypt.genSalt(10);
             const hashPass = await bcrypt.hash(password, salt);
             const newUser = await this.userService.addUser(name, email, hashPass);
            
            //generate token for user
            const token = jwt.sign({user:newUser},process.env.JWTKEY,{expiresIn:'12h'});
            return res.status(HttpStatus.ACCEPTED).json({user:newUser,token:token});

        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
        }
    }

    @Post('login')
    async handleLogin(@Body() body:{email:string,password:string},@Res() res){
        const {email,password}=body;
        try {
            if(!email|| !password){
                return res.status(HttpStatus.BAD_REQUEST).json({message:"Something is missing."});
            }
            //find user in DB
            const user = await this.userService.findUser(email);
            if(!user){
                return res.status(HttpStatus.NOT_FOUND).json({message:'user not found'});
            }
            // Compare the provided password with the hashed password in the database
            const passwordMatch = await bcrypt.compare(password, user.password);
            if(!passwordMatch){
                return res.status(HttpStatus.FORBIDDEN).json({error:'password does not match'});
            }
            //if user valid, then generate token
            const token = jwt.sign({user},process.env.JWTKEY,{ expiresIn: '24h'});
            res.json({ user:user, token });
            
        } catch (error) {
            
        }
    }
}
