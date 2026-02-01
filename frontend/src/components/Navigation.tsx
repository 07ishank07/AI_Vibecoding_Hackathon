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
    <nav className="bg-gradient-to-r from-blue-600 to-green-600 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-white">
              CrisisLink<span className="text-blue-100">Link</span><span className="text-green-100">.cv</span>
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
                      ? 'bg-white/20 text-white'
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={16} className="mr-2" />
                  {item.label}
                </a>
              );
            })}
            
            {/* User Context Indicator */}
            {userType === 'medical' && (
              <div className="flex items-center px-3 py-1 bg-white/20 text-white rounded-full text-xs font-medium">
                <Stethoscope size={12} className="mr-1" />
                Medical Professional
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-blue-100 hover:text-white hover:bg-white/10"
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
                        ? 'bg-white/20 text-white'
                        : 'text-blue-100 hover:text-white hover:bg-white/10'
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
                <div className="flex items-center px-3 py-2 bg-white/20 text-white rounded-md text-sm">
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