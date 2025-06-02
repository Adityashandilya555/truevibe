import React, { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * ErrorBoundary Component
 * 
 * A class component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the whole app.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error', error, errorInfo);
    this.setState({ errorInfo });
    
    // Here you could also log to an error reporting service like Sentry
    // if (typeof window.Sentry !== 'undefined') {
    //   window.Sentry.captureException(error);
    // }
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when an error occurs
      return (
        <div className="min-h-[300px] flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-200 dark:border-red-900">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We're having trouble displaying this content. Please try refreshing the page.
            </p>
            {this.state.error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-gray-700 rounded-lg text-left overflow-auto max-h-[200px]">
                <p className="text-sm font-medium text-red-800 dark:text-red-400 mb-2">Error details:</p>
                <p className="text-xs text-red-700 dark:text-red-300 font-mono">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-xs text-red-700 dark:text-red-300 cursor-pointer">Stack trace</summary>
                    <pre className="mt-2 text-xs text-red-700 dark:text-red-300 overflow-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
