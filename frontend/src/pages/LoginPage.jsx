// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';

// V---V--- 1. IMPORT THE AURORA COMPONENT ---V---V
import Aurora from '../components/Aurora'; // Adjust the path if you save it elsewhere

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', data);  
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Notify other components like the Navbar about the auth change
      window.dispatchEvent(new Event('authStateChanged'));
      
      toast.success('Login successful! Welcome back.');
      navigate('/dashboard');
      
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        toast.error('Cannot connect to server. Please make sure the backend is running.');
      } else {
        toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // V---V--- 2. MODIFY THE MAIN CONTAINER ---V---V
    // - Removed the old 'bg-gradient-to-br...'
    // - Added 'relative' to act as a positioning container for the absolute Aurora background.
    // - Added 'overflow-hidden' to ensure the animation doesn't bleed out.
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      
      {/* --- 3. ADD THE AURORA BACKGROUND --- */}
      {/* - It's positioned absolutely to fill the entire screen. */}
      {/* - 'z-0' places it on the base layer, behind the form. */}
      <div className="absolute inset-0 z-0">
        <Aurora />
      </div>

      {/* V---V--- 4. MODIFY THE FORM CARD CONTAINER ---V---V */}
      {/* - Added 'relative z-10' to place it ON TOP of the Aurora background. */}
      {/* - Changed solid 'bg-white' to semi-transparent 'bg-white/10' for the glass effect. */}
      {/* - Added 'backdrop-blur-xl' for the frosted glass look. */}
      {/* - Added a subtle 'border' to help define the card's edges. */}
      <div className="relative z-10 w-full max-w-4xl flex bg-white/10 dark:bg-gray-900/20 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl border border-white/20">
        
        {/* V---V--- 5. MODIFY THE ILLUSTRATION PANEL ---V---V */}
        {/* - Changed the solid blue background to a subtle, semi-transparent tint. */}
        <div className="hidden lg:flex w-1/2 items-center justify-center bg-black/10 dark:bg-white/5 p-12 flex-col text-white">
          <img src="https://illustrations.popsy.co/blue/meditation.svg" alt="Person focusing on a task" className="w-4/5" />
          <h1 className="text-3xl font-bold mt-8">Welcome Back!</h1>
          <p className="mt-2 text-center text-blue-100 dark:text-blue-200">Sign in to continue managing your tasks and boost your productivity.</p>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 py-16 px-6 sm:px-12">
          <div className="text-center mb-8">
            <Link to="/" className="text-3xl font-bold text-gray-900 dark:text-white">TaskMaster</Link>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-4">Sign in to your account</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Or{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                create an account
              </Link>
            </p>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            <button className="flex items-center justify-center w-full py-2.5 border border-gray-300/50 dark:border-gray-600/50 rounded-lg hover:bg-gray-50/10 dark:hover:bg-gray-700/20 transition-colors text-gray-700 dark:text-gray-200">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.617-3.276-11.283-7.94l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.012,36.494,44,30.861,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
              </svg>
              Sign in with Google
            </button>
          </div>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-t border-gray-300/50 dark:border-gray-600/50" />
            <span className="px-4 text-sm text-gray-500 bg-transparent dark:text-gray-400">Or continue with email</span>
            <hr className="flex-grow border-t border-gray-300/50 dark:border-gray-600/50" />
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 sr-only">Email</label>
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
              </span>
              <input
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' } })}
                type="email" placeholder="Email Address"
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 sr-only">Password</label>
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
              </span>
              <input
                {...register('password', { required: 'Password is required' })}
                type={showPassword ? 'text' : 'password'} placeholder="Password"
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 
                  <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> :
                  <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                }
              </span>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            
            <div className="text-sm text-right">
              <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;