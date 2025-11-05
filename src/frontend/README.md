# Frontend Deployment

This directory contains the frontend application that is deployed to GitHub Pages.

## Deployment

The application is automatically deployed to GitHub Pages via the `.github/workflows/deploy-pages.yml` workflow when changes are pushed to the `main` branch.

**Live URL**: https://lovable-ldcs.github.io/PIT-Project-Implementation-Tracker/

## Manual Deployment

If the automatic deployment hasn't run yet, you can manually trigger it:

1. Go to the [Actions tab](https://github.com/Lovable-LDCS/PIT-Project-Implementation-Tracker/actions)
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow" button
4. Select the `main` branch
5. Click "Run workflow"

The deployment typically takes 1-2 minutes to complete.

## First Time Setup

When deploying for the first time, ensure that GitHub Pages is configured in the repository settings:

1. Go to Settings > Pages
2. Source should be set to "GitHub Actions"
3. The workflow will create and deploy to the `gh-pages` branch automatically

## Files

- `index.html` - Main application entry point
- `app-boot.js` - Application bootstrap logic
- `app-main.js` - Main application logic
- `styles.css` - Application styles
- `assets/` - Static assets (images, fonts, etc.)
- `.nojekyll` - Prevents GitHub Pages from processing the site with Jekyll
