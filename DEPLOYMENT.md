# Deployment Guide for Smart Warehouse Manager

This guide provides step-by-step instructions for deploying the Smart Warehouse Manager application to production.

## Prerequisites

- GitHub account
- Vercel account (connected to your GitHub)
- MongoDB Atlas account
- HiveMQ Cloud account (or another MQTT broker service)

## Step 1: Set Up MongoDB Atlas

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas if you don't have one
2. Create a new cluster (the free tier is sufficient for testing)
3. Create a database user with read/write permissions
4. Add your IP address to the IP Access List (or use 0.0.0.0/0 for development)
5. Get your connection string by clicking "Connect" > "Connect your application"
   - It should look like: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/smart-warehouse?retryWrites=true&w=majority`
   - Replace `<username>` and `<password>` with your database user credentials

## Step 2: Set Up MQTT Broker

### Option 1: HiveMQ Cloud (Recommended for Production)

1. Create a HiveMQ Cloud account at https://www.hivemq.com/cloud/
2. Create a new cluster (the free plan allows up to 100 concurrent connections)
3. Create access credentials
4. Note your broker URL, username, and password

### Option 2: Public MQTT Broker (For Development Only)

For development, you can use the public HiveMQ broker:
- Broker URL: `mqtt://broker.hivemq.com:1883`
- No authentication required

## Step 3: Deploy to Vercel

1. Push your code to a GitHub repository
2. Log in to Vercel and create a new project
3. Import your GitHub repository
4. Configure the following environment variables:
   - `DATABASE_URL`: Your MongoDB Atlas connection string
   - `MQTT_BROKER_URL`: Your MQTT broker URL
   - `MQTT_USERNAME`: Your MQTT broker username
   - `MQTT_PASSWORD`: Your MQTT broker password
5. Deploy the application

## Step 4: Initialize the Database

After deployment, you need to initialize your database:

1. Clone your repository locally
2. Set up your environment variables in a `.env.local` file
3. Run the database initialization script:
   \`\`\`bash
   npm run init:db
   \`\`\`
4. Seed the database with initial data:
   \`\`\`bash
   npm run db:seed
   \`\`\`

## Step 5: Test the Deployment

1. Visit your deployed application
2. Test the MQTT connection:
   \`\`\`bash
   npm run test:mqtt
   \`\`\`
3. Run the robot simulator to see real-time updates:
   \`\`\`bash
   npm run robot:simulate
   \`\`\`

## Step 6: Production Considerations

### Scaling

- MongoDB Atlas: Upgrade your cluster as your data grows
- MQTT Broker: Ensure your broker can handle your expected message volume
- Vercel: Consider upgrading to a Pro plan for production workloads

### Security

- Use strong passwords for all services
- Implement proper authentication for your application
- Consider using TLS for MQTT connections
- Restrict database access to only necessary IP addresses

### Monitoring

- Set up monitoring for your application using Vercel Analytics
- Monitor your MongoDB Atlas cluster
- Implement logging for MQTT messages and application events

## Troubleshooting

### MQTT Connection Issues

- Verify your MQTT broker URL, username, and password
- Check if your broker allows connections from your deployment environment
- Ensure your broker supports WebSockets if you're connecting from the browser

### Database Connection Issues

- Verify your MongoDB connection string
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure your database user has the correct permissions

### Application Errors

- Check Vercel deployment logs
- Verify that all environment variables are correctly set
- Test your API endpoints using a tool like Postman
\`\`\`

## Running the Robot Simulator

Let's create a simple guide for running the robot simulator:
