import { Router, Request, Response } from 'express';
import { WhatsAppService } from '../services/whatsapp';
import { RukaCallingService } from '../services/ruka-calling';
import { AdTracker } from '../services/ad-tracker';
import { logger } from '../utils/logger';

const router = Router();
let whatsappService: WhatsAppService;
let rukaService: RukaCallingService;
let adTracker: AdTracker;

// Initialize services lazily
const initServices = () => {
  if (!whatsappService) {
    whatsappService = new WhatsAppService();
    rukaService = new RukaCallingService();
    adTracker = new AdTracker();
  }
};

// Twilio WhatsApp webhook
router.post('/twilio', async (req: Request, res: Response) => {
  initServices();
  
  try {
    const { From, Body, ProfileName } = req.body;
    
    logger.info('Received WhatsApp message via Twilio', {
      from: From,
      body: Body,
      profileName: ProfileName
    });

    // Check if message came from Instagram ad
    const isFromInstagramAd = adTracker.isFromInstagramAd(Body);
    
    if (!isFromInstagramAd) {
      logger.info('Message not from Instagram ad, ignoring', { from: From });
      res.status(200).send('OK');
      return;
    }

    // Extract phone number (remove 'whatsapp:' prefix)
    const phoneNumber = From.replace('whatsapp:', '');
    
    // Parse lead details from message
    const leadData = whatsappService.parseLeadMessage(Body, ProfileName);
    
    // Submit to Ruka website (this will handle Zoho CRM and calling)
    const result = await rukaService.submitToRuka({
      phoneNumber: phoneNumber,
      name: leadData.name || ProfileName || 'Instagram Lead',
      email: leadData.email
    });
    
    // Send automated WhatsApp reply for Instagram leads
    if (result.success) {
      await whatsappService.sendReply(From, 
        `Thanks for your enquiry! You will get an automated call to know more about Ruka - Human Like Calling Agent.`
      );
      logger.info('WhatsApp reply sent to Instagram lead', { to: From });
    }
    
    logger.info('Instagram lead processed', {
      phone: phoneNumber,
      name: leadData.name,
      submitted: result.success
    });
    
    res.status(200).send('OK');
  } catch (error) {
    logger.error('Error processing WhatsApp webhook:', error);
    res.status(200).send('OK'); // Return 200 to prevent webhook retry
  }
});

// Meta WhatsApp Cloud API webhook
router.post('/meta', async (req: Request, res: Response) => {
  initServices();
  
  try {
    const { entry } = req.body;
    
    if (entry && entry[0]?.changes?.[0]?.value?.messages) {
      const message = entry[0].changes[0].value.messages[0];
      const contact = entry[0].changes[0].value.contacts[0];
      
      logger.info('Received WhatsApp message via Meta API', {
        from: message.from,
        text: message.text?.body,
        name: contact.profile.name
      });
      
      // Check if message came from Instagram ad
      const isFromInstagramAd = adTracker.isFromInstagramAd(message.text?.body || '');
      
      if (!isFromInstagramAd) {
        logger.info('Message not from Instagram ad, ignoring', { from: message.from });
        res.status(200).send('OK');
        return;
      }
      
      // Parse lead details
      const leadData = whatsappService.parseLeadMessage(
        message.text?.body || '',
        contact.profile.name
      );
      
      // Submit to Ruka website (this will handle Zoho CRM and calling)
      const result = await rukaService.submitToRuka({
        phoneNumber: message.from,
        name: leadData.name || contact.profile.name || 'Instagram Lead',
        email: leadData.email
      });
      
      // Send automated WhatsApp reply for Instagram leads
      if (result.success) {
        await whatsappService.sendMetaReply(
          message.from,
          `Thanks for your enquiry! You will get an automated call to know more about Ruka - Human Like Calling Agent.`
        );
        logger.info('WhatsApp reply sent to Instagram lead', { to: message.from });
      }
      
      logger.info('Instagram lead processed', {
        phone: message.from,
        name: leadData.name,
        submitted: result.success
      });
    }
    
    res.status(200).send('OK');
  } catch (error) {
    logger.error('Error processing Meta WhatsApp webhook:', error);
    res.status(200).send('OK'); // Return 200 to prevent webhook retry
  }
});

// Webhook verification for Meta
router.get('/meta', (req: Request, res: Response) => {
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  if (mode && token === verifyToken) {
    logger.info('Meta webhook verified');
    res.status(200).send(challenge);
  } else {
    logger.error('Meta webhook verification failed');
    res.status(403).send('Forbidden');
  }
});

export const whatsappRouter = router;