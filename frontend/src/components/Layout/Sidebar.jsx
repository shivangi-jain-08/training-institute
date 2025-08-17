import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, UserPlus, X, BarChart3, Settings } from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/members", label: "All Members", icon: Users },
    { path: "/members/add", label: "Add Member", icon: UserPlus },
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname == path) return true;
    return false;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
    fixed top-0 left-0 z-50 w-64 min-h-screen flex flex-col bg-white/95 dark:bg-secondary-900/95 backdrop-blur-md shadow-large dark:shadow-large-dark transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 lg:bg-white dark:lg:bg-secondary-900 lg:w-64 lg:flex-shrink-0
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
  `}
      >
        {/* Mobile Header */}
        <div className="p-6 border-b border-secondary-100 dark:border-secondary-800 lg:hidden">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Menu
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-secondary-400 dark:text-secondary-500 hover:text-secondary-600 dark:hover:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-xl transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 lg:mt-8 px-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <li
                  key={item.path}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`
                      group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden
                      ${
                        active
                          ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-medium dark:shadow-medium-dark"
                          : "text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 hover:bg-secondary-50 dark:hover:bg-secondary-800"
                      }
                    `}
                  >
                    {active && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-500 opacity-20 animate-pulse-slow"></div>
                    )}
                    <Icon
                      className={`h-5 w-5 relative z-10 transition-transform duration-200 ${
                        active ? "scale-110" : "group-hover:scale-105"
                      }`}
                    />
                    <span className="font-medium relative z-10">
                      {item.label}
                    </span>
                    {active && (
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"></div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        {/* <div className="absolute bottom-6 left-4 right-4">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl p-4 border border-primary-200 dark:border-primary-800">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-900 dark:text-primary-100">Need Help?</p>
                <p className="text-xs text-primary-600 dark:text-primary-400">Contact support</p>
              </div>
            </div>
          </div>
        </div> */}
      </aside>
    </>
  );
};

export default Sidebar;
