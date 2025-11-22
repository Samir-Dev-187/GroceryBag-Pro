import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, DollarSign, Users, FileText, BarChart3, Store, User, Plus, Wallet, Settings, LogOut, RefreshCw, UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';

interface LayoutProps {
  children: ReactNode;
  userRole: 'admin' | 'user';
  onRoleSwitch: (role: 'admin' | 'user') => void;
  onLogout: () => void;
}

export default function Layout({ children, userRole, onRoleSwitch, onLogout }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Mobile bottom nav items
  const mobileNavItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    ...(userRole === 'admin' ? [
      { icon: Plus, label: 'Purchase', path: '/add-purchase' },
      { icon: ShoppingCart, label: 'Sale', path: '/add-sale' },
      { icon: UserPlus, label: 'Add Accounts', path: '/create-accounts' },
    ] : [
      { icon: Users, label: 'Customers', path: '/customer-ledger' },
      { icon: BarChart3, label: 'Reports', path: '/reports' },
    ]),
    { icon: User, label: 'Profile', path: '/profile' },
  ].slice(0, 5); // Ensure exactly 5 items

  // Desktop sidebar items
  const desktopMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    ...(userRole === 'admin' ? [
      { icon: ShoppingCart, label: 'Add Purchase', path: '/add-purchase' },
      { icon: DollarSign, label: 'Add Sale', path: '/add-sale' },
      { icon: Plus, label: 'Create Accounts', path: '/create-accounts' },
    ] : []),
    { icon: Users, label: 'Customers', path: '/customer-ledger' },
    ...(userRole === 'admin' ? [{ icon: FileText, label: 'Transactions', path: '/transactions' }] : []),
    { icon: BarChart3, label: 'Reports', path: '/reports' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Top Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Store className="w-6 h-6 text-[#0F9D58]" />
            <span className="text-gray-900">GroceryBag Pro</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs px-2 py-1 rounded-full bg-[#0F9D58] text-white">
              {userRole === 'admin' ? 'Admin' : 'User'}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <User className="w-5 h-5 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                {userRole === 'admin' && (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/transactions')}>
                      <Wallet className="w-4 h-4 mr-2" />
                      Transactions
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onRoleSwitch('user')}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Switch to User View
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0F9D58] rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-gray-900">GroceryBag Pro</div>
                <div className="text-gray-500 text-sm">
                  {userRole === 'admin' ? 'Admin Panel' : 'User Panel'}
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            {desktopMenuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                  isActive(item.path)
                    ? 'bg-[#0F9D58] text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-xl transition-colors">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-gray-900 text-sm">{userRole === 'admin' ? 'Admin' : 'User'}</div>
                    <div className="text-gray-500 text-xs">
                      {userRole === 'admin' ? 'admin@grocerybag.com' : 'user@grocerybag.com'}
                    </div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                {userRole === 'admin' && (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/transactions')}>
                      <Wallet className="w-4 h-4 mr-2" />
                      Transactions
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onRoleSwitch('user')}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Switch to User View
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile Content */}
      <main className="lg:hidden pb-20">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                isActive(item.path)
                  ? 'text-[#0F9D58] bg-green-50'
                  : 'text-gray-600'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}