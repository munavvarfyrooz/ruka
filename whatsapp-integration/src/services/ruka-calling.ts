import axios from 'axios';
import { logger } from '../utils/logger';

export class RukaCallingService {
  private rukaApiUrl: string;

  constructor() {
    // Use your existing Ruka landing page
    this.rukaApiUrl = process.env.RUKA_LANDING_URL || 'http://localhost:8080';
  }

  // Submit lead to Ruka website exactly like the form submission
  async submitToRuka(params: {
    phoneNumber: string;
    name: string;
    email?: string;
  }) {
    try {
      logger.info('Submitting lead to Ruka website', {
        name: params.name,
        phone: params.phoneNumber
      });

      // Submit to your existing /api/call-request endpoint
      // This will trigger Zoho CRM creation and Ruka call automatically
      const response = await axios.post(
        `${this.rukaApiUrl}/api/call-request`,
        {
          name: params.name,
          phoneNumber: params.phoneNumber,
          email: params.email || '' // Optional email if extracted from message
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info('Successfully submitted to Ruka', {
        response: response.data
      });

      return {
        success: true,
        message: response.data.message || 'Call request received'
      };
    } catch (error: any) {
      logger.error('Failed to submit to Ruka:', error);
      
      return {
        success: false,
        error: error.message || 'Unknown error'
      };
    }
  }
}