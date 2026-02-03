---
description: How to deploy the application to GitHub Pages
---

# Deploying to GitHub Pages

This project is set up to deploy automatically using GitHub Actions.

## Steps to Deploy

1. **Commit and Push**: Ensure all your changes (including the new `vite.config.ts` and `.github/workflows/deploy.yml`) are committed and pushed to your **main** branch.

   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment workflow"
   git push origin main
   ```

2. **Configure GitHub Repo Settings**:
   - Go to your repository on GitHub.
   - Click on **Settings** (top tab).
   - Click on **Pages** (left sidebar, under "Code and automation").
   - Under **Build and deployment** > **Source**, change the dropdown from "Deploy from a branch" to **"GitHub Actions"**.

3. **Verify**:
   - Go to the **Actions** tab in your repository.
   - You should see a workflow named "Deploy static content to Pages" running.
   - Once it finishes (turns green), your site will be live at `https://<your-username>.github.io/<your-repo-name>/`.

## Maintaining the Site

Every time you push to the `main` branch, GitHub Actions will automatically rebuild and redeploy the latest version of your game.
