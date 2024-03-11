import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';


@Schema({
  timestamps: true,
})
export class Url {
  @Prop({required:true, unique:true})
  shortId: string;

  @Prop({required:true})
  redirectURL:string

  @Prop([{ timestamp: { type: Number }, device: {type:String}, browser: {type:String},OS:{type:String} }])
  visitHistory:[]

  @Prop({type:mongoose.Schema.Types.ObjectId, ref:"users",required:true})
  createdBy:string
}

export const UrlSchema = SchemaFactory.createForClass(Url);