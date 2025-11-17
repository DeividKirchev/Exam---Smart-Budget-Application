import React from 'react';

export const Header: React.FC = () => {
  const appName = import.meta.env.VITE_APP_NAME || 'SmartBudget';
  const appEnv = import.meta.env.VITE_APP_ENV;
  const appDescription =
    import.meta.env.VITE_APP_DESCRIPTION || 'Personal Finance Manager';

  return (
    <header className="bg-blue-600 text-white py-4 px-4 md:px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between gap-2 md:gap-4">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold whitespace-nowrap flex-shrink-0">
          {appName}
          {appEnv === 'development' && (
            <span className="text-xs ml-1 md:ml-2 font-normal">(Dev)</span>
          )}
        </h1>
        <p className="hidden md:block text-sm text-blue-100">
          {appDescription}
        </p>
      </div>
    </header>
  );
};

export default Header;
