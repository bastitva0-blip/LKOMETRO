import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Top-level safety net. If anything below this throws during render (a bad
 * leaflet state, a malformed route, etc.) this shows a recoverable screen
 * instead of a blank white page.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Swap this for an error-reporting service later if you add one.
    console.error("LkoMetro crashed:", error, info.componentStack);
  }

  handleReload = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" strokeWidth={1.5} />
          <h1 className="font-display text-3xl font-semibold mb-2">Derailed</h1>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Something went wrong loading LkoMetro. This has been logged — reloading should get
            you back on track.
          </p>
          <button
            onClick={this.handleReload}
            className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Reload LkoMetro
          </button>
          {import.meta.env.DEV && this.state.error && (
            <pre className="mt-6 max-w-md overflow-auto rounded-lg border border-border bg-card p-3 text-left text-xs text-muted-foreground">
              {this.state.error.message}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
