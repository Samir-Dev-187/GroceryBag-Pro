import { CheckCircle2, ShoppingBag, Copy } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';

interface AccountCreatedSuccessProps {
  accountType: 'admin' | 'user' | 'customer';
  accountId: string;
  password: string;
  onGoToLogin: () => void;
}

export default function AccountCreatedSuccess({ 
  accountType, 
  accountId, 
  password, 
  onGoToLogin 
}: AccountCreatedSuccessProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  const accountTitles = {
    admin: 'Admin Account Created Successfully',
    user: 'User Account Created Successfully',
    customer: 'Customer Account Created Successfully',
  };

  const buttonTexts = {
    admin: 'Go to Login',
    user: 'Go to Users',
    customer: 'Go to Customers List',
  };

  const copyToClipboard = (text: string, type: 'id' | 'password') => {
    // Fallback method for clipboard access
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          updateCopiedState(type);
        }).catch(() => {
          fallbackCopy(text, type);
        });
      } else {
        fallbackCopy(text, type);
      }
    } catch (err) {
      fallbackCopy(text, type);
    }
  };

  const fallbackCopy = (text: string, type: 'id' | 'password') => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    try {
      document.execCommand('copy');
      updateCopiedState(type);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
    
    document.body.removeChild(textarea);
  };

  const updateCopiedState = (type: 'id' | 'password') => {
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>

          {/* Title */}
          <h1 className="text-gray-900 mb-2">{accountTitles[accountType]}</h1>
          <p className="text-gray-500 mb-8">
            Your account has been created. Save these credentials to login.
          </p>

          {/* Credentials */}
          <div className="space-y-4 mb-8">
            {/* Account ID */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="text-gray-500 text-sm mb-2">Your Unique ID</div>
              <div className="flex items-center justify-between gap-3">
                <div className="text-gray-900 text-xl break-all">{accountId}</div>
                <button
                  onClick={() => copyToClipboard(accountId, 'id')}
                  className="flex-shrink-0 p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {copiedId ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Password */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="text-gray-500 text-sm mb-2">Your Password</div>
              <div className="flex items-center justify-between gap-3">
                <div className="text-gray-900 text-xl break-all font-mono">{password}</div>
                <button
                  onClick={() => copyToClipboard(password, 'password')}
                  className="flex-shrink-0 p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {copiedPassword ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-8">
            <p className="text-orange-800 text-sm">
              ⚠️ Please save these credentials securely. You'll need them to login.
            </p>
          </div>

          {/* Action Button */}
          <Button
            onClick={onGoToLogin}
            className="w-full h-12 bg-gradient-to-r from-[#0F9D58] to-[#0d8a4d] hover:from-[#0d8a4d] hover:to-[#0b7a43] text-white rounded-xl shadow-lg"
          >
            {buttonTexts[accountType]}
          </Button>
        </div>
      </div>
    </div>
  );
}