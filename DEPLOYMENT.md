# Deployment Guide

This guide covers various deployment options for the Home Loan Optimizer application, from local builds to production deployments on popular hosting platforms.

## Table of Contents

- [Building for Production](#building-for-production)
- [Deployment Options](#deployment-options)
  - [Vercel](#option-1-vercel-recommended)
  - [Netlify](#option-2-netlify)
  - [GitHub Pages](#option-3-github-pages)
  - [Static Hosting](#option-4-static-hosting)
- [Environment Configuration](#environment-configuration)
- [Performance Optimization](#performance-optimization)
- [Monitoring and Analytics](#monitoring-and-analytics)
- [Troubleshooting](#troubleshooting)

---

## Building for Production

### Prerequisites

Ensure you have the following installed:
- Node.js 18 or higher
- npm or yarn package manager

### Build Process

```bash
# Install dependencies (if not already done)
npm install

# Run production build
npm run build
```

This command:
1. Runs TypeScript compiler (`tsc -b`)
2. Bundles the application using Vite
3. Optimizes assets (minification, tree-shaking)
4. Generates static files in the `dist` directory

### Build Output

The `dist` directory will contain:
```
dist/
├── assets/
│   ├── index-[hash].js      # Main JavaScript bundle
│   ├── index-[hash].css     # Compiled CSS
│   └── [other-assets]       # Images, fonts, etc.
├── index.html               # Entry HTML file
└── favicon.svg              # Favicon
```

### Preview Production Build Locally

```bash
npm run preview
```

This starts a local server to preview the production build at `http://localhost:4173`

---

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel offers the best integration with Vite applications and provides automatic deployments.

#### Method A: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # Navigate to project directory
   cd home-loan-optimizer
   
   # Deploy to production
   vercel --prod
   ```

4. **Follow the prompts:**
   - Set up and deploy: Yes
   - Which scope: Select your account
   - Link to existing project: No (first time)
   - Project name: home-loan-optimizer
   - Directory: ./
   - Override settings: No

#### Method B: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click "Deploy"

#### Vercel Configuration (Optional)

Create `vercel.json` in project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

### Option 2: Netlify

Netlify provides excellent static site hosting with continuous deployment.

#### Method A: Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize and Deploy**
   ```bash
   # Navigate to project directory
   cd home-loan-optimizer
   
   # Build the project
   npm run build
   
   # Deploy
   netlify deploy --prod
   ```

4. **Follow the prompts:**
   - Create & configure a new site
   - Team: Select your team
   - Site name: home-loan-optimizer (or custom)
   - Publish directory: dist

#### Method B: Netlify Dashboard

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to your Git provider
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Base directory**: `home-loan-optimizer` (if in subdirectory)
5. Click "Deploy site"

#### Netlify Configuration

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

### Option 3: GitHub Pages

Deploy directly from your GitHub repository.

#### Setup Steps

1. **Install gh-pages package**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   
   Add homepage and deploy scripts:
   ```json
   {
     "homepage": "https://yourusername.github.io/home-loan-optimizer",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Update vite.config.ts**
   
   Add base path:
   ```typescript
   export default defineConfig({
     base: '/home-loan-optimizer/',
     // ... other config
   })
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Configure GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Folder: / (root)

#### GitHub Actions (Automated Deployment)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

### Option 4: Static Hosting

Deploy to any static hosting service (AWS S3, Azure Static Web Apps, Google Cloud Storage, etc.)

#### General Steps

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Upload dist folder contents** to your hosting service

3. **Configure routing** to serve `index.html` for all routes

#### AWS S3 + CloudFront Example

```bash
# Build
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

#### Azure Static Web Apps

```bash
# Install Azure CLI
npm install -g @azure/static-web-apps-cli

# Build
npm run build

# Deploy
swa deploy ./dist --env production
```

---

## Environment Configuration

### Environment Variables

Currently, the application runs entirely client-side with no environment variables. If you need to add them:

1. **Create `.env` file** (for local development)
   ```env
   VITE_API_URL=https://api.example.com
   VITE_APP_NAME=Home Loan Optimizer
   ```

2. **Access in code**
   ```typescript
   const apiUrl = import.meta.env.VITE_API_URL;
   ```

3. **Configure in hosting platform**
   - **Vercel**: Environment Variables section in dashboard
   - **Netlify**: Site settings → Environment variables
   - **GitHub Pages**: Repository secrets (for GitHub Actions)

### Build-time Configuration

Modify `vite.config.ts` for build-specific settings:

```typescript
export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false, // Set to true for debugging
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'chart-vendor': ['recharts'],
        },
      },
    },
  },
});
```

---

## Performance Optimization

### 1. Enable Compression

Most hosting platforms enable gzip/brotli automatically. Verify with:

```bash
curl -H "Accept-Encoding: gzip" -I https://your-domain.com
```

### 2. Configure Caching Headers

**Vercel** (automatic)
- Static assets: 1 year cache
- HTML: No cache

**Netlify** (via netlify.toml)
```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

### 3. Use CDN

All recommended platforms (Vercel, Netlify) include global CDN by default.

### 4. Enable HTTP/2

Enabled by default on modern hosting platforms.

### 5. Optimize Images

```bash
# Install image optimization tools
npm install -D vite-plugin-imagemin

# Add to vite.config.ts
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
  plugins: [
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      svgo: { plugins: [{ removeViewBox: false }] },
    }),
  ],
});
```

### 6. Analyze Bundle Size

```bash
# Install bundle analyzer
npm install -D rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});

# Build and view analysis
npm run build
```

---

## Monitoring and Analytics

### 1. Google Analytics

Add to `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Vercel Analytics

```bash
npm install @vercel/analytics

# Add to main.tsx
import { Analytics } from '@vercel/analytics/react';

<Analytics />
```

### 3. Error Tracking (Sentry)

```bash
npm install @sentry/react

# Add to main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
});
```

### 4. Performance Monitoring

Use built-in browser tools:
- Chrome DevTools → Lighthouse
- WebPageTest.org
- GTmetrix

---

## Troubleshooting

### Issue: 404 on Page Refresh

**Problem**: SPA routing doesn't work on direct URL access

**Solution**: Configure server to serve `index.html` for all routes

- **Vercel**: Automatic
- **Netlify**: Add redirects in `netlify.toml`
- **GitHub Pages**: Use hash routing or configure properly

### Issue: Build Fails

**Problem**: TypeScript errors or dependency issues

**Solutions**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite

# Check Node version
node --version  # Should be 18+
```

### Issue: Large Bundle Size

**Problem**: Bundle exceeds size limits

**Solutions**:
- Enable code splitting
- Lazy load components
- Analyze bundle with visualizer
- Remove unused dependencies

### Issue: Slow Build Times

**Solutions**:
```bash
# Use faster package manager
npm install -g pnpm
pnpm install
pnpm build

# Disable source maps in production
# vite.config.ts
build: {
  sourcemap: false
}
```

### Issue: Environment Variables Not Working

**Problem**: Variables undefined in production

**Solutions**:
- Ensure variables start with `VITE_`
- Configure in hosting platform dashboard
- Rebuild after adding variables
- Check browser console for values

### Issue: CORS Errors

**Problem**: API calls blocked (if using external APIs)

**Solutions**:
- Configure CORS on API server
- Use proxy in development
- Add CORS headers in hosting platform

---

## Deployment Checklist

Before deploying to production:

- [ ] Run `npm run build` successfully
- [ ] Test production build locally with `npm run preview`
- [ ] Verify all features work in production mode
- [ ] Check bundle size (should be < 1MB gzipped)
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Verify responsive design
- [ ] Check accessibility (Lighthouse score)
- [ ] Configure custom domain (if applicable)
- [ ] Set up SSL certificate (automatic on most platforms)
- [ ] Configure analytics (optional)
- [ ] Set up error tracking (optional)
- [ ] Test all calculator functions
- [ ] Verify chart rendering
- [ ] Test export functionality
- [ ] Check SEO meta tags

---

## Post-Deployment

### 1. Verify Deployment

```bash
# Check if site is live
curl -I https://your-domain.com

# Test specific routes
curl https://your-domain.com/
```

### 2. Monitor Performance

- Check Lighthouse scores
- Monitor Core Web Vitals
- Track error rates
- Monitor bundle size over time

### 3. Set Up Continuous Deployment

Configure automatic deployments on:
- Push to main branch
- Pull request previews
- Scheduled deployments

### 4. Custom Domain Setup

**Vercel**:
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as shown

**Netlify**:
1. Go to Site Settings → Domain management
2. Add custom domain
3. Configure DNS or use Netlify DNS

---

## Support and Resources

- **Vite Documentation**: https://vitejs.dev/guide/
- **Vercel Documentation**: https://vercel.com/docs
- **Netlify Documentation**: https://docs.netlify.com/
- **GitHub Pages**: https://pages.github.com/

---

**Deployment Guide Version**: 1.0.0  
**Last Updated**: June 10, 2026  
**Maintained By**: Development Team