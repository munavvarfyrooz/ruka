import { Router } from 'express';
import { ZohoCRMService } from '../services/zoho-crm';
import { logger } from '../utils/logger';

const router = Router();
const zohoService = new ZohoCRMService();

// Get lead details
router.get('/lead/:id', async (req, res) => {
  try {
    const lead = await zohoService.getLeadDetails(req.params.id);
    res.json(lead);
  } catch (error) {
    logger.error('Error fetching lead:', error);
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
});

// Update lead qualification
router.post('/lead/:id/qualify', async (req, res) => {
  try {
    const result = await zohoService.updateLeadQualification(
      req.params.id,
      req.body
    );
    res.json(result);
  } catch (error) {
    logger.error('Error updating lead qualification:', error);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// Convert lead
router.post('/lead/:id/convert', async (req, res) => {
  try {
    const result = await zohoService.convertLead(
      req.params.id,
      req.body
    );
    res.json(result);
  } catch (error) {
    logger.error('Error converting lead:', error);
    res.status(500).json({ error: 'Failed to convert lead' });
  }
});

export const zohoRouter = router;