import { useState } from 'react';
import client from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      await client.post('/auth/request-otp', { email });
      setStep(2);
    } catch (err) {
      alert('Failed to send OTP. Try again.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const success = await login(email, otp);
    if (success) navigate('/');
    else alert('Invalid OTP');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto' }} className="card">
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        {step === 1 ? 'Login / Register' : 'Verify OTP'}
      </h2>
      
      {step === 1 ? (
        <form onSubmit={handleRequestOtp}>
          <input 
            type="email" 
            className="input" 
            placeholder="Enter your email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Get OTP</button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <p style={{ marginBottom: '1rem', textAlign: 'center' }}>OTP sent to {email}</p>
          <input 
            type="text" 
            className="input" 
            placeholder="Enter OTP" 
            value={otp} 
            onChange={e => setOtp(e.target.value)} 
            required 
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Verify</button>
        </form>
      )}
    </div>
  );
}