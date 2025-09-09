import { logger } from '../utils/logger';

export class AdTracker {
  // Check if message came from Instagram ad
  isFromInstagramAd(message: string): boolean {
    if (!message) return false;
    
    const messageLC = message.toLowerCase();
    
    // Instagram ad indicators - these would be in your ad's call-to-action
    const instagramIndicators = [
      // Direct Instagram ad codes
      'ig_ad',
      'instagram_ad',
      'insta_ad',
      'ig_promo',
      'ig2024',
      'igruka',
      
      // Common Instagram ad CTAs
      'from instagram',
      'saw your instagram',
      'instagram post',
      'instagram ad',
      'ig ad',
      'your ig',
      
      // Custom campaign codes you might use
      'igdec24',  // Instagram December 2024
      'igoffer',
      'igspecial',
      'instaoffer',
      
      // UTM parameters for Instagram
      'utm_source=instagram',
      'utm_source=ig',
      'utm_medium=social',
      'utm_campaign=ig',
      
      // Response keywords from Instagram ads
      'interested from instagram',
      'dm from instagram',
      'message from ig'
    ];
    
    // Check if any Instagram indicator is present
    const isInstagram = instagramIndicators.some(indicator => 
      messageLC.includes(indicator)
    );
    
    if (isInstagram) {
      logger.info('Instagram ad lead detected', { 
        message: message.substring(0, 100) 
      });
    }
    
    return isInstagram;
  }
  
  // Get campaign details from Instagram message
  getCampaignDetails(message: string): any {
    const details: any = {
      platform: 'Instagram',
      campaign: 'Unknown',
      adSet: null,
      keyword: null
    };
    
    const messageLC = message.toLowerCase();
    
    // Check for specific campaign codes
    if (messageLC.includes('igdec24')) {
      details.campaign = 'December 2024 Campaign';
    } else if (messageLC.includes('igoffer')) {
      details.campaign = 'Special Offer Campaign';
    } else if (messageLC.includes('ig_promo')) {
      details.campaign = 'Promotional Campaign';
    }
    
    // Extract any campaign ID if present
    const campaignMatch = message.match(/campaign[_=]([a-zA-Z0-9_-]+)/i);
    if (campaignMatch) {
      details.campaign = campaignMatch[1];
    }
    
    // Extract ad set if present
    const adSetMatch = message.match(/adset[_=]([a-zA-Z0-9_-]+)/i);
    if (adSetMatch) {
      details.adSet = adSetMatch[1];
    }
    
    return details;
  }
  
  // DEPRECATED - Use isFromInstagramAd instead
  detectAdSource(message: string): any {
    const isInstagram = this.isFromInstagramAd(message);
    
    if (isInstagram) {
      return this.getCampaignDetails(message);
    }
    
    return {
      platform: 'Organic',
      campaign: 'Direct'
    };
  }
}