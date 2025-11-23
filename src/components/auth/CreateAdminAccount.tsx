import { useState } from 'react';
import { register } from '../../authClient';
import { ArrowLeft, Upload, Eye, EyeOff, Check, X, ShoppingBag } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface CreateAdminAccountProps {
  onSuccess: (adminData: { id: string; password: string }) => void;
  onBack: () => void;
}

export default function CreateAdminAccount({ onSuccess, onBack }: CreateAdminAccountProps) {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [govtIdType, setGovtIdType] = useState('');
  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (pwd: string) => {
    return {
      length: pwd.length >= 8 && pwd.length <= 32,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      digit: /\d/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    };
  };

  const validation = validatePassword(password);
  const isPasswordValid = Object.values(validation).every(Boolean);
  const passwordsMatch = password === confirmPassword && confirmPassword !== '';

  const generateAdminId = (name: string): string => {
    const names = name.trim().split(' ');
    const firstName = names[0] || '';
    const lastName = names[names.length - 1] || '';
    
    const initials = (firstName.substring(0, 2) + (lastName.charAt(0) || '')).toUpperCase().padEnd(3, 'X');
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random4 = String(Math.floor(1000 + Math.random() * 9000));
    const random2 = String(Math.floor(10 + Math.random() * 90));
    
    return `AD-${initials}${month}-${random4}-${random2}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid || !passwordsMatch) {
      alert('Please fix the password errors before submitting');
      return;
    }

    (async () => {
      try {
        const res: any = await register(phone, password, 'admin');
        if (res && res.uid) {
          onSuccess({ id: res.uid, password });
        } else {
          alert(res.error || 'Failed to create admin account');
        }
      } catch (err) {
        console.error(err);
        alert('Registration failed. Check console.');
      }
    })();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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
                <h1 className="text-gray-900">Create Admin Account</h1>
                <p className="text-gray-500 text-sm">Set up your administrator account</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name & Age */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1.5 h-12"
                  required
                />
              </div>
              <div>
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="mt-1.5 h-12"
                  min="18"
                  max="100"
                  required
                />
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="10-digit phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="mt-1.5 h-12"
                  maxLength={10}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 h-12"
                  required
                />
              </div>
            </div>

            {/* Government ID */}
            <div>
              <Label htmlFor="govtId">Government ID *</Label>
              <Select value={govtIdType} onValueChange={setGovtIdType} required>
                <SelectTrigger className="mt-1.5 h-12">
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aadhar">Aadhar Card</SelectItem>
                  <SelectItem value="pan">PAN Card</SelectItem>
                  <SelectItem value="school">School ID</SelectItem>
                  <SelectItem value="college">College ID</SelectItem>
                  <SelectItem value="driving">Driving License</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Upload ID Photo */}
            <div>
              <Label htmlFor="idPhoto">Upload ID Photo (Optional)</Label>
              <div className="mt-1.5">
                <label className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-[#0F9D58] transition-colors">
                  <input
                    id="idPhoto"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setIdPhoto(e.target.files?.[0] || null)}
                  />
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-gray-600 text-sm">
                      {idPhoto ? idPhoto.name : 'Click to upload ID photo'}
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password *</Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Requirements */}
              {password && (
                <div className="mt-3 space-y-1.5 p-3 bg-gray-50 rounded-xl">
                  <div className={`flex items-center gap-2 text-sm ${validation.length ? 'text-green-600' : 'text-red-600'}`}>
                    {validation.length ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    8-32 characters
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${validation.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                    {validation.uppercase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    One uppercase letter
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${validation.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                    {validation.lowercase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    One lowercase letter
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${validation.digit ? 'text-green-600' : 'text-red-600'}`}>
                    {validation.digit ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    One digit
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${validation.special ? 'text-green-600' : 'text-red-600'}`}>
                    {validation.special ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    One special character
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative mt-1.5">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="text-red-600 text-sm mt-1.5">Passwords do not match</p>
              )}
              {passwordsMatch && (
                <p className="text-green-600 text-sm mt-1.5 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Passwords match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isPasswordValid || !passwordsMatch || !fullName || !phone || !email || !govtIdType || !age}
              className="w-full h-12 bg-gradient-to-r from-[#0F9D58] to-[#0d8a4d] hover:from-[#0d8a4d] hover:to-[#0b7a43] text-white rounded-xl shadow-lg disabled:opacity-50"
            >
              Create Admin Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
