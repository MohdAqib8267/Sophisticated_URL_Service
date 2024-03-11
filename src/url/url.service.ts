import mongoose, { Model, Types } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Url } from './schemas/url.schema';
import * as shortid from 'shortid';
import { UAParser } from 'ua-parser-js';
import * as platform from 'platform';
import { Cache } from 'cache-manager';

// import * as moment from 'moment';

import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(Url.name)
    private URL: mongoose.Model<Url>,

    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async handleGenerateNewShortURL(url: string, userId: any): Promise<string> {
    console.log(url, userId);
    const shortId = shortid.generate();

    const data = await this.URL.create({
      shortId: shortId,
      redirectURL: url,
      visitHistory: [],
      createdBy: userId,
    });
    // console.log(data);

    return shortId;
  }
  async handleRedirect(shortId: string, userAgent: string): Promise<string> {
    // console.log(userAgent);
    console.log('INTERNAL SERVICE....');

    const browserName = platform.parse(userAgent).name;
    const os = platform.parse(userAgent).os;
    // console.log(userAgent.toString());
    const uaParser = new UAParser(userAgent);
    const parsedUA = uaParser.getResult();
    // const parsedPlatform = platform.parse(userAgent);

    const entry = await this.URL.findOneAndUpdate(
      {
        shortId: shortId,
      },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
            // device: deviceName,
            browser: browserName,
            OS: os,
          },
        },
      },
    );
    // console.log(entry);

    return entry?.redirectURL || null;
  }

  async getAnalytics(createdBy: any): Promise<any> {
    try {
      const cachedUser = await this.cacheService.get(`userId_${createdBy}`);
      console.log('User analytics from cache:', cachedUser);

      if (cachedUser) {
        return cachedUser;
      }
      const userAnlaytics = await this.URL.find({ createdBy });
      if (userAnlaytics) {
        // Cache the user data
        await this.cacheService.set(
          `userId_${createdBy}`,
          userAnlaytics,
          60 * 1000,
        );
        console.log('add in cache', userAnlaytics);
      }
      return userAnlaytics;
    } catch (error) {
          console.error('Error in findUser:', error);
            return null; 
    }
  }
}
