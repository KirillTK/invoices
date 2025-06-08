#!/bin/bash

# Factura Dokploy Deployment Script
# This script helps deploy the Factura app to Dokploy

set -e

echo "🚀 Starting Factura deployment to Dokploy..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="factura"
DOKPLOY_SERVER=${DOKPLOY_SERVER:-""}
GIT_REPO=${GIT_REPO:-""}
BRANCH=${BRANCH:-"main"}
DOMAIN=${DOMAIN:-""}

# Function to print colored output
print_color() {
    printf "${1}${2}${NC}\n"
}

# Function to check if required tools are installed
check_requirements() {
    print_color $BLUE "🔍 Checking requirements..."
    
    if ! command -v docker &> /dev/null; then
        print_color $RED "❌ Docker is not installed"
        exit 1
    fi
    
    if ! command -v curl &> /dev/null; then
        print_color $RED "❌ curl is not installed"
        exit 1
    fi
    
    print_color $GREEN "✅ All requirements met"
}

# Function to validate environment variables
validate_env() {
    print_color $BLUE "🔧 Validating environment..."
    
    if [ -z "$DOKPLOY_SERVER" ]; then
        print_color $YELLOW "⚠️  DOKPLOY_SERVER not set. Please set it to your Dokploy server URL"
        echo -n "Enter your Dokploy server URL (e.g., https://your-server.com:3000): "
        read DOKPLOY_SERVER
    fi
    
    if [ -z "$GIT_REPO" ]; then
        print_color $YELLOW "⚠️  GIT_REPO not set. Detecting from current repository..."
        GIT_REPO=$(git remote get-url origin 2>/dev/null || echo "")
        if [ -z "$GIT_REPO" ]; then
            echo -n "Enter your Git repository URL: "
            read GIT_REPO
        fi
    fi
    
    print_color $GREEN "✅ Environment validated"
    print_color $BLUE "📍 Dokploy Server: $DOKPLOY_SERVER"
    print_color $BLUE "📦 Git Repository: $GIT_REPO"
    print_color $BLUE "🌿 Branch: $BRANCH"
}

# Function to create environment file from template
setup_env() {
    print_color $BLUE "🔑 Setting up environment variables..."
    
    if [ ! -f ".env" ]; then
        if [ -f "env.template" ]; then
            cp env.template .env
            print_color $YELLOW "⚠️  Created .env from template. Please update with your actual values!"
            print_color $YELLOW "📝 Don't forget to set:"
            print_color $YELLOW "   - POSTGRES_PASSWORD"
            print_color $YELLOW "   - NEXTAUTH_SECRET"
            print_color $YELLOW "   - CLERK keys"
            print_color $YELLOW "   - Your domain"
        else
            print_color $RED "❌ No .env file or template found"
            exit 1
        fi
    fi
}

# Function to build Docker image locally (for testing)
build_image() {
    print_color $BLUE "🏗️  Building Docker image locally..."
    
    docker build -f Dockerfile.prod -t $APP_NAME:latest .
    
    if [ $? -eq 0 ]; then
        print_color $GREEN "✅ Docker image built successfully"
    else
        print_color $RED "❌ Docker build failed"
        exit 1
    fi
}

# Function to test the application locally
test_local() {
    print_color $BLUE "🧪 Testing application locally..."
    
    # Start the stack
    docker-compose -f docker-compose.prod.yml up -d
    
    # Wait for services to be ready
    sleep 30
    
    # Test health endpoint
    if curl -f http://localhost:3000/api/health &> /dev/null; then
        print_color $GREEN "✅ Health check passed"
    else
        print_color $RED "❌ Health check failed"
        docker-compose -f docker-compose.prod.yml logs
        docker-compose -f docker-compose.prod.yml down
        exit 1
    fi
    
    # Cleanup
    docker-compose -f docker-compose.prod.yml down
}

# Function to create Dokploy project and application
create_dokploy_app() {
    print_color $BLUE "🚀 Creating Dokploy application..."
    
    print_color $YELLOW "📋 Manual steps required in Dokploy UI:"
    print_color $YELLOW "1. Go to $DOKPLOY_SERVER"
    print_color $YELLOW "2. Create a new project named '$APP_NAME'"
    print_color $YELLOW "3. Create a new application with these settings:"
    print_color $YELLOW "   - Name: $APP_NAME"
    print_color $YELLOW "   - Git Repository: $GIT_REPO"
    print_color $YELLOW "   - Branch: $BRANCH"
    print_color $YELLOW "   - Dockerfile: Dockerfile.prod"
    print_color $YELLOW "   - Port: 3000"
    print_color $YELLOW "4. Set environment variables from your .env file"
    print_color $YELLOW "5. Deploy the application"
}

# Function to setup Cloudflare CDN
setup_cloudflare() {
    print_color $BLUE "☁️  Cloudflare CDN Setup Instructions:"
    print_color $YELLOW "1. Add your domain to Cloudflare"
    print_color $YELLOW "2. Update nameservers to Cloudflare's"
    print_color $YELLOW "3. Create an A record pointing to your Dokploy server IP"
    print_color $YELLOW "4. Enable Cloudflare proxy (orange cloud)"
    print_color $YELLOW "5. Configure these settings in Cloudflare dashboard:"
    print_color $YELLOW "   - SSL/TLS: Full (strict)"
    print_color $YELLOW "   - Speed > Optimization: Enable Auto Minify for JS, CSS, HTML"
    print_color $YELLOW "   - Caching > Configuration: Browser TTL 4 hours"
    print_color $YELLOW "   - Page Rules: Cache everything for static assets"
}

# Function to display post-deployment checklist
post_deployment_checklist() {
    print_color $GREEN "🎉 Deployment preparation complete!"
    print_color $BLUE "📋 Post-deployment checklist:"
    print_color $YELLOW "1. ✅ Verify application is running in Dokploy"
    print_color $YELLOW "2. ✅ Test health endpoint: https://your-domain.com/api/health"
    print_color $YELLOW "3. ✅ Configure SSL certificate in Dokploy"
    print_color $YELLOW "4. ✅ Setup auto-deploy webhook"
    print_color $YELLOW "5. ✅ Configure monitoring and alerts"
    print_color $YELLOW "6. ✅ Setup database backups"
    print_color $YELLOW "7. ✅ Test all application features"
}

# Main deployment flow
main() {
    echo "=========================="
    print_color $GREEN "🏗️  FACTURA DOKPLOY DEPLOYMENT"
    echo "=========================="
    
    check_requirements
    validate_env
    setup_env
    
    echo ""
    echo "Choose deployment option:"
    echo "1. Build and test locally first (recommended)"
    echo "2. Skip local testing, go directly to Dokploy setup"
    echo "3. Show Cloudflare CDN setup only"
    echo -n "Enter your choice (1-3): "
    read choice
    
    case $choice in
        1)
            build_image
            test_local
            create_dokploy_app
            setup_cloudflare
            post_deployment_checklist
            ;;
        2)
            create_dokploy_app
            setup_cloudflare
            post_deployment_checklist
            ;;
        3)
            setup_cloudflare
            ;;
        *)
            print_color $RED "❌ Invalid choice"
            exit 1
            ;;
    esac
}

# Run main function
main "$@" 