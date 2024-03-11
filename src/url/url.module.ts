import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlSchema} from './Schemas/url.schema';
import { AuthMiddleware } from '../middleware/auth.middleware';

@Module({
  imports:[
    MongooseModule.forFeature([{name:'Url',schema:UrlSchema}])
  ],
  controllers: [UrlController],
  providers: [UrlService]
})
export class UrlModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
      consumer
      .apply(AuthMiddleware).forRoutes({path:'url',method:RequestMethod.POST});
  }
}
