import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { Menu, LogOut, User, Bell, Sun, Moon } from 'lucide-react'

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="bg-white/80 dark:bg-secondary-900/80 backdrop-blur-md shadow-soft dark:shadow-soft-dark border-b border-secondary-100 dark:border-secondary-800 sticky top-0 z-40 transition-colors duration-300">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-xl transition-all duration-200"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Institute Manager
            </h1>
            <p className="text-sm text-secondary-500 dark:text-secondary-400">Member Management System</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          
          
          {/* User Info */}
          <div className="hidden md:flex items-center space-x-3 px-3 py-2 bg-secondary-50 dark:bg-secondary-800 rounded-xl">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-soft">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-secondary-700 dark:text-secondary-200">{user?.name}</span>
            </div>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center space-x-2 text-secondary-600 dark:text-secondary-400 hover:text-danger-600 dark:hover:text-danger-400 px-3 py-2 rounded-xl hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-all duration-200 group"
          >
            <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
            <span className="hidden sm:inline font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
