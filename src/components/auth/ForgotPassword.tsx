import { useState } from 'react';
import { ArrowLeft, Mail, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface ForgotPasswordProps {
  onBack: () => void;
}

export default function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [uniqueId, setUniqueId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uniqueId.trim()) {
      alert('Please enter your Unique ID');
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>

            {/* Title */}
            <h1 className="text-gray-900 mb-4">Email Sent Successfully</h1>
            <p className="text-gray-500 mb-8">
              Password reset instructions have been sent to your registered email address.
              Please check your inbox and follow the instructions.
            </p>

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-8">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <div className="text-blue-900 text-sm mb-1">Check your email</div>
                  <div className="text-blue-700 text-xs">
                    If you don't see the email, check your spam folder or contact support.
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={onBack}
              className="w-full h-12 bg-gradient-to-r from-[#0F9D58] to-[#0d8a4d] hover:from-[#0d8a4d] hover:to-[#0b7a43] text-white rounded-xl shadow-lg"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0F9D58] to-[#0d8a4d] rounded-2xl flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">Forgot Password?</h1>
                <p className="text-gray-500 text-sm">Reset your password</p>
              </div>
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
            <p className="text-blue-900 text-sm">
              Enter your Unique ID and we'll send password reset instructions to your registered email address.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="uniqueId">Unique ID *</Label>
              <Input
                id="uniqueId"
                placeholder="Enter your Unique ID (e.g., AD-XXX11-1234-56)"
                value={uniqueId}
                onChange={(e) => setUniqueId(e.target.value)}
                className="mt-1.5 h-12"
                required
              />
              <p className="text-gray-500 text-xs mt-2">
                Your unique ID can be found in your account profile or registration email.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-[#0F9D58] to-[#0d8a4d] hover:from-[#0d8a4d] hover:to-[#0b7a43] text-white rounded-xl shadow-lg"
            >
              Send Reset Link
            </Button>

            {/* Back to Login */}
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="w-full h-12 rounded-xl"
            >
              Back to Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
