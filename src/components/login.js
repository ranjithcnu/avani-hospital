import React from 'react';
import YourLogo from '../styles/logo.jpg'; // Make sure to import your logo

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-between">
          {/* Logo container */}
          <div className="w-1/2 bg-white p-8 rounded-l-lg shadow-lg">
            <img src={YourLogo} alt="Your Logo" className="h-12 w-auto" />
          </div>

          {/* Form container */}
          <div className="w-1/2 bg-white p-8 rounded-r-lg shadow-lg">
            <form className="space-y-6" action="#" method="POST">
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
