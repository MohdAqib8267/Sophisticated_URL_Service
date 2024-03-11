import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { redisStore } from "cache-manager-redis-store";

export const RedisOptions: CacheModuleAsyncOptions = {
    isGlobal: true,
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
      const store = await redisStore({
        socket: {
          host: configService.get<string>('rediss://default:ffdb46c2e7c3471cb48235bc76d93106@us1-able-condor-40867.upstash.io:40867'),
          
        //   port: parseInt(configService.get<string>('6379')!),
        
        },
      });
      return {
        store: () => store,
      };
    },
    inject: [ConfigService],
  };