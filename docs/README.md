# i18nizer Documentation

This is the documentation website for [i18nizer](https://github.com/yossTheDev/i18nizer), built with Next.js.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building

Build the static site:
```bash
npm run build
```

The output will be in the `out` directory.

## 📁 Project Structure

```
docs/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Home page
│   ├── getting-started/   # Getting Started page
│   ├── cli-commands/      # CLI Commands reference
│   ├── configuration/     # Configuration guide
│   ├── examples/          # Code examples
│   ├── architecture/      # Architecture overview
│   └── contributing/      # Contributing guide
├── components/            # React components
│   ├── Header.tsx        # Site header
│   ├── Sidebar.tsx       # Navigation sidebar
│   └── Providers.tsx     # Theme provider
├── public/               # Static assets
└── content/             # MDX content (future)
```

## 🎨 Features

- ✅ Next.js 15 with App Router
- ✅ TypeScript
- ✅ TailwindCSS for styling
- ✅ Dark mode support
- ✅ Responsive design
- ✅ MDX support for content
- ✅ Syntax highlighting for code blocks
- ✅ SEO optimized (sitemap, robots.txt, metadata)
- ✅ Static site generation

## 📝 Adding Content

To add a new documentation page:

1. Create a new directory in `app/` (e.g., `app/new-page/`)
2. Add a `page.tsx` file with your content
3. Update the navigation in `components/Sidebar.tsx`
4. Add the route to `app/sitemap.ts`

## 🎨 Styling

The site uses TailwindCSS with a custom theme. The main colors are:

- Primary: Green (`primary-600`)
- Dark mode background: Gray 900
- Light mode background: White

## 🔍 SEO

The site includes:

- OpenGraph metadata for social sharing
- Twitter Card metadata
- Sitemap generation
- Robots.txt
- Semantic HTML structure
- Proper heading hierarchy

## 📄 License

MIT License - see the main repository for details.
