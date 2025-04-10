# Smart Warehouse Manager

An end-to-end web application that interfaces with an autonomous robot to manage product classification, storage, and retrieval in a warehouse setting.

## Features

- Real-time MQTT communication with robots
- Robust Next.js frontend with responsive design
- API routes with Next.js and Prisma
- MongoDB for data persistence
- Real-time dashboard updates
- Robot simulation

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- MongoDB Atlas account (or local MongoDB server)
- HiveMQ account (for MQTT broker) or use the public broker for testing

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/smart-warehouse-manager.git
   cd smart-warehouse-manager
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Edit the `.env.local` file with your MongoDB connection string and other configurations.

4. Generate Prisma client:
   \`\`\`bash
   npm run prisma:generate
   \`\`\`

5. Seed the database:
   \`\`\`bash
   npm run db:seed
   \`\`\`

### Development

Start the development server:
\`\`\`bash
npm run dev
\`\`\`

### Robot Simulation

To simulate robot behavior, run:
\`\`\`bash
npm run robot:simulate
\`\`\`

## Deployment

### Vercel Deployment

1. Install the Vercel CLI:
   \`\`\`bash
   npm install -g vercel
   \`\`\`

2. Login to Vercel:
   \`\`\`bash
   vercel login
   \`\`\`

3. Deploy the application:
   \`\`\`bash
   vercel
   \`\`\`

4. Configure environment variables in the Vercel dashboard.

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address
5. Get your connection string and add it to your environment variables

### MQTT Configuration for Production

For production, it's recommended to set up a dedicated MQTT broker with authentication. You can use:
- HiveMQ Cloud (https://www.hivemq.com/cloud/)
- CloudMQTT (https://www.cloudmqtt.com/)
- AWS IoT Core (https://aws.amazon.com/iot-core/)

## Testing

Before deploying to production, test the following:

1. API endpoints for tasks, products, and robot status
2. MQTT communication
3. Real-time updates on the dashboard
4. Robot simulation
5. MongoDB integration

## License

This project is licensed under the MIT License - see the LICENSE file for details.
