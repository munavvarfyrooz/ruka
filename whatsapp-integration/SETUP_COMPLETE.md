# ✅ WhatsApp Integration Setup Complete

## System Status: RUNNING

The WhatsApp to Ruka integration is now installed and running on port 3001.

## 🎯 What It Does

1. **Receives WhatsApp messages** via webhook
2. **Filters for Instagram ads only** - ignores all other messages
3. **Extracts name and phone** from Instagram leads
4. **Submits to Ruka** at http://localhost:8080/api/call-request
5. **NO auto-replies sent** - completely silent operation

## 📊 Current Configuration

- **Service Port**: 3001
- **Ruka URL**: http://localhost:8080
- **Instagram Detection**: Active (checking for keywords like "instagram", "ig_ad", etc.)
- **Status**: Running (PID: 222165)

## 🔧 Management Commands

```bash
cd /home/ubuntu/ruka/AIAgentLanding/whatsapp-integration

# Service management
./manage.sh start      # Start the service
./manage.sh stop       # Stop the service
./manage.sh restart    # Restart the service
./manage.sh status     # Check if running
./manage.sh logs       # View live logs

# Testing
./manage.sh test-ig       # Test Instagram message (will be processed)
./manage.sh test-regular  # Test regular message (will be ignored)
```

## 📡 Webhook URLs for WhatsApp Setup

When you set up WhatsApp Business API:

**For Twilio:**
```
http://YOUR-SERVER-IP:3001/webhook/whatsapp/twilio
```

**For Meta WhatsApp API:**
```
http://YOUR-SERVER-IP:3001/webhook/whatsapp/meta
Verify Token: ruka_whatsapp_verify_2024
```

## 🚀 Next Steps

### 1. Set Up WhatsApp Business API

You need to choose one:

**Option A: Meta WhatsApp Business API (Recommended)**
- Create Facebook Business Account
- Apply for WhatsApp Business API
- Get: Access Token, Phone Number ID
- Add to .env file

**Option B: Twilio (Easier for Testing)**
- Sign up for Twilio
- Get WhatsApp Sandbox
- Get: Account SID, Auth Token
- Add to .env file

### 2. Configure Your Instagram Ads

In your Instagram ad's WhatsApp CTA, include one of these keywords:
- "Message us with 'IG_AD' for instant callback"
- "From Instagram"
- "Instagram offer"
- Or any keyword from `src/services/ad-tracker.ts`

### 3. Update Environment Variables

Once you have WhatsApp credentials:
```bash
nano .env
# Add your WhatsApp API credentials
```

### 4. Open Firewall Port

For AWS EC2:
- Go to Security Groups
- Add Inbound Rule: Port 3001, Source: 0.0.0.0/0

## 📈 Monitoring

Check processed leads:
```bash
# Today's Instagram leads
grep "Instagram lead processed" logs/service.log | grep "$(date +%Y-%m-%d)" | wc -l

# Ignored messages
grep "not from Instagram" logs/service.log | grep "$(date +%Y-%m-%d)" | wc -l

# Live monitoring
./manage.sh logs
```

## ✅ Test Results

The system has been tested and is working:
- ✅ Instagram message → Processed and sent to Ruka
- ✅ Regular message → Ignored completely
- ✅ Ruka integration → Successfully creating Zoho leads and triggering calls

## 📝 Files Created

```
/home/ubuntu/ruka/AIAgentLanding/whatsapp-integration/
├── src/                  # Source code
├── dist/                 # Compiled JavaScript
├── logs/                 # Service logs
├── .env                  # Configuration
├── manage.sh            # Management script
└── README.md            # Documentation
```

## ⚠️ Important Notes

1. **Only Instagram traffic is processed** - all other messages are silently ignored
2. **No WhatsApp replies are sent** - completely silent operation
3. **Ruka must be running** on port 8080 for this to work
4. **WhatsApp API credentials needed** - System is ready but needs API keys

---

System is ready and running. Just add WhatsApp API credentials to .env when you have them.