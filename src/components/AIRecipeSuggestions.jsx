import { useState } from "react";
import { Sparkles } from "lucide-react";

function AIRecipeSuggestions() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      console.log("Sending request with prompt:", prompt);
      const response = await fetch("/api/ai-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      let data;
      try {
        const text = await response.text();
        console.log("Response text:", text);
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error("JSON parse error:", jsonError);
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch suggestions");
      }

      if (!data.suggestions) {
        throw new Error("No suggestions received");
      }

      setSuggestions(data.suggestions);
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-4">
        <Sparkles className="w-6 h-6 text-yellow-500 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          AI Recipe Suggestions
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Tell me what ingredients you have or what you're craving..."
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            rows={4}
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="btn btn-primary"
          >
            {loading ? "Generating..." : "Get Suggestions"}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg mb-4">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-6">
          {suggestions.map((recipe, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {recipe.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {recipe.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Ingredients:
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                    {recipe.ingredients.map((ingredient, i) => (
                      <li key={i}>{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Instructions:
                  </h4>
                  <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300">
                    {recipe.instructions.map((instruction, i) => (
                      <li key={i}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AIRecipeSuggestions;
