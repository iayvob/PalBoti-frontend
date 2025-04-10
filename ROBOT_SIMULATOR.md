# Robot Simulator Guide

The robot simulator allows you to test the Smart Warehouse Manager application without a physical robot. It simulates robot movements, task execution, and status updates.

## Running the Simulator

1. Make sure your environment variables are set up correctly in `.env.local`
2. Start the simulator:
   \`\`\`bash
   npm run robot:simulate
   \`\`\`
3. The simulator will connect to your MQTT broker and start publishing status updates

## Simulator Features

- **Status Updates**: The simulator publishes robot status updates to the `robot/status` topic
- **Position Updates**: Robot position changes are published to the `robot/position` topic
- **Task Execution**: The simulator can receive and execute tasks from the `robot/task` topic
- **Command Handling**: The simulator responds to commands on the `robot/command` topic

## Simulator Commands

You can send commands to the simulator using the MQTT broker. Here are the available commands:

- **start**: Start the robot and resume task execution
- **stop**: Stop the robot and cancel the current task
- **pause**: Pause the robot's operations
- **resume**: Resume the robot's operations
- **charge**: Send the robot to the charging station

Example command format:
\`\`\`json
{
  "robotId": "PB-001",
  "command": "start",
  "timestamp": "2025-04-10T12:34:56Z"
}
\`\`\`

## Simulator Behavior

- The robot starts in an "idle" state
- Battery level decreases over time and during operations
- When battery level drops below 20%, the robot automatically goes to the charging station
- The robot executes tasks in order of priority (high, medium, low)
- Task execution involves moving to the source location, picking up the product, and moving to the target location

## Testing with the Simulator

1. Start the simulator
2. Open your application dashboard
3. Create a new task through the API:
   \`\`\`bash
   curl -X POST http://localhost:3000/api/tasks \
     -H "Content-Type: application/json" \
     -d '{
       "type": "pickup",
       "priority": "high",
       "productId": "P-001",
       "sourceLocation": "Shelf A1, Stage 1",
       "targetLocation": "Shipping Zone"
     }'
   \`\`\`
4. Watch the simulator logs and your dashboard for real-time updates

## Extending the Simulator

You can extend the simulator by modifying the `src/script/robot-simulator.ts` file. Some ideas for extensions:

- Add more realistic movement patterns
- Implement obstacle avoidance
- Add battery consumption based on load and distance
- Simulate sensor readings
- Add multiple robots
