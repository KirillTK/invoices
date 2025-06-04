# AWS Terraform Configuration for Next.js App

This Terraform configuration sets up AWS infrastructure for hosting your Next.js application in a cost-effective way, maximizing free tier usage.

## Architecture

This configuration provisions:

1. **Elastic Beanstalk (t2.micro)** - Free tier eligible server for running your Next.js application
2. **RDS PostgreSQL (db.t3.micro)** - Free tier eligible database
3. **S3 Bucket** - For static assets with website hosting enabled
4. **CloudFront Distribution** - CDN for serving static assets
5. **VPC with public subnets** - Network infrastructure

## Prerequisites

1. [AWS CLI](https://aws.amazon.com/cli/) installed and configured with your AWS credentials
2. [Terraform](https://www.terraform.io/downloads.html) installed (v1.2.0+)
3. AWS account with free tier eligibility

## Setup

1. Copy the example variables file and customize it:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

2. Edit `terraform.tfvars` and set your database password and any other customizations

3. Initialize Terraform:
   ```bash
   terraform init
   ```

4. Apply the configuration:
   ```bash
   terraform apply
   ```

5. After successful deployment, Terraform will output:
   - CloudFront domain name
   - Elastic Beanstalk endpoint
   - Database endpoint

## Deploying Your Next.js App

1. Build your Next.js application:
   ```bash
   npm run build
   ```

2. Create a `.ebextensions` directory in your project root with a file `00_deploy.config`:
   ```yaml
   option_settings:
     aws:elasticbeanstalk:container:nodejs:
       NodeCommand: "npm start"
       NodeVersion: 20.0.0
   ```

3. Create a `Procfile` in your project root:
   ```
   web: npm start
   ```

4. Install the Elastic Beanstalk CLI:
   ```bash
   pip install awsebcli
   ```

5. Initialize EB CLI in your project (choose the same region as in your Terraform config):
   ```bash
   eb init
   ```

6. Deploy to your Elastic Beanstalk environment:
   ```bash
   eb deploy
   ```

## Free Tier Considerations

This configuration is designed to stay within AWS Free Tier limits:
- t2.micro instance for Elastic Beanstalk (750 hours per month)
- db.t3.micro for RDS PostgreSQL (750 hours per month)
- 5GB of S3 storage
- CloudFront with limited data transfer

Monitor your AWS usage to avoid unexpected charges.

## Cleanup

To avoid incurring charges after the free tier period, destroy the infrastructure when not in use:

```bash
terraform destroy
```

## Notes

- For production use, consider enhancing security settings
- The database password is stored in plain text in terraform.tfvars, ensure this file is properly secured and not committed to version control
- This setup uses a single EC2 instance without load balancing to minimize costs 