import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Calendar, ShoppingCart, Star, Users, Clock } from 'lucide-react';

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      text: "This app completely transformed how I plan meals for my family. I save so much time and money on groceries now!",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Chen",
      text: "As someone who loves cooking but hates the planning, this app is a game-changer. The recipe organization alone is worth it.",
      rating: 5,
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      text: "I've tried many meal planning apps, but this one stands out with its intuitive interface and helpful features.",
      rating: 4,
    }
  ];

  const features = [
    {
      icon: <ChefHat size={32} />,
      title: "Recipe Collection",
      description: "Store, categorize, and quickly find all your favorite recipes in one organized digital cookbook."
    },
    {
      icon: <Calendar size={32} />,
      title: "Meal Planning",
      description: "Drag and drop recipes to plan your daily and weekly meals with our intuitive calendar interface."
    },
    {
      icon: <ShoppingCart size={32} />,
      title: "Smart Shopping Lists",
      description: "Automatically generate shopping lists from your meal plans, categorized by grocery department."
    },
    {
      icon: <Users size={32} />,
      title: "Family Sharing",
      description: "Share recipes and meal plans with family members to keep everyone on the same page."
    },
    {
      icon: <Clock size={32} />,
      title: "Cook Mode",
      description: "Step-by-step cooking instructions that keep your screen awake and are easy to follow."
    },
    {
      icon: <Star size={32} />,
      title: "Recipe Discovery",
      description: "Discover new recipes based on your preferences, dietary restrictions, and available ingredients."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <ChefHat className="h-8 w-8 text-emerald-500" />
                <span className="ml-2 text-xl font-bold text-gray-900">MealMaster</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/features" className="px-3 py-2 text-gray-700 hover:text-emerald-600 transition-colors">Features</Link>
              <Link to="/pricing" className="px-3 py-2 text-gray-700 hover:text-emerald-600 transition-colors">Pricing</Link>
              <Link to="/blog" className="px-3 py-2 text-gray-700 hover:text-emerald-600 transition-colors">Blog</Link>
              <Link to="/auth" className="ml-4 px-4 py-2 rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors">Login</Link>
              <Link to="/auth?signup=true" className="px-4 py-2 rounded-md text-emerald-600 border border-emerald-600 hover:bg-emerald-50 transition-colors">Sign Up</Link>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-4 space-y-1 px-4">
              <Link to="/features" className="block px-3 py-2 text-gray-700 hover:text-emerald-600 transition-colors">Features</Link>
              <Link to="/pricing" className="block px-3 py-2 text-gray-700 hover:text-emerald-600 transition-colors">Pricing</Link>
              <Link to="/blog" className="block px-3 py-2 text-gray-700 hover:text-emerald-600 transition-colors">Blog</Link>
              <Link to="/auth" className="block px-3 py-2 text-emerald-600 font-medium">Login</Link>
              <Link to="/auth?signup=true" className="block px-3 py-2 text-emerald-600 font-medium">Sign Up</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-teal-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-20 md:py-28 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
                Your Personal <span className="text-emerald-600">Kitchen Assistant</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8">
                Simplify your cooking journey with our all-in-one platform for recipe management, meal planning, and smart grocery shopping.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/auth?signup=true" className="px-8 py-3 text-center rounded-md font-medium text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-colors">
                  Get Started for Free
                </Link>
                <Link to="/demo" className="px-8 py-3 text-center rounded-md font-medium text-emerald-600 bg-white border border-emerald-600 hover:bg-emerald-50 transition-colors">
                  Watch Demo
                </Link>
              </div>
            </div>
            <div className="mt-12 md:mt-0 md:w-1/2">
              <div className="relative rounded-lg shadow-2xl overflow-hidden">
                <img 
                  src="/api/placeholder/600/400" 
                  alt="App Dashboard Preview" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto fill-white">
            <path d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,90.7C960,96,1056,96,1152,90.7C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">All You Need in One Place</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our app combines everything you need to streamline your meal preparation process,
              from recipe organization to grocery shopping.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-100 text-emerald-600 mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Screenshots */}
      <section className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">See the App in Action</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore the intuitive interface designed to make your cooking experience seamless and enjoyable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div className="rounded-lg overflow-hidden shadow-md">
              <img src="/api/placeholder/400/300" alt="Recipe Collection" className="w-full h-auto" />
              <div className="p-4 bg-white">
                <h3 className="font-medium text-lg text-gray-900">Recipe Collection</h3>
                <p className="text-gray-600">Store and organize all your favorite recipes</p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-md">
              <img src="/api/placeholder/400/300" alt="Meal Planning Calendar" className="w-full h-auto" />
              <div className="p-4 bg-white">
                <h3 className="font-medium text-lg text-gray-900">Meal Planning Calendar</h3>
                <p className="text-gray-600">Plan your meals with our intuitive drag-and-drop calendar</p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-md">
              <img src="/api/placeholder/400/300" alt="Shopping List" className="w-full h-auto" />
              <div className="p-4 bg-white">
                <h3 className="font-medium text-lg text-gray-900">Shopping List Generator</h3>
                <p className="text-gray-600">Automatically create shopping lists from your meal plans</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Thousands of home cooks are already enjoying the benefits of our app.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4">"{testimonial.text}"</p>
                <p className="font-medium text-gray-900">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-600 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Simplify Your Cooking Journey?</h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied home cooks who have transformed their meal planning experience.
            Start your free trial today!
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/auth?signup=true" className="px-8 py-3 rounded-md font-medium text-emerald-600 bg-white hover:bg-emerald-50 shadow-md transition-colors">
              Sign Up Free
            </Link>
            <Link to="/pricing" className="px-8 py-3 rounded-md font-medium text-white border border-white hover:bg-emerald-700 transition-colors">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <ChefHat className="h-8 w-8 text-emerald-400" />
                <span className="ml-2 text-xl font-bold text-white">Two Spoons</span>
              </div>
              <p className="text-gray-400">
                Your all-in-one solution for recipe management,
                meal planning, and grocery shopping.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="hover:text-emerald-400 transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-emerald-400 transition-colors">Pricing</Link></li>
                <li><Link to="/testimonials" className="hover:text-emerald-400 transition-colors">Testimonials</Link></li>
                <li><Link to="/faq" className="hover:text-emerald-400 transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
                <li><Link to="/blog" className="hover:text-emerald-400 transition-colors">Blog</Link></li>
                <li><Link to="/careers" className="hover:text-emerald-400 transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/cookies" className="hover:text-emerald-400 transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© {new Date().getFullYear()} MealMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;