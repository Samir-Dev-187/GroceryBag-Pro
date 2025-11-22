import { useState } from 'react';
import { ShoppingBag, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import CloudflareVerification from './CloudflareVerification';

interface UserLoginProps {
  onNext: () => void;
  onSwitchToAdmin: () => void;
  onSwitchToCustomer: () => void;
}

export default function UserLogin({ onNext, onSwitchToAdmin, onSwitchToCustomer }: UserLoginProps) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errors, setErrors] = useState({ phone: '', password: '' });

  const validatePhone = (value: string): string => {
    if (!value) return 'Phone number is required';
    if (!/^\d{10}$/.test(value)) return 'Phone number must be exactly 10 digits';
    return '';
  };

  const validatePassword = (value: string): string => {
    if (!value) return 'Password is required';
    if (value.length < 8 || value.length > 32) {
      return 'Password must be 8-32 characters';
    }
    if (!/[A-Z]/.test(value)) return 'Password must include uppercase letter';
    if (!/[a-z]/.test(value)) return 'Password must include lowercase letter';
    if (!/[0-9]/.test(value)) return 'Password must include a number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'Password must include special character';
    return '';
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    setErrors({ ...errors, phone: validatePhone(value) });
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setErrors({ ...errors, password: validatePassword(value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneError = validatePhone(phone);
    const passwordError = validatePassword(password);
    
    if (phoneError || passwordError) {
      setErrors({ phone: phoneError, password: passwordError });
      return;
    }
    
    if (!isVerified) {
      alert('Please verify you are human');
      return;
    }
    
    onNext();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
          {/* Logo and Title */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <ShoppingBag className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-gray-900 text-center mb-1">User Login</h1>
            <p className="text-gray-500 text-center">GroceryBag Pro</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Phone Number */}
            <div>
              <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="10-digit phone number"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className={`mt-1.5 h-12 ${errors.phone ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
                maxLength={10}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1.5">{errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className={`mt-1.5 h-12 pr-12 ${errors.password ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>
              )}
              {!errors.password && password && (
                <p className="text-gray-400 text-xs mt-1.5">
                  Must be 8-32 chars with uppercase, lowercase, number & special character
                </p>
              )}
            </div>

            {/* Cloudflare Verification */}
            <CloudflareVerification
              checked={isVerified}
              onChange={setIsVerified}
            />

            {/* Login Button */}
            <Button 
              type="submit" 
              disabled={!isVerified || !!errors.phone || !!errors.password}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Login Securely as User
            </Button>

            {/* Switch Links */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={onSwitchToAdmin}
                className="text-blue-600 text-sm hover:underline"
              >
                Login as Admin
              </button>
              <span className="text-gray-300">•</span>
              <button
                type="button"
                onClick={onSwitchToCustomer}
                className="text-blue-600 text-sm hover:underline"
              >
                Login as Customer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
