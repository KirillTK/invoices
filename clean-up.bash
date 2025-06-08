#!/bin/bash
# AWS Resource Cleanup Script - No jq required

echo "Starting AWS resource cleanup for 'factura' resources..."

# List and delete S3 buckets
echo "Finding S3 buckets..."
for bucket in $(aws s3 ls | grep factura | awk '{print $3}'); do
    echo "Emptying and deleting bucket: $bucket"
    aws s3 rm s3://$bucket --recursive
    aws s3 rb s3://$bucket --force
    echo "Bucket $bucket deleted."
done

# List and disable CloudFront distributions
echo "Finding CloudFront distributions..."
for distid in $(aws cloudfront list-distributions --query "DistributionList.Items[].Id" --output text); do
    # Check if this distribution is related to our project
    domain=$(aws cloudfront get-distribution --id $distid --query "Distribution.DomainName" --output text)
    origins=$(aws cloudfront get-distribution --id $distid --query "Distribution.DistributionConfig.Origins.Items[].DomainName" --output text)
    
    if [[ $domain == *"factura"* ]] || [[ $origins == *"factura"* ]]; then
        echo "Found related distribution: $distid"
        
        # Get current ETag
        etag=$(aws cloudfront get-distribution --id $distid --query "ETag" --output text)
        
        # Check if distribution is already disabled
        enabled=$(aws cloudfront get-distribution --id $distid --query "Distribution.DistributionConfig.Enabled" --output text)
        
        if [ "$enabled" == "true" ]; then
            echo "Disabling distribution: $distid"
            
            # Save current config, modify it, and update
            aws cloudfront get-distribution-config --id $distid > dist-config-full.json
            etag=$(grep ETag dist-config-full.json | cut -d'"' -f4)
            
            # Extract just the DistributionConfig part
            sed -n '/DistributionConfig/,/ETag/p' dist-config-full.json > dist-config.json
            # Remove first and last lines
            sed -i '1d;$d' dist-config.json
            # Remove trailing comma from last item
            sed -i '$ s/,$//' dist-config.json
            # Change Enabled to false
            sed -i 's/"Enabled": true/"Enabled": false/' dist-config.json
            
            # Update the distribution
            aws cloudfront update-distribution --id $distid --if-match "$etag" --distribution-config file://dist-config.json
            echo "Distribution $distid is being disabled. It will take 15-30 minutes to complete."
        else
            echo "Distribution $distid is already disabled, attempting to delete..."
            # For disabled distributions, try to delete them
            aws cloudfront delete-distribution --id $distid --if-match "$etag"
            echo "Distribution $distid deleted."
        fi
        
        # Cleanup files
        rm -f dist-config.json dist-config-full.json
    fi
done

# List and terminate Elastic Beanstalk environments
echo "Finding Elastic Beanstalk environments..."
for env in $(aws elasticbeanstalk describe-environments --query "Environments[?contains(EnvironmentName, 'factura')].EnvironmentName" --output text); do
    echo "Terminating environment: $env"
    aws elasticbeanstalk terminate-environment --environment-name "$env"
    echo "Environment $env termination initiated."
done

# List and delete RDS instances
echo "Finding RDS instances..."
for db in $(aws rds describe-db-instances --query "DBInstances[?contains(DBInstanceIdentifier, 'factura')].DBInstanceIdentifier" --output text); do
    echo "Deleting RDS instance: $db"
    aws rds delete-db-instance --db-instance-identifier "$db" --skip-final-snapshot
    echo "RDS instance $db deletion initiated."
done

echo "Cleanup process completed. Some resources may still be in the process of being deleted."
echo "CloudFront distributions take 15-30 minutes to disable before they can be deleted."
echo "Run this script again later to delete disabled CloudFront distributions."