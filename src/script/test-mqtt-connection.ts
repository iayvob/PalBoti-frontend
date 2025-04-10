// Test script to verify MQTT connection
import mqtt from "mqtt"

// MQTT Configuration from environment variables
const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || "mqtt://broker.hivemq.com:1883"
const MQTT_USERNAME = process.env.MQTT_USERNAME
const MQTT_PASSWORD = process.env.MQTT_PASSWORD
const MQTT_CLIENT_ID = `palbot-test-${Math.random().toString(16).substring(2, 10)}`

console.log(`Attempting to connect to MQTT broker: ${MQTT_BROKER_URL}`)

// Create connection options
const connectOptions: mqtt.IClientOptions = {
  clientId: MQTT_CLIENT_ID,
  clean: true,
  reconnectPeriod: 5000,
}

// Add authentication if provided
if (MQTT_USERNAME && MQTT_PASSWORD) {
  console.log("Using provided MQTT credentials")
  connectOptions.username = MQTT_USERNAME
  connectOptions.password = MQTT_PASSWORD
}

// Connect to the broker
const client = mqtt.connect(MQTT_BROKER_URL, connectOptions)

// Set up event handlers
client.on("connect", () => {
  console.log("✅ Successfully connected to MQTT broker!")

  // Subscribe to a test topic
  client.subscribe("test/connection", (err) => {
    if (!err) {
      console.log("Subscribed to test/connection topic")

      // Publish a test message
      client.publish(
        "test/connection",
        JSON.stringify({
          message: "Hello from Smart Warehouse Manager",
          timestamp: new Date().toISOString(),
        }),
      )

      console.log("Published test message")
    }
  })
})

client.on("message", (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message.toString()}`)

  // Close the connection after receiving the test message
  if (topic === "test/connection") {
    console.log("Test completed successfully!")
    setTimeout(() => {
      client.end()
      process.exit(0)
    }, 1000)
  }
})

client.on("error", (err) => {
  console.error("❌ MQTT connection error:", err)
  process.exit(1)
})

// Set a timeout to exit if connection fails
setTimeout(() => {
  if (!client.connected) {
    console.error("❌ Failed to connect to MQTT broker within timeout period")
    process.exit(1)
  }
}, 10000)
