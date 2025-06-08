# Factura Deployment Guide - Dokploy + Cloudflare CDN

This guide will help you deploy your Factura invoice management system using Dokploy as the hosting platform and Cloudflare as a CDN.

## 📋 Prerequisites

- **Server**: VPS or dedicated server (minimum 2GB RAM, 30GB storage)
- **Domain**: Registered domain name
- **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, etc.)
- **Dokploy**: Installed on your server
- **Cloudflare Account**: For CDN and DNS management

## 🚀 Quick Start

1. **Run the deployment script:**
   ```bash
   chmod +x deploy-dokploy.sh
   ./deploy-dokploy.sh
   ```

2. **Follow the interactive prompts** to configure your deployment

## 📊 Architecture Overview

```
Internet → Cloudflare CDN → Dokploy Server → Docker Container (Next.js + PostgreSQL)
```

## 🏗️ Infrastructure Components

### 1. Docker Configuration

- **`Dockerfile.prod`**: Production-optimized multi-stage build
- **`docker-compose.prod.yml`**: Complete stack with app, database, and Nginx
- **`nginx.conf`**: Reverse proxy with SSL, caching, and security headers

### 2. Dokploy Application Settings

- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Port**: 3000
- **Health Check**: `/api/health`

### 3. Database Configuration

- **Database**: PostgreSQL 15 Alpine
- **Persistent Storage**: Docker volume
- **Connection**: Internal Docker network

## 🔧 Environment Variables

Copy `env.template` to `.env` and configure:

```bash
# Database
POSTGRES_URL=postgresql://postgres:your_password@db:5432/factura
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=factura

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret_key_here
NEXTAUTH_URL=https://your-domain.com

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
CLERK_SECRET_KEY=sk_test_your_key

# Production Settings
NODE_ENV=production
SKIP_ENV_VALIDATION=true
```

## 📦 Step-by-Step Deployment

### Step 1: Prepare Your Server

1. **Install Dokploy** on your server:
   ```bash
   curl -sSL https://dokploy.com/install.sh | sh
   ```

2. **Access Dokploy dashboard** at `http://your-server-ip:3000`

3. **Create your first admin account**

### Step 2: Create Dokploy Project

1. **Create a new project** in Dokploy dashboard
   - Name: `factura`
   - Description: Invoice Management System

2. **Create a new application**:
   - **Service Type**: Application
   - **Name**: `factura`
   - **Git Repository**: Your repository URL
   - **Branch**: `main`
   - **Build Path**: `/` (root)

### Step 3: Configure Application Settings

1. **Build Configuration**:
   - **Dockerfile**: `Dockerfile.prod`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
   - **Port**: `3000`

2. **Environment Variables**:
   - Add all variables from your `.env` file
   - Make sure to set `SKIP_ENV_VALIDATION=true`

3. **Health Check**:
   - **Path**: `/api/health`
   - **Interval**: 30 seconds
   - **Timeout**: 10 seconds

### Step 4: Deploy Application

1. **Deploy** the application from Dokploy dashboard
2. **Monitor logs** for any build issues
3. **Test the deployment** using the generated domain

### Step 5: Configure Database

1. **Create PostgreSQL service** in Dokploy:
   - **Service Type**: Database
   - **Database Type**: PostgreSQL
   - **Version**: 15
   - **Database Name**: `factura`
   - **Username**: `postgres`
   - **Password**: (your secure password)

2. **Update connection string** in your environment variables

3. **Run database migrations**:
   ```bash
   # Connect to your deployed app and run:
   npm run db:push
   ```

### Step 6: Set Up Custom Domain

