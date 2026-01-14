# Deploying the i18nizer Documentation Site

The documentation site is built with Next.js and uses static site generation (SSG), making it easy to deploy to various platforms.

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Build the Site

From the `docs` directory:

```bash
cd docs
npm install
npm run build
```

The static files will be generated in the `out` directory.

## Deployment Options

### Vercel (Recommended)

The easiest way to deploy is using Vercel:

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Set the root directory to `docs`
4. Deploy

Or use the Vercel CLI:

```bash
cd docs
npx vercel
```

### Netlify

1. Build the site: `npm run build`
2. Deploy the `out` directory to Netlify
3. Configure redirects if needed

Using Netlify CLI:

```bash
cd docs
npm run build
npx netlify deploy --dir=out --prod
```

### GitHub Pages

1. Build the site: `npm run build`
2. Push the `out` directory to the `gh-pages` branch
3. Configure GitHub Pages to serve from that branch

### Static Hosting (AWS S3, Cloudflare Pages, etc.)

1. Build the site: `npm run build`
2. Upload the contents of the `out` directory to your hosting provider
3. Configure the web server to serve `index.html` for route handling

## Custom Domain

To use a custom domain:

1. Update the `metadataBase` in `app/layout.tsx` to your domain
2. Update the sitemap URLs in `app/sitemap.ts`
3. Configure DNS records with your hosting provider

## Environment Variables

No environment variables are required for the documentation site.

## Continuous Deployment

For automatic deployments on push:

### GitHub Actions (Example)

Create `.github/workflows/deploy-docs.yml`:

```yaml
name: Deploy Documentation

on:
  push:
    branches:
      - main
    paths:
      - 'docs/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd docs && npm install
      - name: Build
        run: cd docs && npm run build
      - name: Deploy to hosting
        run: # Your deployment command here
```

## Performance Tips

The site is already optimized for performance:

- Static generation (no server required)
- Images are unoptimized (add optimization if needed)
- CSS is minified
- JavaScript is bundled and minimized
- Dark mode with no flash

## Troubleshooting

### Build fails

- Ensure you're using Node.js 18+
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Next.js cache: `rm -rf .next`

### Pages not loading

- Check that the hosting is configured to serve `index.html` for routes
- Verify the `output: 'export'` setting in `next.config.mjs`

### Styles not working

- Ensure Tailwind CSS is properly configured
- Check that `globals.css` is imported in `layout.tsx`
