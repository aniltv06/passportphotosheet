# Uptime Monitoring & Error Logging Guide

## Overview

This application includes comprehensive error logging and uptime monitoring infrastructure designed with privacy-first principles. All error tracking is done client-side with no personal data collection.

---

## Error Logging

### Architecture

The application implements a two-tier error handling system:

1. **React Error Boundary** (`src/components/ErrorBoundary.tsx`)
   - Catches errors in React component tree
   - Displays user-friendly fallback UI
   - Logs errors to localStorage

2. **Global Error Handler** (`src/utils/errorHandler.ts`)
   - Catches uncaught JavaScript errors
   - Captures unhandled promise rejections
   - Maintains error queue in memory and localStorage

### Privacy Guarantee

Error reports contain **ZERO** personal data:
- ✅ Error messages and stack traces
- ✅ Timestamps and URLs
- ✅ Browser user agent
- ❌ NO user photos
- ❌ NO form data
- ❌ NO personal information
- ❌ NO cookies or tracking

### Accessing Error Logs

#### In Browser Console

```javascript
// Get all errors from current session
window.errorHandler.getErrorLogs()

// Get errors from localStorage (persists across sessions)
JSON.parse(localStorage.getItem('error-logs'))

// Clear error logs
window.errorHandler.clearErrorLogs()
```

#### Example Error Report

```json
{
  "type": "error",
  "message": "Cannot read property 'x' of undefined",
  "stack": "TypeError: Cannot read property...",
  "timestamp": "2024-02-15T18:30:00.000Z",
  "userAgent": "Mozilla/5.0...",
  "url": "https://passportphotomaker.com/",
  "lineNumber": 123,
  "columnNumber": 45
}
```

### Configuring External Error Reporting (Optional)

The error handler includes commented-out code for external services:

#### Option 1: Custom Endpoint

Edit `src/utils/errorHandler.ts` line 100:

```typescript
fetch('https://your-api.com/api/log-error', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(errorReport),
}).catch(() => {
  // Silently fail if error reporting fails
});
```

#### Option 2: Sentry Integration

1. Install Sentry:
```bash
npm install @sentry/react
```

2. Initialize in `src/main.tsx`:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
  beforeSend(event) {
    // Filter out sensitive data
    return event;
  },
});
```

3. Uncomment Sentry code in `src/utils/errorHandler.ts` line 113.

---

## Uptime Monitoring

### Status Page

The application includes a public status page at `/status.html` that displays:

- System health indicator
- Service status (Web App, Photo Processing, HEIC Conversion, QR Code)
- Response time metrics
- Last check timestamp

**Live URL**: `https://passportphotomaker.com/status.html`

### Health Check Endpoint

The status page exposes a JavaScript health check object:

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

This can be accessed by external monitoring services.

---

## Setting Up External Uptime Monitoring

### Recommended Services

#### 1. UptimeRobot (Free Tier Available)

**Website**: https://uptimerobot.com

**Setup Steps**:
1. Create free account
2. Click "Add New Monitor"
3. Configure:
   - Monitor Type: `HTTP(s)`
   - Friendly Name: `Passport Photo Maker`
   - URL: `https://passportphotomaker.com/status.html`
   - Monitoring Interval: `5 minutes` (free tier)
4. Set up alert contacts (email, SMS, Slack, etc.)
5. Save monitor

**Pros**: Free tier, easy setup, mobile app
**Cons**: 5-minute intervals on free tier

#### 2. Pingdom (Paid, $10/month)

**Website**: https://www.pingdom.com

**Setup Steps**:
1. Create account
2. Add "Uptime Check"
3. Configure:
   - URL: `https://passportphotomaker.com/status.html`
   - Check interval: `1 minute`
   - Alert contacts: Email, SMS
4. Enable status page (optional)

**Pros**: 1-minute checks, detailed analytics, global locations
**Cons**: Paid service

#### 3. StatusCake (Free Tier Available)

**Website**: https://www.statuscake.com

**Setup Steps**:
1. Sign up for free account
2. Click "Add Test"
3. Configure:
   - Test Type: `Uptime`
   - Website URL: `https://passportphotomaker.com/status.html`
   - Check Rate: `5 minutes`
   - Contact Groups: Add your email/SMS
4. Save test

**Pros**: Free tier with page speed monitoring
**Cons**: Limited locations on free tier

#### 4. Better Uptime (Modern Alternative)

**Website**: https://betteruptime.com

**Setup Steps**:
1. Create account (free tier: 3 monitors)
2. Add "Monitor"
3. Configure:
   - URL: `https://passportphotomaker.com/status.html`
   - Check frequency: `30 seconds` (paid) or `3 minutes` (free)
   - Incident notifications: Slack, Email, SMS
4. Optional: Create public status page

**Pros**: Modern UI, generous free tier, incident management
**Cons**: Limited monitors on free tier

---

## GitHub Pages Specific Setup

Since this app is deployed on GitHub Pages, also monitor:

### GitHub Status

Monitor GitHub Pages service status:
- **URL**: https://www.githubstatus.com
- Subscribe to GitHub Pages incidents

