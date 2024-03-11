import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { UrlService } from './url.service';
import { Url } from './schemas/url.schema';
import * as UserAgent from 'user-agents';
import * as platform from 'platform';
import { Types } from 'mongoose';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';


@UseInterceptors(CacheInterceptor)
@CacheTTL(60 * 1000)
@Controller('api/url')

export class UrlController {
    constructor(private urlService: UrlService){}


    @Post('generate-short-url')
    async generateNewShortURL(@Body() body: { url: string,_id:any }, @Req() req, @Res() res){
       
        // console.log('call')
        const url = body.url;
        const userId = body._id;
        try {
            if(!url){
                return res.status(HttpStatus.BAD_REQUEST).json({error:'url is required'});
            }
            const shortId = await this.urlService.handleGenerateNewShortURL(url,userId);
          
            return res.json({ id: shortId });
        } catch (error) {
            console.error(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
        }
    }

    @Get(':shortId')
    async redirectToMyUrl(@Param('shortId') shortId: string, @Res() res, @Req() req){
        // console.log(shortId);
        console.log('INTERNAL CONTROLLER....')
        const userAgent = req.headers['user-agent'];
        
        try {
            if(!shortId){
                return res.status(HttpStatus.BAD_REQUEST).json({error:'please provide id'});
            }
           
            const redirectUrl = await this.urlService.handleRedirect(shortId, userAgent);
            // console.log(redirectUrl);
            if (redirectUrl) {
            //    console.log(redirectUrl);
            //    res.json(redirectUrl);
                res.redirect(redirectUrl);
              } else {
                res.status(404).json({ error: 'URL not found or expired' });
              }
        } catch (error) {
            console.error(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
        }
    }
    

    @Post('analytics')
    async getAnalytics( @Body() body: { _id: string }, @Res() res) {
        // loggedIn user Id
        
        const createdBy = body._id;
      
       console.log(createdBy);

        try {
            // passed logged-in user id (we can store it in cookies or anywhere)
    
            const result = await this.urlService.getAnalytics(createdBy);
            if (!result) {
                return res.status(404).json({ error: 'URL not found or expired' });
            }
            // console.log(result);
            // user can only visit only self-generated urls
            const formattedResult = result.map(item => ({
                shortId: item.shortId,
                redirectURL: item.redirectURL,
                totalClicks: item.visitHistory.length,
                analytics: item.visitHistory,
                createdBy: item.createdBy,
            }));
    
            return res.json(formattedResult);
        } catch (error) {
            console.error(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
        }
    }
}
