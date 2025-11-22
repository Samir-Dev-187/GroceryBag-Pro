import { useState } from 'react';
import { 
  User, Phone, Mail, Calendar, Shield, Key, Bell, Globe, 
  Moon, Database, Activity, ChevronRight, Edit2, Check, LogOut
} from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface ProfileProps {
  userRole: 'admin' | 'user';
  onRoleSwitch: (role: 'admin' | 'user') => void;
}

// Mock profile data
const profileData = {
  admin: {
    name: 'Admin Kumar',
    phone: '+91 98765 43210',
    email: 'admin@grocerybag.com',
    joinedDate: '2023-05-15',
    status: 'Active',
    lastLogin: '2024-11-17 10:30 AM',
    device: 'Chrome on Windows',
    totalLogins: 342,
    actionsPerformed: 1250,
  },
  user: {
    name: 'Priya Sharma',
    phone: '+91 87654 32109',
    email: 'priya@grocerybag.com',
    joinedDate: '2024-02-20',
    status: 'Active',
    lastLogin: '2024-11-17 09:15 AM',
    device: 'Safari on iPhone',
    totalLogins: 156,
    pagesViewed: 542,
  },
};

export default function Profile({ userRole, onRoleSwitch }: ProfileProps) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);

  const data = userRole === 'admin' ? profileData.admin : profileData.user;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <div className="max-w-6xl mx-auto p-4 lg:p-8">
        <div className="mb-6">
          <h1 className="text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-500">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* 1. Top Profile Card */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg ${
                    userRole === 'admin' 
                      ? 'bg-gradient-to-br from-[#0F9D58] to-[#0d8a4d]' 
                      : 'bg-gradient-to-br from-blue-600 to-indigo-600'
                  }`}>
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-gray-900 mb-2">{data.name}</h2>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                      userRole === 'admin' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      <Shield className="w-3 h-3" />
                      {userRole === 'admin' ? 'Admin' : 'User'}
                    </div>
                  </div>
                </div>
                {userRole === 'admin' && (
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-500 text-xs">Phone Number</div>
                    <div className="text-gray-900 text-sm">{data.phone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-500 text-xs">Email Address</div>
                    <div className="text-gray-900 text-sm">{data.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-500 text-xs">Joined Date</div>
                    <div className="text-gray-900 text-sm">{data.joinedDate}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-2xl border border-green-100">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-500 text-xs">Status</div>
                    <div className="text-green-700 text-sm">{data.status}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Security & Login Details Card */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm">
              <h2 className="text-gray-900 mb-6">Security & Login Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Key className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-gray-900 text-sm">Password</div>
                      <div className="text-gray-500 text-xs">Last changed 30 days ago</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-xl">
                    Change
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-gray-900 text-sm">Two-Step Verification</div>
                      <div className="text-green-600 text-xs">Enabled</div>
                    </div>
                  </div>
                  <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                </div>

                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="text-gray-500 text-xs mb-1">Last Login</div>
                  <div className="text-gray-900 text-sm mb-1">{data.lastLogin}</div>
                  <div className="text-gray-500 text-xs">{data.device}</div>
                </div>
              </div>
            </div>

            {/* Admin Permissions Card (Admin Only) */}
            {userRole === 'admin' && (
              <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm">
                <h2 className="text-gray-900 mb-6">Admin Permissions Overview</h2>
                
                <div className="space-y-2">
                  {[
                    { name: 'Add Purchase', status: 'Enabled' },
                    { name: 'Add Sale', status: 'Enabled' },
                    { name: 'Customers', status: 'Full Access' },
                    { name: 'Transactions', status: 'Full Access' },
                    { name: 'Reports', status: 'Full Access' },
                  ].map((permission, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-700 text-sm">{permission.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-xs">{permission.status}</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* 3. Account Settings Card */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm">
              <h2 className="text-gray-900 mb-6">Account Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Bell className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-gray-900 text-sm">Notifications</div>
                      <div className="text-gray-500 text-xs">Alerts and updates</div>
                    </div>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Globe className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-gray-900 text-sm">Language</div>
                      <div className="text-gray-500 text-xs">English (US)</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <Moon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-gray-900 text-sm">Dark Mode</div>
                      <div className="text-gray-500 text-xs">Coming soon</div>
                    </div>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} disabled />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Database className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-gray-900 text-sm">Backup & Export</div>
                      <div className="text-gray-500 text-xs">Download your data</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* 4. Activity Summary Card */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm">
              <h2 className="text-gray-900 mb-6">Activity Summary</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4">
                  <div className="text-blue-600 text-xs mb-2">Total Logins</div>
                  <div className="text-gray-900 text-2xl mb-1">{data.totalLogins}</div>
                  <div className="text-blue-600 text-xs">All time</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4">
                  <div className="text-green-600 text-xs mb-2">
                    {userRole === 'admin' ? 'Actions' : 'Pages Viewed'}
                  </div>
                  <div className="text-gray-900 text-2xl mb-1">
                    {userRole === 'admin' ? data.actionsPerformed : (data as any).pagesViewed}
                  </div>
                  <div className="text-green-600 text-xs">Last 30 days</div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-gray-900 text-sm">Last 7-Day Activity</div>
                    <div className="text-gray-500 text-xs">Above average</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 h-16">
                  {[40, 65, 55, 80, 75, 60, 85].map((height, index) => (
                    <div key={index} className="flex-1 flex items-end">
                      <div 
                        className="w-full bg-gradient-to-t from-purple-400 to-purple-500 rounded-t-lg"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="mt-4 text-sm text-blue-600 hover:underline">
                View Full Activity →
              </button>
            </div>

            {/* Role Switch Card (Admin only - can switch to User) */}
            {userRole === 'admin' && (
              <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm">
                <h2 className="text-gray-900 mb-4">Switch Role</h2>
                <p className="text-gray-500 text-sm mb-4">Switch to user view for testing</p>
                <Button
                  onClick={() => onRoleSwitch('user')}
                  variant="outline"
                  className="w-full h-12 rounded-xl"
                >
                  Switch to User View
                </Button>
              </div>
            )}

            {/* 5. Logout Card */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm">
              <h2 className="text-gray-900 mb-4">Sign Out</h2>
              <p className="text-gray-500 text-sm mb-4">
                You will need to log in again to access your account
              </p>
              <Button
                className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
