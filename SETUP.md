# Setup Guide

This guide will help you get your Investment Calculator up and running with GitHub Actions and GitHub Pages.

## 🚀 Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Project

```bash
# Build CLI
npm run build

# Build Web UI
npm run build:web
```

### 3. Test Locally

#### CLI Test

```bash
npm start
```

#### Web UI Test

Open `dist/web/index.html` in your browser.

## 📦 GitHub Repository Setup

### 1. Initialize Git Repository

If you haven't already:

```bash
git init
git add .
git commit -m "Initial commit: Investment Calculator with CLI and Web UI"
```

### 2. Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name it (e.g., "investment-calculator")
4. Don't initialize with README (you already have one)
5. Click "Create repository"

### 3. Push to GitHub

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

## 🌐 Setting Up GitHub Pages

### Option 1: Via Settings (Recommended)

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Click "Pages" in the left sidebar
4. Under "Source", select **"GitHub Actions"**
5. Save

The `deploy-pages.yml` workflow will automatically deploy on the next push to main.

### Option 2: Manual Trigger

1. Go to the "Actions" tab
2. Select "Deploy to GitHub Pages"
3. Click "Run workflow"

### Accessing Your Site

After deployment (usually 1-2 minutes), your site will be available at:

```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

## ⚙️ GitHub Actions Workflows

### CI Workflow (`ci.yml`)

**Triggers**: Push and Pull Requests to main/master

**What it does**:

- Installs dependencies
- Builds CLI application
- Builds web application
- Uploads artifacts

### Deploy Pages Workflow (`deploy-pages.yml`)

**Triggers**: Push to main/master, or manual trigger

**What it does**:

- Builds web application
- Deploys to GitHub Pages

### CLI Demo Workflow (`cli-demo.yml`)

**Triggers**: Manual only

**What it does**:

- Runs calculations based on your inputs
- Displays results in job logs and summary

**To use**:

1. Go to Actions tab
2. Select "CLI Demo"
3. Click "Run workflow"
4. Fill in the parameters:
   - Calculation type
   - Principal amount
   - Interest rate
   - Time period
   - Compound frequency (if applicable)
5. Click "Run workflow"
6. View results in the job summary

## 🔧 Troubleshooting

### GitHub Pages Not Deploying

**Issue**: Deployment workflow runs but site doesn't update.

**Solutions**:

1. Check that "GitHub Actions" is selected as the source in Settings > Pages
2. Ensure the workflow has proper permissions (already set in `deploy-pages.yml`)
3. Check the Actions tab for any errors in the deployment workflow

### CLI Not Working

**Issue**: `npm start` fails or shows errors.

**Solutions**:

1. Make sure you've run `npm install`
2. Ensure `npm run build` completes without errors
3. Check that Node.js version is 18 or higher: `node --version`

### Build Errors

**Issue**: TypeScript build fails.

**Solutions**:

1. Delete `node_modules` and `dist` folders
2. Run `npm install` again
3. Run `npm run build` and check for specific TypeScript errors

### Web App Not Loading in Browser

**Issue**: Opening `dist/web/index.html` shows errors.

**Solutions**:

1. Check browser console for errors (F12)
2. Ensure `npm run build:web` completed successfully
3. Try opening in a different browser
4. If using GitHub Pages, ensure the deployment completed successfully

## 📝 Customization

### Changing Calculation Logic

Edit `src/calculator.ts` to modify the calculation formulas or add new calculation types.

### Updating CLI Interface

Edit `src/cli.ts` to change prompts, add new questions, or modify the flow.

### Styling the Web UI

The CSS is embedded in `src/web/index.html`. You can:

- Modify colors and gradients
- Change the layout and spacing
- Add new UI elements

### Adding More Workflows

Create new workflow files in `.github/workflows/` to add:

- Automated testing
- Code linting
- Scheduled calculations
- Release automation

## 🎯 Next Steps

1. ✅ Push your code to GitHub
2. ✅ Set up GitHub Pages
3. ✅ Test the CLI locally
4. ✅ Test the web UI on GitHub Pages
5. ✅ Try running the CLI Demo workflow
6. 🎨 Customize the UI to your liking
7. 📊 Add more calculation types if needed

## 🆘 Getting Help

If you encounter issues:

1. Check the [Actions tab](https://github.com/YOUR-USERNAME/YOUR-REPO-NAME/actions) for workflow errors
2. Review the workflow logs for specific error messages
3. Ensure all prerequisites are met (Node.js 18+, npm, git)
4. Check that all files are committed and pushed to GitHub

## 🎉 You're All Set!

Your Investment Calculator is now:

- ✅ Running locally via CLI
- ✅ Available on the web via GitHub Pages
- ✅ Automated with GitHub Actions
- ✅ Ready for calculations!

Enjoy calculating your investment returns! 💰
