import React from 'react';

export const Header: React.FC = () => {
  const appName = import.meta.env.VITE_APP_NAME || 'SmartBudget';
  const appEnv = import.meta.env.VITE_APP_ENV;
  const appDescription =
    import.meta.env.VITE_APP_DESCRIPTION || 'Personal Finance Manager';

  return (
    <header className="bg-blue-600 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {appName}
          {appEnv === 'development' && (
            <span className="text-xs ml-2 font-normal">(Dev)</span>
          )}
        </h1>
        <p className="text-sm text-blue-100">{appDescription}</p>
      </div>
    </header>
  );
};

export default Header;
