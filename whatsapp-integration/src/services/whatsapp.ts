import twilio from 'twilio';
import axios from 'axios';
import { logger } from '../utils/logger';

export class WhatsAppService {
  private twilioClient: any;
  private metaAccessToken: string;
  private phoneNumberId: string;

  constructor() {
    // Initialize Twilio if credentials provided
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      logger.info('Twilio client initialized for WhatsApp replies');
    } else {
      logger.warn('Twilio credentials not found for WhatsApp replies');
    }
    
    // Meta WhatsApp API credentials
    this.metaAccessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
  }

  // Parse lead information from WhatsApp message
  parseLeadMessage(message: string, senderName?: string) {
    const leadData: any = {
      name: senderName || 'Unknown',
      message: message,
      timestamp: new Date().toISOString()
    };

    // Extract email if present
    const emailMatch = message.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
    if (emailMatch) {
      leadData.email = emailMatch[0];
    }

    // Extract name if mentioned
    const namePatterns = [
      /(?:my name is|i am|this is)\s+([a-zA-Z\s]+)/i,
      /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/
    ];
    
    for (const pattern of namePatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        leadData.name = match[1].trim();
        break;
      }
    }

    // Detect intent/interest
    const interests = {
      'pricing': /price|cost|fee|charge|payment/i,
      'demo': /demo|trial|try|test/i,
      'support': /help|support|issue|problem/i,
      'purchase': /buy|purchase|order|interested/i,
      'information': /info|information|details|know more/i
    };

    leadData.interests = [];
    for (const [key, pattern] of Object.entries(interests)) {
      if (pattern.test(message)) {
        leadData.interests.push(key);
      }
    }

    return leadData;
  }

  // Send reply via Twilio
  async sendReply(to: string, message: string) {
    if (!this.twilioClient) {
      logger.warn('Twilio not configured, skipping reply');
      return;
    }

    try {
      const result = await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to: to
      });
      
      logger.info('WhatsApp reply sent via Twilio', { 
        messageId: result.sid,
        to: to 
      });
      
      return result;
    } catch (error) {
      logger.error('Failed to send WhatsApp reply via Twilio:', error);
      throw error;
    }
  }

  // Send reply via Meta WhatsApp API
  async sendMetaReply(to: string, message: string) {
    if (!this.metaAccessToken || !this.phoneNumberId) {
      logger.warn('Meta WhatsApp API not configured, skipping reply');
      return;
    }

    try {
      const response = await axios.post(
        `https://graph.facebook.com/v17.0/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: message }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.metaAccessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      logger.info('WhatsApp reply sent via Meta API', {
        messageId: response.data.messages[0].id,
        to: to
      });
      
      return response.data;
    } catch (error) {
      logger.error('Failed to send WhatsApp reply via Meta API:', error);
      throw error;
    }
  }

  // Send template message
  async sendTemplateMessage(to: string, templateName: string, parameters: string[]) {
    if (this.metaAccessToken && this.phoneNumberId) {
      // Use Meta API for templates
      try {
        const response = await axios.post(
          `https://graph.facebook.com/v17.0/${this.phoneNumberId}/messages`,
          {
            messaging_product: 'whatsapp',
            to: to,
            type: 'template',
            template: {
              name: templateName,
              language: { code: 'en' },
              components: [
                {
                  type: 'body',
                  parameters: parameters.map(text => ({ type: 'text', text }))
                }
              ]
            }
          },
          {
            headers: {
              'Authorization': `Bearer ${this.metaAccessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        return response.data;
      } catch (error) {
        logger.error('Failed to send template message:', error);
        throw error;
      }
    }
  }
}