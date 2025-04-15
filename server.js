import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.post("/ai-suggestions", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (!process.env.HUGGINGFACE_API_KEY) {
      console.error("Hugging Face API key is not configured");
      return res
        .status(500)
        .json({ error: "Hugging Face API key is not configured" });
    }

    console.log("Sending request to Hugging Face API...");
    const response = await fetch(
      "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: `You are a helpful cooking assistant. Generate 3 recipe suggestions based on the following input: ${prompt}
          
          For each recipe, provide:
          1. A creative name
          2. A brief description
          3. A list of ingredients
          4. Step-by-step instructions
          
          Format the response as a JSON array with the following structure:
          [
            {
              "name": "Recipe Name",
              "description": "Brief description",
              "ingredients": ["ingredient 1", "ingredient 2", ...],
              "instructions": ["step 1", "step 2", ...]
            },
            ...
          ]`,
          parameters: {
            max_new_tokens: 800,
            temperature: 0.7,
            top_p: 0.9,
            return_full_text: false,
          },
        }),
      }
    );

    console.log("Hugging Face API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hugging Face API error response:", errorText);
      return res.status(500).json({
        error: "Failed to generate suggestions",
        details: errorText,
      });
    }

    const result = await response.json();
    console.log("Raw Hugging Face response:", JSON.stringify(result, null, 2));

    if (!result || !result[0] || !result[0].generated_text) {
      console.error("Invalid response structure:", result);
      return res.status(500).json({ error: "Invalid response from AI model" });
    }

    try {
      const text = result[0].generated_text;
      console.log("Generated text:", text);

      // Try to find JSON in the response
      const jsonStart = text.indexOf("[");
      const jsonEnd = text.lastIndexOf("]") + 1;

      if (jsonStart === -1 || jsonEnd === 0) {
        console.error("No JSON found in response");
        return res
          .status(500)
          .json({ error: "Could not find recipe data in response" });
      }

      const jsonStr = text.slice(jsonStart, jsonEnd);
      console.log("Extracted JSON:", jsonStr);

      const suggestions = JSON.parse(jsonStr);

      if (!Array.isArray(suggestions) || suggestions.length === 0) {
        console.error("Invalid suggestions format:", suggestions);
        return res.status(500).json({ error: "Invalid recipe format" });
      }

      return res.status(200).json({ suggestions });
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      return res.status(500).json({
        error: "Failed to parse recipe suggestions",
        details: parseError.message,
      });
    }
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      error: "Failed to generate suggestions",
      details: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
