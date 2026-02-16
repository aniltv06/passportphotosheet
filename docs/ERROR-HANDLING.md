# Error Handling & Monitoring System

## Overview

This document provides a quick reference for the error handling and monitoring infrastructure implemented in Passport Photo Maker.

---

## Architecture

### 1. React Error Boundary

**File**: `src/components/ErrorBoundary.tsx`

**Purpose**: Catches errors in React component tree

**Features**:
- Catches render errors, lifecycle errors
- Displays user-friendly fallback UI
- Logs errors to localStorage
- Shows detailed error info in development mode
- Provides "Reload Application" button

**Usage**:
```tsx
// Automatically wraps entire app in main.tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**Error Display**:
```
😵 Oops! Something went wrong

We're sorry, but something unexpected happened.
Don't worry – your photos are safe on your device
and haven't been uploaded anywhere.

[Reload Application]
```

---

### 2. Global Error Handler

**File**: `src/utils/errorHandler.ts`

**Purpose**: Catches uncaught errors and promise rejections globally

**Features**:
- Listens to `window.error` events
- Listens to `unhandledrejection` events
- Maintains error queue (last 50 errors in memory)
- Stores last 10 errors in localStorage
- Privacy-friendly (no PII collected)
- Extensible for external services

**Initialization**:
```tsx
// Automatically initialized in main.tsx
import "./utils/errorHandler";
```

**API**:
```javascript
// Access in browser console
window.errorHandler.getErrorLogs()        // Get all errors
window.errorHandler.clearErrorLogs()      // Clear all logs
window.errorHandler.reportManualError()   // Report custom error
```

---

### 3. Status Page

**File**: `public/status.html`

**Purpose**: Public health check endpoint for monitoring services

**URL**: `https://passportphotomaker.com/status.html`

**Features**:
- System health indicator
- Service status list
- Response time metric
- Animated status indicators
- Health check object for monitoring

**Health Check Object**:
```javascript
window.healthCheck = {
  status: 'ok',
  timestamp: '2024-02-15T18:30:00.000Z',
  services: {
    app: 'operational',
    processing: 'operational',
    heic: 'operational',
    qrcode: 'operational'
  }
}
```

---

## Error Report Format

```typescript
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
```

---

## Privacy Guarantee

### What's Logged ✅
- Error messages
- Stack traces
- Timestamps
- URLs
- Browser user agent
- Line/column numbers

### What's NOT Logged ❌
- User photos
- Form input data
- Personal information
- Cookies
- Tracking data
- localStorage content (except error logs)

---

## Accessing Errors

### During Development

Errors automatically log to console:
```
🔴 error at 2024-02-15T18:30:00.000Z
Message: Cannot read property 'x' of undefined
Stack: TypeError: Cannot read property...
Location: https://passportphotomaker.com/
Line:Col - 123:45
```

### In Production

Access via browser console:
```javascript
// Get current session errors
window.errorHandler.getErrorLogs()

// Get persisted errors
JSON.parse(localStorage.getItem('error-logs'))

// Clear all errors
window.errorHandler.clearErrorLogs()
localStorage.removeItem('error-logs')
```

---

## Testing Error Handling

### Test Error Boundary

```javascript
// In browser console
throw new Error('Test error boundary')
```

Result: Should show error boundary UI with reload button

### Test Global Error Handler

```javascript
// In browser console
window.errorHandler.reportManualError('Test error', new Error('Manual test'))

// Check logs
window.errorHandler.getErrorLogs()
```

### Test Unhandled Promise Rejection

```javascript
// In browser console
Promise.reject('Test unhandled rejection')

// Check logs after 1 second
setTimeout(() => console.log(window.errorHandler.getErrorLogs()), 1000)
```

---

## Integration with External Services

### Sentry (Optional)

1. Install Sentry SDK:
```bash
npm install @sentry/react
```

2. Initialize in `src/main.tsx`:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

3. Uncomment Sentry code in:
   - `src/utils/errorHandler.ts` (line 113)
   - `src/components/ErrorBoundary.tsx` (line 73)

### Custom Error Endpoint (Optional)

Uncomment and configure in `src/utils/errorHandler.ts` (line 100):
```typescript
fetch('https://your-api.com/api/log-error', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(errorReport),
});
```

---

## Monitoring Setup

See [UPTIME-MONITORING.md](./UPTIME-MONITORING.md) for detailed monitoring setup guide.

**Quick Setup**:
1. Sign up for UptimeRobot (free): https://uptimerobot.com
2. Add monitor: `https://passportphotomaker.com/status.html`
3. Set check interval: 5 minutes
4. Add email alert contact
5. Done!

---

## Troubleshooting

### No errors logged
- Check if errors are actually occurring
- Test with: `throw new Error('test')`
- Verify localStorage is enabled

### Error boundary not showing
- Error must occur in React component tree
- Event handlers caught by global handler instead
- Check browser console for errors

### Status page returns 404
- Run: `npm run build`
- Verify: `ls build/status.html`
- Redeploy to GitHub Pages

---

## Files Reference

| File | Purpose |
|------|---------|
| `src/components/ErrorBoundary.tsx` | React error boundary component |
| `src/utils/errorHandler.ts` | Global error handler utility |
| `src/main.tsx` | Error handling initialization |
| `public/status.html` | Status page for monitoring |
| `docs/UPTIME-MONITORING.md` | Uptime monitoring guide |
| `docs/ERROR-HANDLING.md` | This file |

---

## Best Practices

1. **Test error handling regularly**
   - Use manual error triggers
   - Check localStorage logs

2. **Monitor uptime actively**
   - Use external service (UptimeRobot)
   - Set up email alerts

3. **Review error logs weekly**
   - Check browser console
   - Look for patterns

4. **Keep privacy first**
   - Never log user photos
   - Never log personal data
   - Only log technical errors

5. **Update error handling**
   - Add new error types as needed
   - Improve error messages
   - Enhance user experience

---

## Future Enhancements

Potential improvements:

- [ ] Add error analytics dashboard
- [ ] Implement error categorization
- [ ] Add error search/filter
- [ ] Create error export functionality
- [ ] Add error rate alerts
- [ ] Integrate with team notifications

---

## Support

For questions or issues:
- **Email**: support@passportphotomaker.com
- **GitHub**: [Create an issue](https://github.com/yourusername/passportphotosheet/issues)

---

## Summary

This error handling system provides:

✅ **Comprehensive error catching** (React + Global)
✅ **Privacy-friendly logging** (No PII)
✅ **User-friendly error UI** (Error boundary)
✅ **Production monitoring** (Status page)
✅ **Developer debugging** (Console access)
✅ **Extensible architecture** (Sentry, custom endpoints)

All errors are caught, logged, and displayed gracefully while maintaining 100% user privacy.
