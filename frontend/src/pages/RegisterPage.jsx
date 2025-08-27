// frontend/src/pages/RegisterPage.jsx
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';

// V---V--- 1. IMPORT THE AURORA COMPONENT ---V---V
import Aurora from '../components/Aurora'; // Adjust path if necessary

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  
  const password = useRef({});
  password.current = watch('password', '');

  const onSubmit = async (data) => {
    setLoading(true);
    const { confirmPassword, ...apiData } = data;
    
    try {
      const response = await axios.post('/api/auth/register', apiData);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      window.dispatchEvent(new Event('authStateChanged'));
      
      toast.success('Account created successfully! Redirecting...');
      reset();
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    // V---V--- 2. MODIFY THE MAIN CONTAINER ---V---V
    // - Removed the old 'bg-gradient-to-br...'
    // - Added 'relative' and 'overflow-hidden' for positioning the background.
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      
      {/* --- 3. ADD THE AURORA BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        <Aurora />
      </div>

      {/* V---V--- 4. MODIFY THE FORM CARD CONTAINER ---V---V */}
      {/* - Added 'relative z-10' to lift it ON TOP of the Aurora background. */}
      {/* - Changed solid backgrounds to semi-transparent 'bg-white/10' etc. for the glass effect. */}
      {/* - Added 'backdrop-blur-xl' and a subtle 'border'. */}
      <div className="relative z-10 w-full max-w-5xl flex bg-white/10 dark:bg-gray-900/20 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl border border-white/20">
        
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 py-12 px-6 sm:px-12">
          <div className="text-center mb-6">
            <Link to="/" className="text-3xl font-bold text-gray-900 dark:text-white">TaskMaster</Link>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-4">Create your account</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Already have one?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Sign in
              </Link>
            </p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* The form inputs do not need to be changed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <input
                  {...register('firstName', { 
                    required: 'First name is required',
                    minLength: { value: 2, message: 'Must be at least 2 characters' }
                  })}
                  placeholder="First Name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              
              <div className="relative">
                <input
                  {...register('lastName', { 
                    required: 'Last name is required',
                    minLength: { value: 2, message: 'Must be at least 2 characters' }
                  })}
                  placeholder="Last Name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="relative">
              <input
                {...register('username', { 
                  required: 'Username is required', 
                  minLength: { value: 3, message: 'Must be at least 3 characters' }
                })}
                placeholder="Username"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>

            <div className="relative">
              <input
                {...register('email', { 
                  required: 'Email is required', 
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' }
                })}
                type="email" 
                placeholder="Email Address"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="relative">
              <input
                {...register('password', { 
                  required: 'Password is required', 
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                type={showPassword ? 'text' : 'password'} 
                placeholder="Password"
                className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 
                  <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> :
                  <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                }
              </span>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="relative">
              <input
                {...register('confirmPassword', { 
                  required: 'Please confirm your password', 
                  validate: value => value === password.current || 'Passwords do not match' 
                })}
                type={showPassword ? 'text' : 'password'} 
                placeholder="Confirm Password"
                className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* V---V--- 5. MODIFY THE ILLUSTRATION PANEL ---V---V */}
        {/* - Changed the solid blue background to a subtle, semi-transparent tint. */}
        <div className="hidden lg:flex w-1/2 items-center justify-center bg-black/10 dark:bg-white/5 p-12 flex-col text-white">
          <img src="https://illustrations.popsy.co/blue/work-on-project.svg" alt="Person working on a project" className="w-4/5" />
          <h1 className="text-3xl font-bold mt-8">Start Your Journey</h1>
          <p className="mt-2 text-center text-blue-100 dark:text-blue-200">Join our community to organize, track, and accomplish your goals like never before.</p>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;