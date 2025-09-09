import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { whatsappRouter } from './routes/whatsapp';
import { logger } from './utils/logger';
import { initializeServices } from './services/initialization';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/webhook/whatsapp', whatsappRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    rukaUrl: process.env.RUKA_LANDING_URL || 'http://localhost:8080'
  });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function startServer() {
  try {
    await initializeServices();
    
    app.listen(PORT, () => {
      logger.info(`WhatsApp to Ruka Integration Server running on port ${PORT}`);
      logger.info(`Webhook URLs:`);
      logger.info(`  Twilio: http://your-domain:${PORT}/webhook/whatsapp/twilio`);
      logger.info(`  Meta: http://your-domain:${PORT}/webhook/whatsapp/meta`);
      logger.info(`Forwarding leads to: ${process.env.RUKA_LANDING_URL || 'http://localhost:8080'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();