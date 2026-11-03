import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application rendering failed:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <main
          dir="auto"
          className="flex min-h-screen items-center justify-center bg-[#f6f4ee] px-5 py-12 text-center text-[#1c2420] dark:bg-[#121915] dark:text-[#eef3f0]"
          role="alert"
        >
          <div className="max-w-md rounded-2xl bg-white p-7 shadow-lg dark:bg-[#1a241e]">
            <h1 className="mb-3 text-xl font-extrabold">ہنر بازار لوڈ نہیں ہو سکا</h1>
            <p className="mb-2 text-sm">The app hit an unexpected error. Reload the page to try again.</p>
            <p className="mb-5 break-words text-xs text-slate-500 dark:text-slate-400">{this.state.error.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-[#0f5132] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0b4027]"
            >
              Reload app
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
