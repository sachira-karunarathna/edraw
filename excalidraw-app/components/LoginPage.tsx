import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGithub, FaGoogle, FaApple, FaDiscord } from 'react-icons/fa';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';

interface FormValues {
  email: string,
  password: string
};

interface LoginFormProps {
  onSignupClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSignupClick }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  async function signInWithEmail(values: FormValues) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })   
    console.log("Sign in data: ", data);
  }  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempted with:', email, password);
    // TODO: Implement this in Auth Context
    signInWithEmail({email, password})
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="you@example.com"
          required
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-gray-900">
            Forgot Password?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
      >
        Sign In
      </button>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button onClick={onSignupClick} className="text-emerald-600 hover:text-emerald-700 font-medium">
          Sign Up Now
        </button>
      </p>
    </form>
  );
}

interface SignupFormProps {
  onLoginClick: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onLoginClick }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const navigate = useNavigate();

  async function signUpWithEmail(values: FormValues) {
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: 'http://localhost:3000/auth/callback',
      },
    })   
    console.log("Sign up data: ", data);
  }  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup attempted with:', email, password);
    /*
      Check if password and confirm password is same

      TODO: If password not matching show an error message
    */
    if (password === confirmPassword) {
      // TODO: Implement this in Auth Context
      signUpWithEmail({email, password})
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="you@example.com"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          required
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
      >
        Sign Up
      </button>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button onClick={onLoginClick} className="text-emerald-600 hover:text-emerald-700 font-medium">
          Log In
        </button>
      </p>
    </form>
  );
}

export default function LoginPage() {
  const { loading, signInWithGoogle, signInWithGithub, signInWithDiscord, signInWithApple } = useAuth()

  const [isLogin, setIsLogin] = useState<boolean>(false);

  const handleGithubLogin = async () => {
    signInWithGithub();
   }

  const handleGoogleLogin = async () => {
    signInWithGoogle();
  }

  const handleDiscordLogin = async () => {
    signInWithDiscord();
   }

  const handleAppleLogin = () => {
    console.log("Apple login!");
    // TODO: Setup Apple login in supabase dashboard
    // And handle the apple login here by implementing the logic in Auth Context
   }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col p-8 lg:px-12 xl:px-16">
        {/* 
          Logo
          TODO: Replace the logo with Actual one
        */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-emerald-500 rounded"></div>
          <span className="font-bold text-xl">eDraw</span>
        </div>

        <div className="flex-1 flex items-center max-w-md mx-auto w-full">
          <div className="w-full">
            <h1 className="text-3xl font-bold mb-2 text-center">{isLogin ? 'Welcome back' : 'Create an account'}</h1>
            <p className="text-gray-600 mb-8 text-center">{isLogin ? 'Sign in to your account' : 'Sign up for a new account'}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
              <button onClick={handleGithubLogin} className="flex items-center justify-center gap-2 border rounded-md px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                <FaGithub className="w-5 h-5" />
              </button>
              <button onClick={handleGoogleLogin} className="flex items-center justify-center gap-2 border rounded-md px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                <FaGoogle className="w-5 h-5" />
              </button>
              <button onClick={handleDiscordLogin} className="flex items-center justify-center gap-2 border rounded-md px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                <FaDiscord className="w-5 h-5" />
              </button>
              <button onClick={handleAppleLogin} className="flex items-center justify-center gap-2 border rounded-md px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                <FaApple className="w-5 h-5" />
              </button>
              <button className="flex items-center justify-center gap-2 border rounded-md px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                <span className="hidden sm:inline">SSO</span>
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {isLogin ? (
              <LoginForm onSignupClick={() => setIsLogin(false)} />
            ) : (
              <SignupForm onLoginClick={() => setIsLogin(true)} />
            )}

            <p className="mt-8 text-center text-xs text-gray-500">
              By continuing, you agree to eDraw's{' '}
              <Link to="/terms" className="underline hover:text-gray-700">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="underline hover:text-gray-700">
                Privacy Policy
              </Link>
              , and to receive periodic emails with updates.
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center p-12 bg-gray-50">
        <div className="max-w-md">
          <div className="text-4xl font-bold text-gray-900 mb-4">"</div>
          <p className="text-xl font-medium text-gray-900 mb-4">
            Did a awesome team presentation with @eDraw last week with no prior experience with it. It's
            awesome to use tool. Thumbs up
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
              <img
                src="/placeholder.svg"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-medium text-gray-900">@michael_se</span>
          </div>
        </div>
      </div>
    </div>
  );
}
