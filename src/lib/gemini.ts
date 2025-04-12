import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// Function to generate insights based on warehouse data
export async function generateWarehouseInsights(data: any) {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set in environment variables");
    throw new Error("GEMINI_API_KEY is required");
  }
  try {
    // Access the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Prepare the prompt with warehouse data
    const prompt = `
      You are an AI assistant specialized in warehouse management and logistics.
      Based on the following warehouse data, generate 3 actionable insights that would help improve efficiency, reduce costs, or optimize operations.
      
      For each insight, provide:
      1. A clear title
      2. A detailed description
      3. A confidence score (between 0 and 1)
      4. An impact level (low, medium, high)
      5. A category (optimization, maintenance, inventory, layout, energy)
      
      Warehouse Data:
      ${JSON.stringify(data, null, 2)}
      
      Format your response as a JSON array with the following structure:
      [
        {
          "title": "Insight title",
          "description": "Detailed description",
          "confidence": 0.95,
          "impact": "high",
          "category": "optimization"
        }
      ]
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // Clean the response text: Remove Markdown code fences if they exist.
    let cleanText = text.trim();
    if (cleanText.startsWith("```")) {
      // Remove the starting fence (which might include "json" language hint)
      cleanText = cleanText.replace(/^```(json)?\s*/i, "");
      // Remove the trailing fence
      cleanText = cleanText.replace(/\s*```$/, "");
    }

    // Parse the JSON response
    try {
      return JSON.parse(cleanText);
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      // Try to extract JSON from the text using a regex as a fallback
      const jsonMatch = cleanText.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error("Failed to extract JSON from response:", e);
          // Return a fallback response
          return [
            {
              title: "Error Processing Insights",
              description: "There was an error processing the AI-generated insights. Please try again later.",
              confidence: 0.5,
              impact: "medium",
              category: "system",
            },
          ];
        }
      }
      throw new Error("Failed to parse Gemini response");
    }
  } catch (error) {
    console.error("Error generating insights with Gemini:", error);
    throw error;
  }
}


// Function to analyze robot performance
export async function analyzeRobotPerformance(robotData: any) {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set in environment variables")
    throw new Error("GEMINI_API_KEY is required")
  }
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

    const prompt = `
      Analyze the following robot performance data and provide insights on:
      1. Battery efficiency
      2. Movement patterns
      3. Task completion rates
      4. Potential maintenance needs
      
      Robot Data:
      ${JSON.stringify(robotData, null, 2)}
      
      Format your response as a JSON object with the following structure:
      {
        "batteryAnalysis": {
          "status": "good|warning|critical",
          "description": "Analysis of battery performance",
          "recommendation": "Recommended action"
        },
        "movementAnalysis": {
          "status": "good|warning|critical",
          "description": "Analysis of movement patterns",
          "recommendation": "Recommended action"
        },
        "taskAnalysis": {
          "status": "good|warning|critical",
          "description": "Analysis of task completion",
          "recommendation": "Recommended action"
        },
        "maintenancePrediction": {
          "status": "good|warning|critical",
          "description": "Maintenance prediction",
          "recommendation": "Recommended action",
          "estimatedNextMaintenance": "Estimated time for next maintenance"
        }
      }
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return JSON.parse(text)
  } catch (error) {
    console.error("Error analyzing robot performance with Gemini:", error)
    throw error
  }
}

// Function to optimize warehouse layout
export async function optimizeWarehouseLayout(layoutData: any) {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set in environment variables")
    throw new Error("GEMINI_API_KEY is required")
  }
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

    const prompt = `
      Based on the following warehouse layout and product flow data, suggest optimizations to improve efficiency:
      
      Layout Data:
      ${JSON.stringify(layoutData, null, 2)}
      
      Provide recommendations for:
      1. Zone reorganization
      2. Product placement
      3. Robot path optimization
      4. Throughput improvement
      
      Format your response as a JSON object with clear, actionable recommendations.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return JSON.parse(text)
  } catch (error) {
    console.error("Error optimizing warehouse layout with Gemini:", error)
    throw error
  }
}
