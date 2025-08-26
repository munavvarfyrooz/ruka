# EC2 Auto-Deployment Setup

This repository is configured with GitHub Actions for automatic deployment to EC2 on every push to master/main branch.

## Required GitHub Secrets

To enable auto-deployment, you need to add the following secrets to your GitHub repository:

### How to add secrets:
1. Go to your GitHub repository
2. Click on **Settings** tab
3. Click on **Secrets and variables** → **Actions** 
4. Click **New repository secret** for each of the following:

### Required Secrets:

#### 1. EC2_HOST
- Your EC2 public IP address or domain name
- Example: `54.123.456.789` or `yourdomain.com`

#### 2. EC2_USERNAME  
- The SSH username for your EC2 instance
- Common values: `ubuntu`, `ec2-user`, `admin`
- Depends on your EC2 AMI (Amazon Linux = `ec2-user`, Ubuntu = `ubuntu`)

#### 3. EC2_PRIVATE_KEY
- Your EC2 instance's private SSH key (the .pem file content)
- Copy the entire content of your .pem file including:
```
-----BEGIN RSA PRIVATE KEY-----
[Your key content here]
-----END RSA PRIVATE KEY-----
```

#### 4. EC2_PORT
- SSH port for your EC2 instance
- Default: `22`
- Only change if you've configured a custom SSH port

## EC2 Prerequisites

Before auto-deployment will work, ensure your EC2 instance has:

1. **Node.js and npm installed**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **PM2 installed globally** (for process management)
```bash
sudo npm install -g pm2
```

3. **Git installed and repository cloned**
```bash
sudo apt-get install git
cd ~
git clone https://github.com/munavvarfyrooz/ruka.git
cd ruka
```

4. **Environment variables configured**
Create a `.env` file in the project directory with:
```bash
DATABASE_URL=your_database_connection_string
PORT=8080
NODE_ENV=production
```

5. **Initial manual setup**
```bash
npm install
npm run build
pm2 start npm --name "ruka" -- start
pm2 save
pm2 startup  # Follow the instructions to enable PM2 on system startup
```

## How It Works

When you push to master/main branch:
1. GitHub Actions workflow triggers automatically
2. Connects to your EC2 instance via SSH
3. Pulls the latest code
4. Installs dependencies
5. Builds the project
6. Restarts the application using PM2

## Testing the Setup

After adding all secrets, push a small change to test:
```bash
git add .
git commit -m "Test auto-deployment"
git push origin master
```

Then check:
1. GitHub Actions tab in your repository to see the workflow running
2. Your EC2 application should restart with the new code

## Troubleshooting

- **Permission denied**: Ensure your EC2_PRIVATE_KEY is correctly formatted
- **Host unreachable**: Check EC2 security group allows SSH (port 22) from GitHub Actions IPs
- **Command not found**: Ensure Node.js, npm, and PM2 are installed on EC2
- **Build fails**: Check your EC2 instance has enough memory/disk space

## Security Notes

- Never commit `.env` files or secrets to the repository
- Regularly rotate your SSH keys
- Consider restricting SSH access to specific IPs if possible
- Use AWS Systems Manager Session Manager as an alternative to SSH keys