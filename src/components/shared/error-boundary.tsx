"use client";

import * as React from "react";
import { ErrorState } from "@/components/shared/error-state";

interface Props {
  children: React.ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production this would report to an error tracking service (e.g. Sentry).
    console.error("CommerceOS UI error boundary caught:", error, info);
  }

  reset = () => this.setState({ hasError: false });

  override render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <ErrorState
            title={this.props.fallbackTitle ?? "This section failed to render"}
            description="An unexpected error occurred while rendering this part of the page."
            onRetry={this.reset}
          />
        </div>
      );
    }
    return this.props.children;
  }
}
