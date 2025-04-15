import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { Clock, Users, ChefHat, Star } from 'lucide-react';

function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [timePeriod, setTimePeriod] = useState('month');
  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalIngredients: 0,
    avgPrepTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [authState, setAuthState] = useState('checking');

  const motivationalQuotes = [
    "Cooking is like love. It should be entered into with abandon or not at all.",
    "The only real stumbling block is fear of failure. In cooking, you've got to have a what-the-hell attitude.",
    "Cooking is an art, but all art requires knowing something about the techniques and materials.",
    "The discovery of a new dish does more for human happiness than the discovery of a new star.",
    "Cooking is at once child's play and adult joy. And cooking done with care is an act of love.",
    "The kitchen is the heart of the home, and the heart of the kitchen is the cook.",
    "Good food is very often, even most often, simple food.",
    "Cooking is not about just making food. It's about making memories.",
    "The only time to eat diet food is while you're waiting for the steak to cook.",
    "Life is uncertain. Eat dessert first.",
    "Cooking is like painting or writing a song. Just as there are only so many notes or colors, there are only so many flavors - it's how you combine them that sets you apart.",
    "The preparation of good food is merely another expression of art, one of the joys of civilized living.",
    "Cooking is an art, but all art requires knowing something about the techniques and materials.",
    "The only real stumbling block is fear of failure. In cooking, you've got to have a what-the-hell attitude.",
    "Cooking is like love. It should be entered into with abandon or not at all."
  ];

  const [randomQuote, setRandomQuote] = useState('');

  useEffect(() => {
    fetchStats();
    fetchRecentRecipes();
    setRandomQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
  }, []);

  const fetchRecentRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          ingredients (*),
          tags (*)
        `)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setRecentRecipes(data);
    } catch (error) {
      console.error('Error fetching recent recipes:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: recipes, error: recipesError } = await supabase
        .from('recipes')
        .select('*');

      if (recipesError) throw recipesError;

      const totalRecipes = recipes.length;
      const allIngredients = recipes.reduce((acc, recipe) => {
        const ingredients = recipe.ingredients || [];
        return [...acc, ...ingredients.map(ing => ing.name)];
      }, []);
      const uniqueIngredients = new Set(allIngredients).size;
      const totalPrepTime = recipes.reduce((acc, recipe) => {
        return acc + (parseInt(recipe.prep_time) || 0);
      }, 0);
      const avgPrepTime = totalRecipes > 0 ? Math.round(totalPrepTime / totalRecipes) : 0;

      setStats({
        totalRecipes,
        totalIngredients: uniqueIngredients,
        avgPrepTime
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const spendingData = [
    { name: 'Jan', amount: 400 },
    { name: 'Feb', amount: 300 },
    { name: 'Mar', amount: 600 },
    { name: 'Apr', amount: 800 },
    { name: 'May', amount: 500 },
    { name: 'Jun', amount: 700 },
  ];

  const categoryData = [
    { name: 'Groceries', value: 400 },
    { name: 'Dining Out', value: 300 },
    { name: 'Entertainment', value: 200 },
    { name: 'Shopping', value: 100 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const renderRecipeCard = (recipe) => {
    return (
      <div key={recipe.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
        <figure className="px-4 pt-4">
          <img 
            src={recipe.image_url || 'https://placehold.co/600x400?text=No+Image'} 
            alt={recipe.name}
            className="rounded-xl h-48 w-full object-cover"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{recipe.name}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={16} />
            <span>{recipe.prep_time} min</span>
            <Users size={16} className="ml-2" />
            <span>{recipe.servings} servings</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ChefHat size={16} />
            <span>{recipe.difficulty}</span>
          </div>
          <div className="card-actions justify-end mt-4">
            <Link to={`/recipes/${recipe.id}`} className="btn btn-primary btn-sm">
              View Recipe
            </Link>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <ChefHat size={32} />
            </div>
            <div className="stat-title">Total Recipes</div>
            <div className="stat-value">{stats.totalRecipes}</div>
          </div>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <Users size={32} />
            </div>
            <div className="stat-title">Unique Ingredients</div>
            <div className="stat-value">{stats.totalIngredients}</div>
          </div>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-accent">
              <Clock size={32} />
            </div>
            <div className="stat-title">Avg Prep Time</div>
            <div className="stat-value">{stats.avgPrepTime} min</div>
          </div>
        </div>
      </div>

      {/* Quote Section */}
      <div className="card bg-base-200">
        <div className="card-body">
          <blockquote className="text-center italic">
            "{randomQuote}"
          </blockquote>
        </div>
      </div>

      {/* Recent Recipes Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentRecipes.map(renderRecipeCard)}
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 