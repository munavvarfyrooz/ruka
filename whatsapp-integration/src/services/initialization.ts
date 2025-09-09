import { logger } from '../utils/logger';
import fs from 'fs/promises';
import path from 'path';

export async function initializeServices() {
  try {
    // Create logs directory if it doesn't exist
    const logsDir = path.join(process.cwd(), 'logs');
    await fs.mkdir(logsDir, { recursive: true });
    
    // Validate required environment variables
    const required = [
      'ZOHO_REFRESH_TOKEN',
      'ZOHO_CLIENT_ID',
      'ZOHO_CLIENT_SECRET'
    ];
    
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      logger.warn(`Missing environment variables: ${missing.join(', ')}`);
      logger.warn('Some features may not work properly');
    }
    
    // Check WhatsApp configuration
    const hasTwilio = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN;
    const hasMeta = process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID;
    
    if (!hasTwilio && !hasMeta) {
      logger.warn('No WhatsApp provider configured (Twilio or Meta)');
    } else {
      if (hasTwilio) logger.info('Twilio WhatsApp configured');
      if (hasMeta) logger.info('Meta WhatsApp API configured');
    }
    
    // Check Ruka configuration
    if (!process.env.RUKA_LANDING_URL) {
      logger.warn('RUKA_LANDING_URL not set, using default: https://ruka.live');
    }
    
    logger.info('Services initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize services:', error);
    throw error;
  }
}