### Custom Domain Monitoring

If using a custom domain, monitor DNS:

```bash
# Check DNS resolution
dig passportphotomaker.com

# Check HTTPS certificate
openssl s_client -connect passportphotomaker.com:443 -servername passportphotomaker.com
```

Add DNS monitoring in your uptime service:
- Monitor Type: `DNS`
- Domain: `passportphotomaker.com`
- Expected IP: Your GitHub Pages IP

---

## Alert Configuration

### Recommended Alert Strategy

1. **Immediate Alerts** (< 1 minute downtime):
   - Send to: Slack/SMS
   - For: Production outages

2. **Escalation Alerts** (> 5 minutes downtime):
   - Send to: Email + SMS
   - For: Prolonged outages

3. **Recovery Notifications**:
   - Send when service restored
   - Include downtime duration

### Alert Channels

#### Email
- Always reliable
- No additional cost
- Delayed (1-2 minute delivery)

#### SMS
- Instant delivery
- Best for critical alerts
- May incur costs

#### Slack
- Great for team notifications
- Instant delivery
- Create dedicated `#uptime-alerts` channel

#### Webhook
- Integrate with custom systems
- Example: Trigger PagerDuty, Opsgenie

---

## Monitoring Metrics

### Key Metrics to Track

1. **Uptime Percentage**
   - Target: 99.9% (8.76 hours/year downtime)
   - Acceptable: 99.5% (43.8 hours/year)

2. **Response Time**
   - Target: < 1 second
   - Warning: > 2 seconds
   - Critical: > 5 seconds

3. **Error Rate**
   - Check browser console for JavaScript errors
   - Monitor localStorage error logs

4. **SSL Certificate**
   - Auto-renews via GitHub Pages
   - Monitor expiration (90 days for Let's Encrypt)

---

## Troubleshooting

### Common Issues

#### Status Page Returns 404
**Cause**: Build didn't copy status.html to build folder
**Fix**:
```bash
npm run build
# Verify: ls build/status.html
```

#### Uptime Monitor Shows "Down" but Site Works
**Cause**: Monitor checking wrong URL or expecting specific content
**Fix**: Update monitor URL to `/status.html` or check response validation rules

#### No Error Logs in localStorage
**Cause**: No errors occurred, or localStorage disabled
**Fix**:
```javascript
// Test error logging
window.errorHandler.reportManualError('Test error', new Error('Test'));
// Check: localStorage.getItem('error-logs')
```

#### Error Boundary Not Catching Errors
**Cause**: Error occurred outside React tree (e.g., event handlers)
**Solution**: These are caught by global error handler instead
```javascript
// View global errors
window.errorHandler.getErrorLogs()
```

---

## Maintenance

### Regular Tasks

#### Weekly
- [ ] Check uptime monitoring dashboard
- [ ] Review error logs: `window.errorHandler.getErrorLogs()`
- [ ] Verify status page loads: Visit `/status.html`

#### Monthly
- [ ] Review alert contact list
- [ ] Test alert delivery (trigger test alert)
- [ ] Check SSL certificate expiration

#### Quarterly
- [ ] Review uptime SLA (target: 99.9%)
- [ ] Analyze error patterns
- [ ] Update monitoring thresholds if needed

---

## Cost Analysis

### Free Options
- **UptimeRobot**: Free tier (5-min checks, 50 monitors)
- **StatusCake**: Free tier (5-min checks, unlimited tests)
- **Better Uptime**: Free tier (3 monitors, 3-min checks)

### Paid Options
- **Pingdom**: $10/month (1-min checks, advanced analytics)
- **Datadog**: $15/month (infrastructure monitoring)
- **New Relic**: Free tier available, paid tiers from $25/month

### Recommendation for This Project

**Start with**: UptimeRobot (free tier)
- 5-minute checks sufficient for static site
- Email alerts to personal email
- Upgrade to paid ($7/month) if need 1-minute checks

---

## Security Considerations

1. **Don't expose sensitive data** in error logs
   - Already implemented: No PII in error reports

2. **Rate limit status checks** (if implementing custom endpoint)
   - Not needed for static `/status.html` page

3. **Validate monitoring webhooks**
   - Use webhook secrets if configuring custom integrations

4. **Protect error viewing**
   - Error logs only accessible via browser console (requires device access)
   - Consider adding admin dashboard with authentication if needed

---

## Next Steps

1. Choose an uptime monitoring service (recommend UptimeRobot free tier)
2. Set up monitoring for `https://passportphotomaker.com/status.html`
3. Configure alert contacts (email)
4. Test alerts by stopping GitHub Pages temporarily
5. Document your monitoring setup in team wiki/docs

---

## Support

For questions or issues:
- **Email**: support@passportphotomaker.com
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/passportphotosheet/issues)

---

## Changelog

### 2024-02-15
- ✅ Implemented React Error Boundary
- ✅ Added global error handler
- ✅ Created status page (`/status.html`)
- ✅ Added localStorage error logging
- ✅ Documented uptime monitoring setup
