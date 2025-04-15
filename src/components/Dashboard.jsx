import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

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
          tags (*)
        `)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setRecentRecipes(data);
    } catch (error) {
      console.error('Error fetching recent recipes:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch all recipes
      const { data: recipes, error: recipesError } = await supabase
        .from('recipes')
        .select('*');

      if (recipesError) throw recipesError;

      // Calculate total recipes
      const totalRecipes = recipes.length;

      // Calculate total unique ingredients
      const allIngredients = recipes.reduce((acc, recipe) => {
        const ingredients = recipe.ingredients || [];
        return [...acc, ...ingredients.map(ing => ing.name)];
      }, []);
      const uniqueIngredients = new Set(allIngredients).size;

      // Calculate average prep time
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

  return (
    <div className="space-y-6">
      {/* Motivational Quote */}
      <div className="card bg-base-200">
        <div className="card-body">
          <div className="flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-lg italic">"{randomQuote}"</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat bg-primary text-primary-content rounded-lg">
          <div className="stat-title text-primary-content">Total Recipes</div>
          <div className="stat-value">{stats.totalRecipes}</div>
          <div className="stat-desc">↑ 23% from last month</div>
        </div>
        <div className="stat bg-secondary text-secondary-content rounded-lg">
          <div className="stat-title text-secondary-content">Total Ingredients</div>
          <div className="stat-value">{stats.totalIngredients}</div>
          <div className="stat-desc">↑ 12% from last month</div>
        </div>
        <div className="stat bg-accent text-accent-content rounded-lg">
          <div className="stat-title text-accent-content">Avg Prep Time</div>
          <div className="stat-value">{stats.avgPrepTime}m</div>
          <div className="stat-desc">↓ 5m from last month</div>
        </div>
      </div>

      {/* Recent Recipes */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Recent Recipes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentRecipes.map(recipe => (
              <div key={recipe.id} className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow">
                <figure className="relative h-48">
                  <img 
                    src={recipe.image_url} 
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-xl font-bold text-white">{recipe.name}</h3>
                  </div>
                </figure>
                <div className="card-body p-4">
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags?.map(tag => (
                      <span key={tag.id} className="badge badge-primary">{tag.name}</span>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span>Prep: {recipe.prep_time}m</span>
                    <span>Cook: {recipe.cook_time}m</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/recipes" className="card bg-primary text-primary-content shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="card-body items-center text-center">
                <span className="text-4xl mb-2">📖</span>
                <h3 className="card-title">Recipes</h3>
                <p>Browse and manage your recipes</p>
              </div>
            </Link>
            <Link to="/meal-plan" className="card bg-secondary text-secondary-content shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="card-body items-center text-center">
                <span className="text-4xl mb-2">📅</span>
                <h3 className="card-title">Meal Plan</h3>
                <p>Plan your weekly meals</p>
              </div>
            </Link>
            <Link to="/shopping-list" className="card bg-accent text-accent-content shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="card-body items-center text-center">
                <span className="text-4xl mb-2">🛒</span>
                <h3 className="card-title">Shopping List</h3>
                <p>Manage your grocery list</p>
              </div>
            </Link>
            <Link to="/profile" className="card bg-neutral text-neutral-content shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="card-body items-center text-center">
                <span className="text-4xl mb-2">👤</span>
                <h3 className="card-title">Profile</h3>
                <p>View your profile</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 