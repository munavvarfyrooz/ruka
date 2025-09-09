import axios from 'axios';
import { logger } from '../utils/logger';

export class ZohoCRMService {
  private accessToken: string = '';
  private apiUrl: string;
  private tokenExpiry: Date = new Date();

  constructor() {
    this.apiUrl = process.env.ZOHO_API_URL || 'https://www.zohoapis.in/crm/v2';
  }

  // Get access token using refresh token
  private async refreshAccessToken() {
    if (this.accessToken && this.tokenExpiry > new Date()) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        'https://accounts.zoho.in/oauth/v2/token',
        null,
        {
          params: {
            refresh_token: process.env.ZOHO_REFRESH_TOKEN,
            client_id: process.env.ZOHO_CLIENT_ID,
            client_secret: process.env.ZOHO_CLIENT_SECRET,
            grant_type: 'refresh_token'
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = new Date(Date.now() + 3600000); // 1 hour
      
      logger.info('Zoho access token refreshed');
      return this.accessToken;
    } catch (error) {
      logger.error('Failed to refresh Zoho access token:', error);
      throw error;
    }
  }

  // Create a lead in Zoho CRM
  async createLead(leadData: any) {
    const token = await this.refreshAccessToken();

    const zohoLeadData = {
      data: [{
        First_Name: leadData.name?.split(' ')[0] || 'Unknown',
        Last_Name: leadData.name?.split(' ').slice(1).join(' ') || 'Lead',
        Phone: leadData.Phone,
        Email: leadData.email || null,
        Lead_Source: leadData.Lead_Source || 'WhatsApp',
        Lead_Status: 'New',
        Description: leadData.Original_Message || leadData.message,
        
        // Custom fields for tracking
        WhatsApp_ID: leadData.WhatsApp_ID,
        Campaign_Source: leadData.Campaign_Source || 'Direct',
        Ad_Platform: leadData.Ad_Platform || 'Organic',
        Lead_Quality_Score: 0, // Will be updated after qualification
        First_Contact_Date: new Date().toISOString(),
        Message_Content: leadData.Original_Message,
        Customer_Interest: leadData.interests?.join(', ') || 'General Inquiry',
        
        // Additional tracking
        UTM_Source: leadData.utm_source,
        UTM_Campaign: leadData.utm_campaign,
        UTM_Medium: leadData.utm_medium,
        Conversion_Source: 'WhatsApp Integration',
        Auto_Call_Status: 'Pending'
      }],
      trigger: ['workflow', 'approval', 'blueprint']
    };

    try {
      const response = await axios.post(
        `${this.apiUrl}/Leads`,
        zohoLeadData,
        {
          headers: {
            'Authorization': `Zoho-oauthtoken ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const lead = response.data.data[0];
      logger.info('Lead created in Zoho CRM:', { 
        id: lead.details.id,
        name: leadData.name 
      });

      return lead.details;
    } catch (error) {
      logger.error('Failed to create lead in Zoho:', error);
      throw error;
    }
  }

  // Update lead after qualification
  async updateLeadQualification(leadId: string, qualificationData: any) {
    const token = await this.refreshAccessToken();

    const updateData = {
      data: [{
        id: leadId,
        Lead_Quality_Score: qualificationData.score,
        Lead_Status: qualificationData.qualified ? 'Qualified' : 'Not Qualified',
        Qualification_Notes: qualificationData.notes,
        Call_Duration: qualificationData.callDuration,
        Call_Recording_URL: qualificationData.recordingUrl,
        Qualified_Date: new Date().toISOString(),
        Next_Action: qualificationData.nextAction,
        Auto_Call_Status: 'Completed'
      }]
    };

    try {
      const response = await axios.put(
        `${this.apiUrl}/Leads`,
        updateData,
        {
          headers: {
            'Authorization': `Zoho-oauthtoken ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info('Lead qualification updated:', { leadId, qualified: qualificationData.qualified });
      return response.data;
    } catch (error) {
      logger.error('Failed to update lead qualification:', error);
      throw error;
    }
  }

  // Convert qualified lead to contact/deal
  async convertLead(leadId: string, conversionData: any) {
    const token = await this.refreshAccessToken();

    const convertData = {
      data: [{
        convert_to: conversionData.convertTo || 'Contacts',
        assign_to: conversionData.assignTo,
        Deal: conversionData.createDeal ? {
          Deal_Name: conversionData.dealName,
          Amount: conversionData.dealAmount,
          Stage: 'Qualification',
          Closing_Date: conversionData.closingDate
        } : null
      }]
    };

    try {
      const response = await axios.post(
        `${this.apiUrl}/Leads/${leadId}/convert`,
        convertData,
        {
          headers: {
            'Authorization': `Zoho-oauthtoken ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info('Lead converted:', { leadId, convertTo: conversionData.convertTo });
      return response.data;
    } catch (error) {
      logger.error('Failed to convert lead:', error);
      throw error;
    }
  }

  // Get lead details
  async getLeadDetails(leadId: string) {
    const token = await this.refreshAccessToken();

    try {
      const response = await axios.get(
        `${this.apiUrl}/Leads/${leadId}`,
        {
          headers: {
            'Authorization': `Zoho-oauthtoken ${token}`
          }
        }
      );

      return response.data.data[0];
    } catch (error) {
      logger.error('Failed to get lead details:', error);
      throw error;
    }
  }

  // Search for existing lead by phone
  async findLeadByPhone(phone: string) {
    const token = await this.refreshAccessToken();

    try {
      const response = await axios.get(
        `${this.apiUrl}/Leads/search`,
        {
          params: {
            criteria: `(Phone:equals:${phone})`
          },
          headers: {
            'Authorization': `Zoho-oauthtoken ${token}`
          }
        }
      );

      return response.data.data?.[0] || null;
    } catch (error) {
      logger.error('Error searching for lead:', error);
      return null;
    }
  }
}