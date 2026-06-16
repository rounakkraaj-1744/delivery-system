import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Truck, Smartphone, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

export const AgentLogin = () => {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { loginAgent } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length < 10) return toast.error('Please enter a valid phone number');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setOtp('1234'); // Mock auto-fill
      toast.success('OTP sent successfully');
    }, 800);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(async () => {
      try {
        await loginAgent(phone, otp);
        toast.success('Login successful');
        navigate('/agent/home');
      } catch (err) {
        toast.error('Invalid OTP. Use 1234 for demo.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-primary flex justify-center items-center p-4">
      <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-2xl p-8 page-transition">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-primary-surface text-primary rounded-full flex items-center justify-center">
            <Truck size={40} />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-neutral-900 text-center mb-2">Agent Portal</h1>
        <p className="text-neutral-600 text-center mb-8">Sign in to manage your deliveries.</p>

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-6 slide-in-right">
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-2">Phone Number</label>
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all text-lg font-medium"
                />
              </div>
            </div>
            <Button className="w-full h-14 text-lg rounded-2xl" isLoading={isLoading} type="submit">
              Send OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6 slide-in-right">
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-2">Enter OTP</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="1234"
                  className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all text-lg font-mono tracking-widest font-bold"
                />
              </div>
              <p className="text-sm text-neutral-500 mt-2 text-center">Demo OTP is 1234</p>
            </div>
            <Button className="w-full h-14 text-lg rounded-2xl" isLoading={isLoading} type="submit">
              Verify & Login
            </Button>
            <button 
              type="button" 
              onClick={() => setStep('phone')}
              className="w-full text-primary font-medium text-sm py-2 hover:underline"
            >
              Change Phone Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
