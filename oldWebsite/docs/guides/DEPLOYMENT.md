# GitHub Pages Deployment Guide

This guide explains how to configure and deploy the Passport Photo Sheet Maker to GitHub Pages using Vite.

## 🎯 Prerequisites

Before deploying, ensure you have:
- ✅ Node.js 18+ installed
- ✅ Git repository set up
- ✅ GitHub repository created
- ✅ Push access to the repository

## 🔧 GitHub Repository Settings

### Step 1: Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under **Build and deployment**:
   - **Source**: Select "GitHub Actions"
   - This allows the automated workflow to deploy

### Step 2: Configure Repository Permissions

GitHub Actions needs permissions to deploy:

1. Go to **Settings** → **Actions** → **General**
2. Scroll to **Workflow permissions**
3. Select "Read and write permissions"
4. Check "Allow GitHub Actions to create and approve pull requests"
5. Click **Save**

## 🚀 Deployment Methods

### Method 1: Automatic Deployment (Recommended)

The repository includes a GitHub Actions workflow that automatically deploys on every push to `main`.

**How it works:**
1. Push code to `main` branch
2. GitHub Actions automatically triggers
3. Runs `npm run build`
4. Deploys `dist/` folder to GitHub Pages
5. Site goes live at `https://[username].github.io/passportphotosheet/`

**View deployment status:**
- Go to **Actions** tab in your repository
- Check the latest workflow run
- Green checkmark = successful deployment

### Method 2: Manual Deployment

Deploy manually from your local machine:

```bash
# Install dependencies (first time only)
npm install

# Build and deploy
npm run deploy
```

This will:
1. Build the production version
2. Push to `gh-pages` branch
3. GitHub Pages will automatically publish

## 📝 Configuration Files

### vite.config.js

The base path is configured for GitHub Pages:

```javascript
base: process.env.NODE_ENV === 'production'
  ? '/passportphotosheet/'  // ← Change this to your repo name
  : '/',
```

**⚠️ Important:** If your repository name is different, update this line!

### .github/workflows/deploy.yml

The GitHub Actions workflow file that handles automatic deployment.

**Trigger conditions:**
- Push to `main` branch
- Manual trigger via Actions tab

## 🔍 Verification

After deployment, verify everything works:

### 1. Check GitHub Actions
- Go to **Actions** tab
- Latest workflow should show green checkmark
- Click on it to see build logs

### 2. Visit Your Site
- URL: `https://[username].github.io/passportphotosheet/`
- All pages should load correctly
- Navigation should work
- Assets (images, CSS, JS) should load

### 3. Test All Pages
- ✅ Main page (index.html)
- ✅ Photo Editor (photo-editor.html)
- ✅ FAQ (faq.html)
- ✅ Contact (contact.html)
- ✅ Privacy Policy (privacy-policy.html)
- ✅ Terms of Service (terms-of-service.html)

## 🐛 Troubleshooting

### Issue: 404 Errors on Page Refresh

**Cause:** GitHub Pages doesn't support client-side routing by default.

**Solution:** The site uses separate HTML files (not SPA), so this shouldn't be an issue. If you see 404s, check that all HTML files are in the `dist/` folder after build.

### Issue: Assets Not Loading (404)

**Cause:** Incorrect base path configuration.

**Fix:**
1. Check `vite.config.js` → `base` matches your repo name
2. Rebuild: `npm run build`
3. Redeploy: `npm run deploy` or push to trigger GitHub Actions

### Issue: Workflow Fails

**Check:**
1. Node version compatibility (requires Node 18+)
2. npm dependencies install successfully
3. Build command succeeds locally: `npm run build`

**View logs:**
- Go to **Actions** tab
- Click on failed workflow
- Expand steps to see error messages

### Issue: Changes Not Appearing

**Solutions:**
1. **Hard refresh:** Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. **Clear cache:** Clear browser cache
3. **Wait:** GitHub Pages can take 1-2 minutes to update
4. **Check deployment:** Ensure workflow completed successfully

### Issue: Permission Denied

**Fix:**
1. Go to **Settings** → **Actions** → **General**
2. Enable "Read and write permissions"
3. Re-run the workflow

## 📊 Monitoring Deployments

### GitHub Actions Dashboard
- **Actions** tab shows all deployment runs
- Green = Success
- Red = Failed (click to see logs)
- Yellow = In progress

### Deployment Timeline
1. **Push to main**: ~5 seconds
2. **Workflow trigger**: ~10 seconds
3. **Install dependencies**: ~30-60 seconds
4. **Build**: ~30-60 seconds
5. **Deploy**: ~10-20 seconds
6. **Total**: ~2-3 minutes

## 🔐 Security Notes

### Environment Variables
If you need environment variables (API keys, etc.):

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add your secret
4. Reference in workflow:
   ```yaml
   env:
     VITE_API_KEY: ${{ secrets.API_KEY }}
   ```

### Branch Protection
Protect your `main` branch:

1. **Settings** → **Branches**
2. Add rule for `main`
3. Require pull request reviews
4. Require status checks (tests)

## 🔄 Rollback Procedure

If deployment breaks production:

### Method 1: Revert Commit
```bash
git revert HEAD
git push origin main
```
This triggers a new deployment with the previous version.

### Method 2: Deploy Specific Commit
```bash
git checkout <commit-hash>
npm run deploy
git checkout main
```

### Method 3: Manual Rollback
1. Go to **Actions** tab
2. Find last successful workflow
3. Click **Re-run all jobs**

## 📈 Performance Monitoring

### Lighthouse Scores
After deployment, check performance:

1. Open DevTools (F12)
2. Go to **Lighthouse** tab
3. Run audit
4. Check scores (should be 85+)

### Analytics
The site includes:
- Google Analytics 4
- Microsoft Clarity

Monitor these for:
- Page load times
- User interactions
- Error tracking

## 🎯 Best Practices

### Before Pushing

1. **Test locally:**
   ```bash
   npm run build
   npm run preview
   ```
2. **Check all pages work**
3. **Verify assets load**
4. **Test responsive design**

### Branching Strategy

- `main` → Production (auto-deploys)
- `develop` → Development (no auto-deploy)
- Feature branches → Merge to `develop`

### Versioning

Tag releases for easy rollback:

```bash
git tag -a v2.0.0 -m "Vite migration"
git push origin v2.0.0
```

## 📞 Support

If you encounter issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review [GitHub Actions logs](#github-actions-dashboard)
3. Consult [Vite documentation](https://vitejs.dev/)
4. Check [GitHub Pages docs](https://docs.github.com/en/pages)

## ✅ Quick Checklist

Before going live:

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Preview works (`npm run preview`)
- [ ] GitHub Pages enabled in settings
- [ ] Workflow permissions configured
- [ ] Base path in `vite.config.js` is correct
- [ ] All pages load correctly
- [ ] Assets load (images, CSS, JS)
- [ ] Analytics working
- [ ] Mobile responsive
- [ ] Cross-browser tested

---

**Current Deployment:** https://aniltv06.github.io/passportphotosheet/

**Status:** ✅ Ready for Production
