import { useState } from 'react';
import { Shield, Check } from 'lucide-react';

interface CloudflareVerificationProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function CloudflareVerification({ checked, onChange }: CloudflareVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleClick = () => {
    if (!checked) {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        onChange(true);
      }, 1500);
    }
  };

  return (
    <div className="border-2 border-gray-200 rounded-xl p-5 bg-gray-50/50 hover:bg-gray-50 transition-colors">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
          checked 
            ? 'bg-green-100' 
            : isVerifying 
            ? 'bg-blue-100' 
            : 'bg-gray-100'
        }`}>
          <Shield className={`w-6 h-6 ${
            checked 
              ? 'text-green-600' 
              : isVerifying 
              ? 'text-blue-600' 
              : 'text-gray-400'
          }`} />
        </div>
        <div className="flex-1">
          <div className="text-gray-900 text-sm">Verify you're human</div>
          <div className="text-gray-500 text-xs">Security check required</div>
        </div>
      </div>

      {/* Checkbox */}
      <div 
        onClick={handleClick}
        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors"
      >
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
          checked 
            ? 'bg-[#0F9D58] border-[#0F9D58]' 
            : isVerifying 
            ? 'bg-blue-100 border-blue-500 animate-pulse' 
            : 'bg-white border-gray-300'
        }`}>
          {checked && <Check className="w-3.5 h-3.5 text-white" />}
          {isVerifying && <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
        </div>
        <span className="text-gray-700 text-sm flex-1">
          {isVerifying ? 'Verifying...' : checked ? 'Verified!' : "I'm not a robot"}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-400">
        <span>Powered by</span>
        <span className="font-semibold text-orange-500">Cloudflare</span>
        <span>•</span>
        <span>Privacy-friendly</span>
      </div>
    </div>
  );
}
