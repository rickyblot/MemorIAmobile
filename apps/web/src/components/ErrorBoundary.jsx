import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function isTransientDomError(error) {
  const message = error?.message || '';
  return (
    message.includes('removeChild') ||
    message.includes('insertBefore') ||
    message.includes('NotFoundError')
  );
}

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0 };
    this.retryTimer = null;
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Helmet / toast / route-change DOM races often throw twice in a row.
    if (isTransientDomError(error) && this.state.retryCount < 3) {
      clearTimeout(this.retryTimer);
      this.retryTimer = setTimeout(() => {
        this.setState((prev) => ({
          hasError: false,
          error: null,
          retryCount: prev.retryCount + 1,
        }));
      }, 50);
    }
  }

  componentDidUpdate(_prevProps, prevState) {
    // After a successful recovery render, clear the retry budget.
    if (prevState.hasError && !this.state.hasError && this.state.retryCount > 0) {
      clearTimeout(this.retryTimer);
      this.retryTimer = setTimeout(() => {
        this.setState({ retryCount: 0 });
      }, 1000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.retryTimer);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (isTransientDomError(this.state.error) && this.state.retryCount < 3) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="p-8 bg-destructive/5 border border-destructive/20 rounded-2xl flex flex-col items-center justify-center text-center max-w-2xl w-full">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground font-sans mb-3">Something went wrong</h2>
          <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
            {this.state.error?.message || 'An unexpected error occurred while rendering this component. Please try again.'}
          </p>
          <Button
            onClick={() => this.setState({ hasError: false, error: null, retryCount: 0 })}
            variant="outline"
            className="font-semibold"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }
}
