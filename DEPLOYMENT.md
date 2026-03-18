# GitHub Pages Deployment Guide

Complete step-by-step instructions for deploying the Historic AR Overlay to GitHub Pages.

## Prerequisites

- A GitHub account (free)
- Git installed on your computer
- The Historic AR Overlay repository

## Option 1: Deploy Existing Repository (Recommended)

### Step 1: Initialize Git Repository (if needed)

```bash
cd Historic-AR-Overlay
git init
git add .
git commit -m "Initial commit: Historic AR Overlay"
```

### Step 2: Create Repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. **Repository name**: `Historic-AR-Overlay`
3. **Description**: "World-locked AR overlay web app for historical images"
4. **Public**: ✅ (required for GitHub Pages)
5. Click **Create repository**

### Step 3: Connect Local Repository

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Historic-AR-Overlay.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (gear icon)
3. Scroll to **Pages** in the left sidebar
4. Under **Source**:
   - Select **Deploy from a branch**
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

### Step 5: Access Your App

After a few seconds, you'll see a message:
> "Your site is live at https://YOUR_USERNAME.github.io/Historic-AR-Overlay/"

Visit that URL to use your AR app!

---

## Option 2: Use GitHub Codespaces or Web Editor

### Step 1: Fork or Create Repository
1. Create a new repository as described above
2. Or click **Fork** if using an existing repository

### Step 2: Edit Files Directly
1. Click the **Code** button
2. **Codespaces** tab (optional, for live editing)
3. Or edit files directly in the web editor

### Step 3: Enable GitHub Pages
Follow **Step 4** in Option 1

---

## Custom Domain (Optional)

If you have your own domain:

1. Go to repository **Settings** → **Pages**
2. Under **Custom domain**, enter your domain (e.g., `ar.example.com`)
3. Update DNS records with GitHub's instructions
4. Enable **Enforce HTTPS**

---

## Updating Your App

### After Making Changes Locally

```bash
# Make your changes to files
# Then commit and push:

git add .
git commit -m "Update: describe your changes"
git push origin main
```

The site automatically redeploys within seconds!

### Direct Web Editing (Without Git)

1. Open your repository on GitHub
2. Click the **pencil icon** to edit files
3. Commit directly to the `main` branch
4. Changes deploy automatically

---

## Troubleshooting

### "Your site is not published"
- Ensure GitHub Pages is enabled in Settings
- Check that the branch is `main` and folder is `/(root)`
- Wait 1-2 minutes for initial deployment

### 404 on GitHub Pages
- Verify `index.html` is in the repository root
- Check `Settings` → `Pages` configuration
- Clear browser cache

### HTTPS Not Working
- GitHub Pages automatically provides HTTPS
- If issues persist, try clearing cache
- Wait up to 24 hours for DNS propagation

### Camera Not Working
- HTTPS is required for camera access
- Ensure your device supports WebXR
- Check browser permissions

### Images Not Loading
- Use URLs with proper CORS headers
- Or upload images as files to the repo
- Test URLs in a browser before using

---

## Sharing Your App

### Share With Image Pre-Loaded

```
https://YOUR_USERNAME.github.io/Historic-AR-Overlay/?image=https://example.com/image.jpg
```

### Social Media Share

- **Twitter**: Include a link and description
- **Facebook**: Share the URL, describe the AR feature
- **Email**: Send the link with setup instructions

### QR Code

Generate QR codes for your app:
- Use [qr-server.com](https://qr-server.com)
- Input your app URL
- Share or print the QR code

---

## Advanced Deployment

### Use Custom GitHub Actions

Create `.github/workflows/deploy.yml` for automation:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy
        run: echo "Deployed!"
```

### CI/CD Pipeline

For larger projects, consider:
- Automated testing
- Image optimization
- Asset bundling
- Deployment notifications

---

## Performance Tips for GitHub Pages

1. **Optimize Images**: Reduce file size before uploading
2. **Minimize Files**: Use minified CSS/JS for production
3. **Cache Policy**: Leverage browser caching headers
4. **CDN**: Use jsDelivr or unpkg for external libraries

---

## Maintenance

### Regular Updates

```bash
# Check for updates to dependencies
npm outdated  # If using npm

# Update documentation as you add features
# Test thoroughly before pushing to main
```

### Monitoring

- Check GitHub repository for errors
- Monitor user feedback and issues
- Update security patches as needed

---

## Next Steps

1. ✅ Deploy to GitHub Pages
2. 📝 Customize the app (see [CONFIG.md](CONFIG.md))
3. 🎨 Add your own images
4. 📤 Share with others
5. 🚀 Expand features as needed

---

## Support Resources

- [GitHub Pages Documentation](https://pages.github.com/)
- [GitHub Help](https://help.github.com)
- [WebXR API Documentation](https://www.w3.org/TR/webxr/)
- [Three.js Documentation](https://threejs.org/docs)

---

For more help, check the main [README.md](README.md) or [EXAMPLES.md](EXAMPLES.md)
