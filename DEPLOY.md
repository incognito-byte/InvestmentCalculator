# GitHub Pages Deployment Guide

## Quick Setup

### 1. Push to GitHub

If you haven't already pushed your code to GitHub:

```bash
git add .
git commit -m "Add investment calculator with web UI"
git push origin main
```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. In the left sidebar, click **Pages**
4. Under **Source**, select **GitHub Actions**
5. Save

### 3. Automatic Deployment

The workflow will automatically deploy when you:

- Push to the `main` or `master` branch
- Manually trigger it from the Actions tab

### 4. Access Your Site

After deployment (usually 1-2 minutes), your site will be available at:

```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

For example, if your username is `johndoe` and repo is `investment-calculator`:

```
https://johndoe.github.io/investment-calculator/
```

## Manual Deployment

You can also manually trigger a deployment:

1. Go to the **Actions** tab in your repository
2. Select **"Deploy to GitHub Pages"** workflow
3. Click **"Run workflow"**
4. Select the branch (main/master)
5. Click **"Run workflow"**

## Workflow Details

The deployment workflow (`.github/workflows/deploy-pages.yml`) does the following:

1. **Checkout code** - Gets your latest code
2. **Install dependencies** - Runs `npm ci`
3. **Build web app** - Runs `npm run build:web`
4. **Deploy to Pages** - Uploads `dist/web` folder to GitHub Pages

## Troubleshooting

### Pages Not Enabled

**Error**: "Pages is not enabled for this repository"

**Solution**:

1. Go to Settings → Pages
2. Select "GitHub Actions" as the source

### Workflow Permissions

**Error**: "Request failed due to insufficient permissions"

**Solution**:

1. Go to Settings → Actions → General
2. Scroll to "Workflow permissions"
3. Select "Read and write permissions"
4. Check "Allow GitHub Actions to create and approve pull requests"
5. Save

### Build Fails

**Error**: Build step fails in the workflow

**Solution**:

1. Check the Actions tab for detailed error logs
2. Ensure `npm run build:web` works locally
3. Make sure all dependencies are in `package.json`

### 404 Error on Site

**Error**: Site shows 404 page

**Solution**:

1. Wait 2-3 minutes for DNS propagation
2. Check that deployment completed successfully in Actions tab
3. Verify the correct URL (username and repo name)
4. Try clearing browser cache or using incognito mode

## Local Testing

Before deploying, test locally:

```bash
# Build the web app
npm run build:web

# Open in browser
open dist/web/index.html
# or on Linux:
# xdg-open dist/web/index.html
```

## Updating the Site

Every time you push changes to the main branch, the site will automatically rebuild and deploy:

```bash
# Make your changes
git add .
git commit -m "Update calculator"
git push origin main
```

Wait 1-2 minutes and refresh your GitHub Pages URL to see the changes!

## Custom Domain (Optional)

To use a custom domain:

1. Go to Settings → Pages
2. Enter your custom domain under "Custom domain"
3. Add DNS records as instructed by GitHub
4. Wait for DNS propagation (up to 24 hours)

## Notes

- The web app works entirely in the browser (no server needed)
- All calculations happen client-side
- No data is sent to any servers
- Works with or without internet after initial load
