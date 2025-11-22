import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface UserOTPProps {
  onVerified: () => void;
  onBack: () => void;
}

export default function UserOTP({ onVerified, onBack }: UserOTPProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  useEffect(() => {
    // Auto-verify when all 6 digits are entered
    if (otp.every(digit => digit !== '')) {
      handleVerify();
    }
  }, [otp]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last digit
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onVerified();
    }, 1500);
  };

  const handleResend = () => {
    setCanResend(false);
    setCountdown(10);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    alert('OTP resent successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="mb-6 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <ShoppingBag className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-gray-900 text-center mb-2">Enter the 6-digit OTP</h1>
            <p className="text-gray-500 text-center text-sm">
              We've sent a verification code to your phone
            </p>
          </div>

          <div className="mb-6">
            <div className="flex gap-2 lg:gap-3 justify-center">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 lg:w-14 lg:h-16 text-center text-xl border-2 focus-visible:ring-blue-600/20 focus-visible:border-blue-600"
                />
              ))}
            </div>
          </div>

          {isVerifying && (
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span>Verifying...</span>
              </div>
            </div>
          )}

          <Button
            onClick={handleVerify}
            disabled={otp.some(digit => digit === '') || isVerifying}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg disabled:opacity-50 mb-4"
          >
            Submit
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend}
              className={`text-sm ${
                canResend 
                  ? 'text-blue-600 hover:underline' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              {canResend ? 'Resend OTP' : `Resend OTP in ${countdown}s`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}