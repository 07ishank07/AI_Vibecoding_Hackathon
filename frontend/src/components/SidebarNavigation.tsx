'use client';

import { useState } from 'react';
import { Menu, X, Home, User, Stethoscope, Info, LogIn, Settings, ChevronLeft } from 'lucide-react';

export default function SidebarNavigation({ 
  context = 'public',
  userType = 'public',
  currentPage = ''
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Don't show navigation on emergency pages
  if (context === 'emergency') {
    return (
      <div className="fixed top-4 left-4 z-50">
        <a href="/" className="flex items-center bg-white shadow-md rounded-lg px-3 py-2 text-gray-600 hover:text-gray-800">
          <Home size={16} className="mr-2" />
          <span className="text-sm">Home</span>
        </a>
      </div>
    );
  }

  const getNavigationItems = () => {
    const baseItems = [
      { href: '/', label: 'Home', icon: Home },
      { href: '/about', label: 'About', icon: Info },
    ];

    if (userType === 'public') {
      return [
        ...baseItems,
        { href: '/create-profile', label: 'Create Profile', icon: User },
        { href: '/login', label: 'Sign In', icon: LogIn },
      ];
    }

    if (userType === 'user') {
      return [
        ...baseItems,
        { href: '/dashboard', label: 'Dashboard', icon: Settings },
        { href: '/profile/demo', label: 'My Profile', icon: User },
      ];
    }

    if (userType === 'medical') {
      return [
        ...baseItems,
        { href: '/dashboard', label: 'Dashboard', icon: Settings },
        { href: '/medical-dashboard', label: 'Medical Dashboard', icon: Stethoscope },
        { href: '/profile/demo', label: 'My Profile', icon: User },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <div className={`fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-200 transition-all duration-300 z-40 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <a href="/" className="text-lg font-bold text-gray-900">
            CrisisLink<span className="text-red-600">.cv</span>
          </a>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <Icon size={20} className={isCollapsed ? '' : 'mr-3'} />
                {!isCollapsed && <span>{item.label}</span>}
              </a>
            );
          })}
        </div>

        {/* User Context Indicator */}
        {userType === 'medical' && !isCollapsed && (
          <div className="mt-6 p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
            <div className="flex items-center">
              <Stethoscope size={16} className="mr-2" />
              <span className="font-medium">Medical Professional</span>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}