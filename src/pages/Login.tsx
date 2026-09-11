import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { LogIn, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD'>('LOGIN');
  
  // Standard Login / Signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Signup only
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [phone, setPhone] = useState('');
  
  // Forgot Password
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { refreshData } = useApp();
  const navigate = useNavigate();

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (authMode === 'LOGIN') {
        if (!email || !password) throw new Error('Please fill in all fields');
        
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (authError) throw authError;
        
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
        
      } else if (authMode === 'SIGNUP') {
        if (!email || !password || !name || !gender || !registrationNumber || !phone) {
          throw new Error('Please fill in all fields');
        }

        if (!/^\d{12}$/.test(registrationNumber)) {
          throw new Error('Registration number must be exactly 12 digits');
        }
        if (!email.endsWith('@gmail.com') && !email.endsWith('@crescent.education')) {
          throw new Error('Email must end in @gmail.com or @crescent.education');
        }
        
        // Ensure Indian phone format
        const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone.replace(/^0+/, '')}`;

        const { data: _data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              gender,
              registration_number: registrationNumber,
              phone: formattedPhone
            }
          }
        });

        if (authError) throw authError;

        setMessage('Registration successful! You can now sign in.');
        setAuthMode('LOGIN');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (!email) throw new Error('Please enter your email address');
      
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      
      setOtpSent(true);
      setMessage('Password reset OTP sent to your email!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (!otp) throw new Error('Please enter the OTP');
      
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'recovery'
      });

      if (error) throw error;
      
      setOtpVerified(true);
      setMessage('OTP verified! You can now enter a new password.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (!newPassword) throw new Error('Please enter a new password');
      if (newPassword.length < 6) throw new Error('Password must be at least 6 characters');
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      
      setMessage('Password updated successfully! You can now log in.');
      setAuthMode('LOGIN');
      setOtpSent(false);
      setOtpVerified(false);
      setPassword('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-24">
      <div className="glass-panel p-8 md:p-12 rounded-2xl w-full max-w-md relative z-10 border-t-4 border-t-primary bg-[#1d1612]">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="CFC Logo" className="h-16 w-auto object-contain mb-4" />
          <h2 className="text-3xl font-black tracking-wider text-glow font-display text-center">
            {authMode === 'LOGIN' ? 'WELCOME BACK' : authMode === 'SIGNUP' ? 'CREATE ACCOUNT' : 'RESET PASSWORD'}
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

        {authMode === 'FORGOT_PASSWORD' ? (
          <form onSubmit={!otpSent ? handleSendResetOtp : (!otpVerified ? handleVerifyResetOtp : handleUpdatePassword)} className="space-y-4">
            {!otpSent ? (
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
            ) : !otpVerified ? (
              <div className="space-y-1">
                <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Enter 6-Digit OTP</label>
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-[#140f0c] border border-white/10 rounded-lg px-4 py-3 text-[#f4f1ea] focus:outline-none focus:border-primary/50 transition-colors text-center tracking-[0.5em] font-bold"
                  placeholder="123456"
                  maxLength={6}
                />
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#140f0c] border border-white/10 rounded-lg px-4 py-3 text-[#f4f1ea] focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            )}
            
            <Button type="submit" fullWidth disabled={loading} className="mt-6 flex items-center justify-center gap-2 rounded-full py-3">
              {loading ? 'PROCESSING...' : (
                <><LogIn className="w-4 h-4" /> {!otpSent ? 'SEND RESET OTP' : (!otpVerified ? 'VERIFY OTP' : 'UPDATE PASSWORD')}</>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handlePasswordAuth} className="space-y-4">
            {authMode === 'SIGNUP' && (
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">RRN</label>
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
                    <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Phone</label>
                    <input 
                      type="text" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#140f0c] border border-white/10 rounded-lg px-4 py-3 text-[#f4f1ea] focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="9940086123"
                    />
                  </div>
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
                <><LogIn className="w-4 h-4" /> {authMode === 'LOGIN' ? 'SIGN IN' : 'REGISTER'}</>
              )}
            </Button>
          </form>
        )}

        <div className="mt-8 text-center border-t border-white/10 pt-6 flex flex-col gap-3">
          {authMode !== 'LOGIN' && (
            <button onClick={() => { setAuthMode('LOGIN'); setError(''); setMessage(''); setOtpSent(false); setOtpVerified(false); }} className="text-sm text-gray-400 hover:text-white transition-colors">
              Already have an account? <span className="text-primary font-semibold">Log in</span>
            </button>
          )}
          {authMode !== 'SIGNUP' && (
            <button onClick={() => { setAuthMode('SIGNUP'); setError(''); setMessage(''); }} className="text-sm text-gray-400 hover:text-white transition-colors">
              Don't have an account? <span className="text-primary font-semibold">Sign up</span>
            </button>
          )}
          {authMode === 'LOGIN' && (
            <button onClick={() => { setAuthMode('FORGOT_PASSWORD'); setError(''); setMessage(''); }} className="text-sm text-gray-400 hover:text-white transition-colors">
              Forgot your password? <span className="text-primary font-semibold">Reset it here</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
