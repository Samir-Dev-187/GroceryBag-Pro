import { useState } from 'react';
import { UserPlus, Users, Eye, EyeOff, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import AccountCreatedSuccess from './auth/AccountCreatedSuccess';

export default function CreateAccounts() {
  const [activeTab, setActiveTab] = useState<'customer' | 'user'>('customer');
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdAccount, setCreatedAccount] = useState<{ type: 'user' | 'customer'; id: string; password: string } | null>(null);

  // Customer form state
  const [customerName, setCustomerName] = useState('');
  const [customerAge, setCustomerAge] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [customerConfirmPassword, setCustomerConfirmPassword] = useState('');
  const [showCustomerPassword, setShowCustomerPassword] = useState(false);
  const [showCustomerConfirmPassword, setShowCustomerConfirmPassword] = useState(false);

  // User form state
  const [userName, setUserName] = useState('');
  const [userAge, setUserAge] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userConfirmPassword, setUserConfirmPassword] = useState('');
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [showUserConfirmPassword, setShowUserConfirmPassword] = useState(false);

  const validatePassword = (pwd: string) => {
    return {
      length: pwd.length >= 8 && pwd.length <= 32,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      digit: /\d/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    };
  };

  const generateId = (name: string, prefix: 'CU' | 'US'): string => {
    const names = name.trim().split(' ');
    const firstName = names[0] || '';
    const lastName = names[names.length - 1] || '';
    
    const initials = (firstName.substring(0, 2) + (lastName.charAt(0) || '')).toUpperCase().padEnd(3, 'X');
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random4 = String(Math.floor(1000 + Math.random() * 9000));
    const random2 = String(Math.floor(10 + Math.random() * 90));
    
    return `${prefix}-${initials}${month}-${random4}-${random2}`;
  };

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validatePassword(customerPassword);
    if (!Object.values(validation).every(Boolean)) {
      alert('Please ensure password meets all requirements');
      return;
    }
    
    if (customerPassword !== customerConfirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const customerId = generateId(customerName, 'CU');
    setCreatedAccount({ type: 'customer', id: customerId, password: customerPassword });
    setShowSuccess(true);
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validatePassword(userPassword);
    if (!Object.values(validation).every(Boolean)) {
      alert('Please ensure password meets all requirements');
      return;
    }
    
    if (userPassword !== userConfirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const userId = generateId(userName, 'US');
    setCreatedAccount({ type: 'user', id: userId, password: userPassword });
    setShowSuccess(true);
  };

  const handleGoToList = () => {
    setShowSuccess(false);
    setCreatedAccount(null);
    
    // Reset forms
    if (activeTab === 'customer') {
      setCustomerName('');
      setCustomerAge('');
      setCustomerPhone('');
      setCustomerEmail('');
      setCustomerPassword('');
      setCustomerConfirmPassword('');
    } else {
      setUserName('');
      setUserAge('');
      setUserPhone('');
      setUserEmail('');
      setUserPassword('');
      setUserConfirmPassword('');
    }
  };

  if (showSuccess && createdAccount) {
    return (
      <AccountCreatedSuccess
        accountType={createdAccount.type}
        accountId={createdAccount.id}
        password={createdAccount.password}
        onGoToLogin={handleGoToList}
      />
    );
  }

  const customerValidation = validatePassword(customerPassword);
  const customerPasswordsMatch = customerPassword === customerConfirmPassword && customerConfirmPassword !== '';
  const customerIsValid = Object.values(customerValidation).every(Boolean) && customerPasswordsMatch;

  const userValidation = validatePassword(userPassword);
  const userPasswordsMatch = userPassword === userConfirmPassword && userConfirmPassword !== '';
  const userIsValid = Object.values(userValidation).every(Boolean) && userPasswordsMatch;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <div className="max-w-4xl mx-auto p-4 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-gray-900 mb-2">Create Accounts</h1>
          <p className="text-gray-500">Create new customer or user accounts</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'customer' | 'user')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="customer" className="rounded-xl">
              <Users className="w-4 h-4 mr-2" />
              Create Customer
            </TabsTrigger>
            <TabsTrigger value="user" className="rounded-xl">
              <UserPlus className="w-4 h-4 mr-2" />
              Create User
            </TabsTrigger>
          </TabsList>

          {/* Customer Tab */}
          <TabsContent value="customer">
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
              <form onSubmit={handleCustomerSubmit} className="space-y-6">
                {/* Full Name & Age */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2">
                    <Label htmlFor="customerName">Full Name *</Label>
                    <Input
                      id="customerName"
                      placeholder="Enter full name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="mt-1.5 h-12"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerAge">Age *</Label>
                    <Input
                      id="customerAge"
                      type="number"
                      placeholder="Age"
                      value={customerAge}
                      onChange={(e) => setCustomerAge(e.target.value)}
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
                    <Label htmlFor="customerPhone">Phone Number *</Label>
                    <Input
                      id="customerPhone"
                      type="tel"
                      placeholder="10-digit phone number"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="mt-1.5 h-12"
                      maxLength={10}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerEmail">Email Address (Optional)</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      placeholder="customer@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="mt-1.5 h-12"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="customerPassword">Password *</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="customerPassword"
                      type={showCustomerPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={customerPassword}
                      onChange={(e) => setCustomerPassword(e.target.value)}
                      className="h-12 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCustomerPassword(!showCustomerPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCustomerPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {customerPassword && (
                    <div className="mt-3 space-y-1.5 p-3 bg-gray-50 rounded-xl">
                      <div className={`flex items-center gap-2 text-sm ${customerValidation.length ? 'text-green-600' : 'text-red-600'}`}>
                        {customerValidation.length ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        8-32 characters
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${customerValidation.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                        {customerValidation.uppercase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        One uppercase letter
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${customerValidation.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                        {customerValidation.lowercase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        One lowercase letter
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${customerValidation.digit ? 'text-green-600' : 'text-red-600'}`}>
                        {customerValidation.digit ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        One digit
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${customerValidation.special ? 'text-green-600' : 'text-red-600'}`}>
                        {customerValidation.special ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        One special character
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <Label htmlFor="customerConfirmPassword">Confirm Password *</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="customerConfirmPassword"
                      type={showCustomerConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      value={customerConfirmPassword}
                      onChange={(e) => setCustomerConfirmPassword(e.target.value)}
                      className="h-12 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCustomerConfirmPassword(!showCustomerConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCustomerConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {customerConfirmPassword && !customerPasswordsMatch && (
                    <p className="text-red-600 text-sm mt-1.5">Passwords do not match</p>
                  )}
                  {customerPasswordsMatch && (
                    <p className="text-green-600 text-sm mt-1.5 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Passwords match
                    </p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={!customerIsValid || !customerName || !customerPhone || !customerAge}
                  className="w-full h-12 bg-gradient-to-r from-[#0F9D58] to-[#0d8a4d] hover:from-[#0d8a4d] hover:to-[#0b7a43] text-white rounded-xl shadow-lg disabled:opacity-50"
                >
                  Create Customer Account
                </Button>
              </form>
            </div>
          </TabsContent>

          {/* User Tab */}
          <TabsContent value="user">
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
              <form onSubmit={handleUserSubmit} className="space-y-6">
                {/* Full Name & Age */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2">
                    <Label htmlFor="userName">Full Name *</Label>
                    <Input
                      id="userName"
                      placeholder="Enter full name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="mt-1.5 h-12"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="userAge">Age *</Label>
                    <Input
                      id="userAge"
                      type="number"
                      placeholder="Age"
                      value={userAge}
                      onChange={(e) => setUserAge(e.target.value)}
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
                    <Label htmlFor="userPhone">Phone Number *</Label>
                    <Input
                      id="userPhone"
                      type="tel"
                      placeholder="10-digit phone number"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="mt-1.5 h-12"
                      maxLength={10}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="userEmail">Email Address (Optional)</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      placeholder="user@example.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="mt-1.5 h-12"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="userPassword">Password *</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="userPassword"
                      type={showUserPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      className="h-12 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowUserPassword(!showUserPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showUserPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {userPassword && (
                    <div className="mt-3 space-y-1.5 p-3 bg-gray-50 rounded-xl">
                      <div className={`flex items-center gap-2 text-sm ${userValidation.length ? 'text-green-600' : 'text-red-600'}`}>
                        {userValidation.length ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        8-32 characters
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${userValidation.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                        {userValidation.uppercase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        One uppercase letter
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${userValidation.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                        {userValidation.lowercase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        One lowercase letter
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${userValidation.digit ? 'text-green-600' : 'text-red-600'}`}>
                        {userValidation.digit ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        One digit
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${userValidation.special ? 'text-green-600' : 'text-red-600'}`}>
                        {userValidation.special ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        One special character
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <Label htmlFor="userConfirmPassword">Confirm Password *</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="userConfirmPassword"
                      type={showUserConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      value={userConfirmPassword}
                      onChange={(e) => setUserConfirmPassword(e.target.value)}
                      className="h-12 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowUserConfirmPassword(!showUserConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showUserConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {userConfirmPassword && !userPasswordsMatch && (
                    <p className="text-red-600 text-sm mt-1.5">Passwords do not match</p>
                  )}
                  {userPasswordsMatch && (
                    <p className="text-green-600 text-sm mt-1.5 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Passwords match
                    </p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={!userIsValid || !userName || !userPhone || !userAge}
                  className="w-full h-12 bg-gradient-to-r from-[#0F9D58] to-[#0d8a4d] hover:from-[#0d8a4d] hover:to-[#0b7a43] text-white rounded-xl shadow-lg disabled:opacity-50"
                >
                  Create User Account
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
