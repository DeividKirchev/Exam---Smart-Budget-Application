import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">SmartBudget</h1>
        <p className="text-sm text-blue-100">Personal Finance Manager</p>
      </div>
    </header>
  );
};

export default Header;
