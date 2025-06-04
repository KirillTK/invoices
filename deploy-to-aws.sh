#!/bin/bash

# Exit on error
set -e

echo "==== Preparing Next.js app for AWS deployment ===="

# Build the Next.js app
echo "Building Next.js application..."
npm run build

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "Error: Terraform is not installed. Please install it first."
    exit 1
fi

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI is not installed. Please install it first."
    exit 1
fi

# Initialize and apply Terraform
echo "Setting up AWS infrastructure with Terraform..."
cd terraform
if [ ! -f "terraform.tfvars" ]; then
    echo "terraform.tfvars file not found. Creating from example..."
    cp terraform.tfvars.example terraform.tfvars
    echo "Please edit terraform/terraform.tfvars with your settings, then run this script again."
    exit 0
fi

terraform init
terraform apply -auto-approve

# Get outputs
EB_ENDPOINT=$(terraform output -raw elastic_beanstalk_endpoint)
CLOUDFRONT_DOMAIN=$(terraform output -raw cloudfront_domain)
DB_ENDPOINT=$(terraform output -raw database_endpoint)

echo "Infrastructure deployed successfully!"
echo "Elastic Beanstalk endpoint: $EB_ENDPOINT"
echo "CloudFront domain: $CLOUDFRONT_DOMAIN"
echo "Database endpoint: $DB_ENDPOINT"

# Check if Elastic Beanstalk CLI is installed
if ! command -v eb &> /dev/null; then
    echo "Warning: Elastic Beanstalk CLI is not installed."
    echo "Please install it with: pip install awsebcli"
    echo "Then initialize EB with: eb init"
    echo "And deploy with: eb deploy"
    exit 0
fi

# Return to project root
cd ..

# Initialize Elastic Beanstalk if not already initialized
if [ ! -d ".elasticbeanstalk" ]; then
    echo "Initializing Elastic Beanstalk..."
    eb init
else
    echo "Elastic Beanstalk already initialized."
fi

# Deploy to Elastic Beanstalk
echo "Deploying application to Elastic Beanstalk..."
eb deploy

echo "==== Deployment completed successfully! ===="
echo "Your Next.js app is now running at: $EB_ENDPOINT"
echo "Static assets are being served from: $CLOUDFRONT_DOMAIN" 