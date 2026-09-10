import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { Hexagon, LogIn, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration specific fields
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [registrationNumber, setRegistrationNumber] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { refreshData } = useApp();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isLogin) {
        if (!email || !password) throw new Error('Please fill in all fields');
        
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (authError) throw authError;
        
        // Fetch profile to get role for redirect
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single();
          
        await refreshData();
        
        if (profile?.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
        
      } else {
        if (!email || !password || !name || !gender || !registrationNumber) {
          throw new Error('Please fill in all fields');
        }

        // Validations
        if (!/^\d{12}$/.test(registrationNumber)) {
          throw new Error('Registration number must be exactly 12 digits');
        }
        if (!email.endsWith('@gmail.com') && !email.endsWith('@crescent.education')) {
          throw new Error('Email must end in @gmail.com or @crescent.education');
        }

        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              gender,
              registration_number: registrationNumber
            }
          }
        });

        if (authError) throw authError;

        setMessage('Registration successful! You can now sign in.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-24">
      <div className="glass-panel p-8 md:p-12 rounded-2xl w-full max-w-md relative z-10 border-t-4 border-t-primary bg-[#1d1612]">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="CFC Logo" className="h-16 w-auto object-contain mb-4" />
          <h2 className="text-3xl font-black tracking-wider text-glow font-display">
            {isLogin ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
          </h2>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" /> <p>{error}</p>
          </div>
        )}
        
        {message && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg mb-6 text-sm text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#140f0c] border border-white/10 rounded-lg px-4 py-3 text-[#f4f1ea] focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Registration Number</label>
                <input 
                  type="text" 
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  className="w-full bg-[#140f0c] border border-white/10 rounded-lg px-4 py-3 text-[#f4f1ea] focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="12 digit number"
                  maxLength={12}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full bg-[#140f0c] border border-white/10 rounded-lg px-4 py-3 text-[#f4f1ea] focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#140f0c] border border-white/10 rounded-lg px-4 py-3 text-[#f4f1ea] focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="student@crescent.education"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#140f0c] border border-white/10 rounded-lg px-4 py-3 text-[#f4f1ea] focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" fullWidth disabled={loading} className="mt-6 flex items-center justify-center gap-2 rounded-full py-3">
            {loading ? 'PROCESSING...' : (
              <><LogIn className="w-4 h-4" /> {isLogin ? 'SIGN IN' : 'REGISTER'}</>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-white/10 pt-6">
          <p className="text-sm text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }} 
              className="text-primary hover:text-[#f4f1ea] transition-colors font-semibold tracking-wide"
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
