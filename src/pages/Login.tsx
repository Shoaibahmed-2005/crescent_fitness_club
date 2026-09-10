import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { Hexagon, LogIn, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    // Mock login logic
    const role = email.includes('admin') ? 'ADMIN' : 'STUDENT';
    login(email, role);
    
    navigate(role === 'ADMIN' ? '/admin' : '/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-24">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse-glow pointer-events-none" />
      
      <div className="glass-panel p-8 md:p-12 rounded-2xl w-full max-w-md relative z-10 border-t-4 border-t-primary">
        <div className="flex flex-col items-center mb-8">
          <Hexagon className="w-12 h-12 text-primary mb-4" />
          <h2 className="text-3xl font-black tracking-wider text-glow">{isLogin ? 'WELCOME BACK' : 'CREATE ACCOUNT'}</h2>
          <p className="text-gray-400 mt-2 text-sm text-center">
            {isLogin ? 'Enter your details to access your account' : 'Join the ultimate campus event platform'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">College Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="student@college.edu"
            />
            <p className="text-[10px] text-gray-500">Hint: Use 'admin@college.edu' for admin access</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" fullWidth className="mt-4 flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4" /> {isLogin ? 'SIGN IN' : 'REGISTER'}
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-white/10 pt-6">
          <p className="text-sm text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-primary hover:text-white transition-colors font-semibold"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
