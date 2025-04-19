import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Something went wrong</h2>
          <div className="bg-white p-4 rounded-lg mb-4">
            <p className="text-red-600 font-semibold">{this.state.error?.toString()}</p>
          </div>
          {this.state.errorInfo && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-red-600 mb-2">Component Stack</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-60 text-xs">
                {this.state.errorInfo.componentStack}
              </pre>
            </div>
          )}
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
