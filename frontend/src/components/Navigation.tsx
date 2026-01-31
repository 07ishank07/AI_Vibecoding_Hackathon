'use client';

import { useState } from 'react';
import { Menu, X, Home, User, Stethoscope, Info, LogIn, Settings } from 'lucide-react';

export default function Navigation({ 
  context = 'public', // 'public', 'user', 'emergency', 'medical'
  userType = 'public', // 'public', 'user', 'medical'
  currentPage = ''
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Don't show navigation on emergency pages
  if (context === 'emergency') {
    return (
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center">
          <a href="/" className="flex items-center text-gray-600 hover:text-gray-800">
            <Home size={16} className="mr-1" />
            <span className="text-sm">Home</span>
          </a>
        </div>
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
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-gray-900">
              CrisisLink<span className="text-red-600">.cv</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
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
                >
                  <Icon size={16} className="mr-2" />
                  {item.label}
                </a>
              );
            })}
            
            {/* User Context Indicator */}
            {userType === 'medical' && (
              <div className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                <Stethoscope size={12} className="mr-1" />
                Medical Professional
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
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
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon size={16} className="mr-3" />
                    {item.label}
                  </a>
                );
              })}
              
              {/* Mobile User Context Indicator */}
              {userType === 'medical' && (
                <div className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-md text-sm">
                  <Stethoscope size={16} className="mr-3" />
                  Medical Professional Mode
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}