1. **Add domain** in Dokploy:
   - Go to your application → Domains
   - Add your custom domain
   - Enable SSL (Let's Encrypt)

2. **Configure DNS** (before Cloudflare):
   - Create A record pointing to your server IP
   - Wait for DNS propagation

## ☁️ Cloudflare CDN Configuration

### Step 1: Add Site to Cloudflare

1. **Add your domain** to Cloudflare
2. **Update nameservers** to Cloudflare's nameservers
3. **Wait for activation** (usually 24-48 hours)

### Step 2: DNS Configuration

1. **Create A record**:
   - **Name**: `@` (or your subdomain)
   - **IPv4 Address**: Your Dokploy server IP
   - **Proxy Status**: Proxied (orange cloud)

2. **Create CNAME record** (optional, for www):
   - **Name**: `www`
   - **Target**: `your-domain.com`
   - **Proxy Status**: Proxied

### Step 3: SSL/TLS Settings

1. **SSL/TLS Mode**: Full (strict)
2. **Edge Certificates**: 
   - Enable "Always Use HTTPS"
   - Enable "HSTS"
   - Min TLS Version: 1.2

### Step 4: Performance Optimization

1. **Speed → Optimization**:
   - ✅ Auto Minify: JavaScript, CSS, HTML
   - ✅ Brotli compression
   - ✅ Early Hints

2. **Caching → Configuration**:
   - **Browser Cache TTL**: 4 hours
   - **Caching Level**: Standard

### Step 5: Page Rules for Better Caching

Create these page rules in order:

1. **Static Assets** (`*.js`, `*.css`, `*.png`, `*.jpg`, etc.):
   ```
   Pattern: *your-domain.com/*.{js,css,png,jpg,jpeg,gif,ico,svg,woff,woff2}
   Settings: Cache Level: Cache Everything, Edge Cache TTL: 1 month
   ```

2. **API Routes** (disable caching):
   ```
   Pattern: *your-domain.com/api/*
   Settings: Cache Level: Bypass
   ```

3. **Next.js Static Files**:
   ```
   Pattern: *your-domain.com/_next/static/*
   Settings: Cache Level: Cache Everything, Edge Cache TTL: 1 year
   ```

### Step 6: Security Settings

1. **Security → WAF**:
   - Enable "Security Level: Medium"
   - Enable "Bot Fight Mode"

2. **Security → Scrape Shield**:
   - ✅ Email Address Obfuscation
   - ✅ Server-side Excludes
   - ✅ Hotlink Protection

## 🔍 Monitoring and Maintenance

### Health Monitoring

Your app includes a comprehensive health check endpoint at `/api/health`:

```bash
curl https://your-domain.com/api/health
```

**Response example**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "version": "1.0.0",
  "checks": {
    "database": {"status": "connected", "latency": 25},
    "memory": {"used": "45MB", "free": "128MB", "usage": "35%"},
    "node": "v20.10.0"
  }
}
```

### Dokploy Monitoring

1. **Application Logs**: Real-time logs in Dokploy dashboard
2. **Resource Usage**: CPU, Memory, and Network monitoring
3. **Deployment History**: Track all deployments and rollbacks

### Cloudflare Analytics

1. **Traffic Analytics**: Monitor visitors, bandwidth, and performance
2. **Security Events**: Track blocked threats and bot activity
3. **Cache Analytics**: Monitor cache hit ratio and performance

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check environment variables are set correctly
   - Verify Dockerfile.prod syntax
   - Review build logs in Dokploy

2. **Database Connection Issues**:
   - Verify POSTGRES_URL format
   - Check database service is running
   - Test connection from app container

3. **SSL Certificate Issues**:
   - Ensure domain DNS points to correct IP
   - Wait for Let's Encrypt certificate generation
   - Check Cloudflare SSL mode is "Full (strict)"

4. **Performance Issues**:
   - Review Cloudflare cache hit ratio
   - Check Dokploy resource allocation
   - Monitor application metrics

### Useful Commands

```bash
# View application logs
docker logs factura-app

# Check container status
docker ps

# Access database
docker exec -it factura-db psql -U postgres -d factura

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Update application
git push origin main  # (if auto-deploy is configured)
```

## 🔄 CI/CD Setup

### Auto-Deploy with Webhooks

1. **In Dokploy**:
   - Go to your application → Deployments
   - Copy the webhook URL

2. **In your Git repository**:
   - Go to Settings → Webhooks
   - Add the Dokploy webhook URL
   - Set trigger to "Push events" on main branch

3. **Test auto-deployment**:
   - Make a change and push to main
   - Watch deployment in Dokploy dashboard

## 📊 Performance Optimization

### Next.js Optimizations

- ✅ Standalone output enabled
- ✅ SWC minification
- ✅ Console removal in production
- ✅ Image optimization
- ✅ Bundle analysis

### Docker Optimizations

- ✅ Multi-stage build
- ✅ Alpine Linux base image
- ✅ Non-root user
- ✅ Layer caching
- ✅ Minimal attack surface

### Database Optimizations

- ✅ Connection pooling via Drizzle
- ✅ Proper indexing
- ✅ Query optimization
- ✅ Regular VACUUM and ANALYZE

## 🔐 Security Checklist

- ✅ HTTPS everywhere (Cloudflare + Let's Encrypt)
- ✅ Security headers (CSP, HSTS, etc.)
- ✅ Environment variables secured
- ✅ Database access restricted
- ✅ Regular security updates
- ✅ Cloudflare WAF enabled
- ✅ Bot protection active

## 📞 Support

If you encounter issues:

1. **Check the logs** in Dokploy dashboard
2. **Review this deployment guide**
3. **Test the health endpoint**
4. **Check Cloudflare settings**
5. **Verify environment variables**

## 🎉 Success!

Once deployed, your Factura application will be:

- ⚡ **Fast**: Cached by Cloudflare CDN worldwide
- 🔒 **Secure**: Protected by SSL, WAF, and security headers
- 📈 **Scalable**: Auto-scaling with Dokploy
- 🔍 **Monitored**: Health checks and comprehensive logging
- 🚀 **Automated**: CI/CD pipeline for continuous deployment

Your invoice management system is now ready for production use! 