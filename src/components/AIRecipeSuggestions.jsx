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
      const response = await fetch("/api/ai-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      let data;
      try {
        const text = await response.text();
        data = JSON.parse(text);
      } catch (jsonError) {
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-100 rounded-lg shadow-md border border-base-200 p-4">
      <div className="flex items-center mb-3">
        <div className="flex items-center justify-center h-8 w-8 rounded-md bg-emerald-100 text-emerald-600 mr-2">
          <Sparkles size={16} />
        </div>
        <h2 className="text-xl font-semibold text-base-content">
          AI Recipe Suggestions
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex flex-col space-y-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Tell me what ingredients you have or what you're craving..."
            className="w-full p-3 border border-base-200 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-base-100 text-base-content"
            rows={2}
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="btn btn-primary btn-sm"
          >
            {loading ? "Generating..." : "Get Suggestions"}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-error/10 text-error p-3 rounded-lg mb-3 text-sm">
          <p>{error}</p>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((recipe, index) => (
            <div
              key={index}
              className="bg-base-200 rounded-lg p-3"
            >
              <h3 className="text-lg font-semibold text-base-content mb-1">
                {recipe.name}
              </h3>
              <p className="text-base-content/70 text-sm mb-2">
                {recipe.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <h4 className="font-medium text-base-content text-sm mb-1">
                    Ingredients:
                  </h4>
                  <ul className="list-disc list-inside text-base-content/70 text-sm">
                    {recipe.ingredients.map((ingredient, i) => (
                      <li key={i}>{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-base-content text-sm mb-1">
                    Instructions:
                  </h4>
                  <ol className="list-decimal list-inside text-base-content/70 text-sm">
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
