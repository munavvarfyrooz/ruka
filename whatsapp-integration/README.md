# WhatsApp to Ruka Integration (Instagram Ads Only)

This service automatically processes WhatsApp messages from Instagram ad leads ONLY and:
1. Filters messages to only accept Instagram ad traffic
2. Extracts name and phone number
3. Submits to Ruka website for automatic calling
4. Ruka handles Zoho CRM creation and AI calling

## 🎯 Instagram Ad Filtering

**IMPORTANT**: This system ONLY processes messages from users who came through Instagram ads. All other messages receive a generic reply directing them to the website.

### How Instagram Detection Works

The system looks for these indicators in the message:
- Campaign codes: `ig_ad`, `instagram_ad`, `ig_promo`, `igruka`
- Keywords: "from instagram", "saw your instagram", "instagram ad"
- UTM parameters: `utm_source=instagram`
- Custom codes you add to your Instagram ads

### Setting Up Your Instagram Ads

In your Instagram ad's WhatsApp button/CTA, configure the message template to include an identifier:

**Option 1: Pre-filled Message**
```
Hi! I'm interested in your services [ig_ad]
```

**Option 2: Instructions in Ad**
```
"Message us on WhatsApp with code IG2024 for instant callback"
```

**Option 3: UTM Parameters**
```
Include utm_source=instagram in your message
```

## 📦 Installation

### 1. Install Dependencies

```bash
cd /home/ubuntu/ruka/whatsapp-zoho-integration
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
nano .env
```

Required settings:
```env
# Server Port
PORT=3001

# Your Ruka Landing Page (where leads will be submitted)
RUKA_LANDING_URL=http://localhost:8080  # or https://ruka.live

# WhatsApp Configuration (choose one)

# Option A: Twilio (Testing)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Option B: Meta WhatsApp API (Production)
WHATSAPP_ACCESS_TOKEN=your_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_id
WHATSAPP_VERIFY_TOKEN=your_verify_token
```

## 🚀 Running the Service

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### With PM2
```bash
pm2 start dist/index.js --name whatsapp-ig-integration
pm2 save
pm2 startup
```

## 🔧 WhatsApp Setup

### Twilio Setup (Easier)
1. Get Twilio WhatsApp sandbox
2. Configure webhook: `http://your-server:3001/webhook/whatsapp/twilio`

### Meta WhatsApp Business API
1. Set up WhatsApp Business API
2. Configure webhook: `http://your-server:3001/webhook/whatsapp/meta`
3. Verify token: Same as `.env` file
4. Subscribe to: `messages` events

## 📱 Message Flow

```
Instagram Ad → User clicks WhatsApp → User sends message with ig code
                                           ↓
                              WhatsApp Integration checks for Instagram indicator
                                           ↓
                          If Instagram: Extract name/phone → Submit to Ruka
                          If not: Send generic reply
                                           ↓
                              Ruka creates Zoho lead + initiates AI call
```

## 🧪 Testing

### Test Instagram Lead (will be processed)
```bash
curl -X POST http://localhost:3001/webhook/whatsapp/twilio \
  -H "Content-Type: application/json" \
  -d '{
    "From": "whatsapp:+1234567890",
    "Body": "Hi, I saw your Instagram ad and Im interested",
    "ProfileName": "John Doe"
  }'
```

### Test Non-Instagram Message (will be ignored)
```bash
curl -X POST http://localhost:3001/webhook/whatsapp/twilio \
  -H "Content-Type: application/json" \
  -d '{
    "From": "whatsapp:+1234567890",
    "Body": "Hi, I need help",
    "ProfileName": "Jane Smith"
  }'
```

## 📝 Customizing Instagram Detection

Edit `src/services/ad-tracker.ts` to add your custom Instagram ad codes:

```typescript
const instagramIndicators = [
  'your_custom_code',
  'campaign_name_2024',
  // Add your codes here
];
```

## 🔍 Monitoring

### Check Logs
```bash
# All logs
tail -f logs/combined.log

# Only Instagram leads
grep "Instagram ad lead detected" logs/combined.log

# Errors
tail -f logs/error.log
```

### Health Check
```bash
curl http://localhost:3001/health
```

## ⚠️ Important Notes

1. **Only Instagram traffic is processed** - All other messages get a generic reply
2. **Instagram ad must include identifier** - Users need to send the code/keyword
3. **Ruka website must be running** - This just forwards to your existing Ruka system
4. **Test with sandbox first** - Use Twilio sandbox before going live

## 🐛 Troubleshooting

### Instagram leads not detected
- Check if message contains Instagram identifier
- Review logs for incoming messages
- Verify ad-tracker.ts has correct keywords

### Ruka not calling
- Ensure RUKA_LANDING_URL is correct
- Test Ruka directly: `curl http://localhost:8080/api/call-request`
- Check Ruka server is running

### WhatsApp not receiving messages
- Verify webhook URL is public
- Check firewall allows port 3001
- Confirm webhook registered in Twilio/Meta

## 📊 Analytics

The system logs:
- Total messages received
- Instagram leads detected
- Non-Instagram messages filtered
- Successful Ruka submissions

View stats:
```bash
# Count Instagram leads today
grep "Instagram ad lead detected" logs/combined.log | grep "$(date +%Y-%m-%d)" | wc -l

# Count filtered messages
grep "not from Instagram ad" logs/combined.log | grep "$(date +%Y-%m-%d)" | wc -l
```