import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-red-500/10">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
              <p className="text-slate-500">
                An unexpected error occurred. We've been notified and are looking into it.
              </p>
              {this.state.error && (
                <div className="mt-4 p-4 bg-slate-100 rounded-xl text-left overflow-auto max-h-32">
                  <code className="text-xs text-slate-600">{this.state.error.toString()}</code>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={this.handleReset}
                className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl gap-2 h-11 px-6 shadow-lg shadow-brand-blue/20"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Application
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = "/"}
                className="rounded-xl border-slate-200 h-11 px-6 gap-2"
              >
                <Home className="w-4 h-4" />
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
