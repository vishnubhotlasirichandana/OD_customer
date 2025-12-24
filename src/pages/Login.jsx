import { useState } from 'react';
import client from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await client.post('/auth/request-otp', { email });
      setStep(2);
    } catch (err) {
      alert('Failed to send OTP. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, otp);
    if (success) {
      navigate('/');
    } else {
      alert('Invalid OTP. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            {step === 1 ? 'Welcome Back' : 'Verify Identity'}
          </h1>
          <p className="text-gray-500 text-sm">
            {step === 1 
              ? 'Enter your email to sign in or create an account' 
              : `We sent a code to ${email}`}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input 
                type="email" 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" 
                placeholder="name@example.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? 'Sending...' : <>Continue <ArrowRight size={18} /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input 
                type="text" 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-center text-lg tracking-widest font-bold" 
                placeholder="000000" 
                value={otp} 
                onChange={e => setOtp(e.target.value)} 
                maxLength={6}
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-70"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button 
              type="button" 
              onClick={() => setStep(1)} 
              className="w-full text-sm text-gray-500 hover:text-orange-600 font-semibold"
            >
              Change Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}