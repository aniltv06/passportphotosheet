/**
 * Global Error Handler
 * Catches unhandled errors and promise rejections
 * Privacy-friendly: No user data or photos collected
 */

interface ErrorReport {
  type: 'error' | 'unhandledRejection';
  message: string;
  stack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  lineNumber?: number;
  columnNumber?: number;
}

class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private errorQueue: ErrorReport[] = [];
  private readonly MAX_ERRORS = 50; // Keep last 50 errors in memory

  private constructor() {
    this.initialize();
  }

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  private initialize() {
    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'error',
        message: event.message,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        lineNumber: event.lineno,
        columnNumber: event.colno,
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'unhandledRejection',
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    });

    // Log initialization
    console.log('🛡️ Global Error Handler initialized');
  }

  private handleError(errorReport: ErrorReport) {
    // Add to error queue
    this.errorQueue.push(errorReport);

    // Keep only last MAX_ERRORS
    if (this.errorQueue.length > this.MAX_ERRORS) {
      this.errorQueue.shift();
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.group(`🔴 ${errorReport.type} at ${errorReport.timestamp}`);
      console.error('Message:', errorReport.message);
      if (errorReport.stack) {
        console.error('Stack:', errorReport.stack);
      }
      console.error('Location:', errorReport.url);
      if (errorReport.lineNumber && errorReport.columnNumber) {
        console.error(`Line:Col - ${errorReport.lineNumber}:${errorReport.columnNumber}`);
      }
      console.groupEnd();
    } else {
      // In production, log simplified version
      console.error(`[${errorReport.type}]`, errorReport.message);
    }

    // Send to error reporting service (optional)
    this.reportError(errorReport);
  }

  private reportError(errorReport: ErrorReport) {
    // PRIVACY NOTE: No user data, photos, or personal information included

    // Option 1: Send to your own error logging endpoint
    // Uncomment and configure if you have a backend
    /*
    fetch('https://your-api.com/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorReport),
    }).catch(() => {
      // Silently fail if error reporting fails
    });
    */

    // Option 2: Use Sentry (optional)
    // Uncomment and add Sentry SDK if needed
    /*
    if (window.Sentry) {
      window.Sentry.captureMessage(errorReport.message, {
        level: 'error',
        extra: {
          type: errorReport.type,
          stack: errorReport.stack,
          url: errorReport.url,
        },
      });
    }
    */

    // Option 3: Local storage fallback (for debugging)
    // Store last 10 errors in localStorage for troubleshooting
    try {
      const storedErrors = JSON.parse(localStorage.getItem('error-logs') || '[]');
      storedErrors.push(errorReport);

      // Keep only last 10
      if (storedErrors.length > 10) {
        storedErrors.shift();
      }

      localStorage.setItem('error-logs', JSON.stringify(storedErrors));
    } catch {
      // Ignore localStorage errors
    }
  }

  // Public method to get error logs
  public getErrorLogs(): ErrorReport[] {
    return [...this.errorQueue];
  }

  // Public method to clear error logs
  public clearErrorLogs(): void {
    this.errorQueue = [];
    try {
      localStorage.removeItem('error-logs');
    } catch {
      // Ignore
    }
  }

  // Public method to manually report an error
  public reportManualError(message: string, error?: Error): void {
    this.handleError({
      type: 'error',
      message,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });
  }
}

// Initialize global error handler
export const globalErrorHandler = GlobalErrorHandler.getInstance();

// Export for console access (debugging)
if (typeof window !== 'undefined') {
  (window as any).errorHandler = globalErrorHandler;
}

export default GlobalErrorHandler;
