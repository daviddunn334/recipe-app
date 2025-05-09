import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function Auth() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match')
      }

      if (isLogin) {
        // Handle login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (error) throw error
        
        // Successful login
        navigate('/')
      } else {
        // Handle sign up
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        })

        if (error) throw error

        // Show success message or redirect
        alert('Check your email for the confirmation link!')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
      })
      
      if (error) throw error
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card bg-base-100 shadow-xl w-full max-w-md">
        <div className="card-body p-8">
          <div className="flex flex-col gap-2 mb-8">
            <h2 className="text-3xl font-bold">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-sm text-base-content/70">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
              </span>
              <button 
                className="btn btn-link btn-sm p-0"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError(null)
                }}
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-error mb-6">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label pl-0">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label pl-0">
                <span className="label-text font-medium">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="input input-bordered w-full"
                required
              />
            </div>

            {!isLogin && (
              <div className="form-control">
                <label className="label pl-0">
                  <span className="label-text font-medium">Confirm Password</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="input input-bordered w-full"
                  required
                />
              </div>
            )}

            <div className="form-control mt-8">
              <button 
                type="submit" 
                className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {isLogin ? 'Log in' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="divider my-8">OR</div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              className="btn btn-outline"
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => handleSocialLogin('github')}
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.623 3.872 10.328 9.092 11.63a.751.751 0 01-.42.01.75.75 0 01-.42-.01C3.872 22.328 0 17.623 0 12 0 5.373 5.373 0 12 0zm0 2.16c-5.425 0-9.84 4.415-9.84 9.84 0 5.425 4.415 9.84 9.84 9.84 5.425 0 9.84-4.415 9.84-9.84 0-5.425-4.415-9.84-9.84-9.84zm0 1.68c4.525 0 8.16 3.635 8.16 8.16 0 4.525-3.635 8.16-8.16 8.16-4.525 0-8.16-3.635-8.16-8.16 0-4.525 3.635-8.16 8.16-8.16z"/>
              </svg>
              GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth 