import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Ensure we always return JSON
  const sendError = (status, message) => {
    return res.status(status).json({ error: message });
  };

  if (req.method !== "POST") {
    return sendError(405, "Method not allowed");
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return sendError(400, "Prompt is required");
    }

    if (!process.env.OPENAI_API_KEY) {
      return sendError(500, "OpenAI API key is not configured");
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful cooking assistant. Generate 3 recipe suggestions based on the user's input.
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
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    if (!completion.choices?.[0]?.message?.content) {
      return sendError(500, "Invalid response from OpenAI");
    }

    try {
      const suggestions = JSON.parse(completion.choices[0].message.content);
      return res.status(200).json({ suggestions });
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      return sendError(500, "Failed to parse recipe suggestions");
    }
  } catch (error) {
    console.error("Error:", error);
    return sendError(500, error.message || "Failed to generate suggestions");
  }
}
