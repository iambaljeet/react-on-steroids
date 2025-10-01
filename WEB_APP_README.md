# React Native Course Web App

A beautiful, modern web application to browse and learn from the comprehensive React Native course. Built with Next.js 15, TypeScript, and Tailwind CSS with shadcn/ui components.

## ✨ Features

### 🎨 Beautiful UI
- **Modern Design**: Clean, professional interface with smooth animations
- **Dark/Light Mode**: Full theme support with system preference detection
- **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Syntax Highlighting**: Code examples with proper highlighting
- **Mobile Navigation**: Slide-out drawer for easy navigation on mobile

### 📚 Course Features
- **18 Chapters**: Complete access to all course content
- **3 Parts**: Organized progression from Foundations to Advanced Topics
- **95+ Code Examples**: All examples properly formatted with syntax highlighting
- **Progress Tracking**: Mark chapters as completed (saved in localStorage)
- **Smart Navigation**: Previous/Next chapter navigation
- **Collapsible Sidebar**: Easy chapter browsing with completion indicators

### 🚀 Modern Tech Stack
- **Next.js 15**: Latest features with Turbopack
- **React 19**: Modern React patterns
- **TypeScript**: Full type safety
- **Tailwind CSS 4**: Latest styling capabilities
- **shadcn/ui**: Beautiful, accessible components
- **React Markdown**: Rich markdown rendering
- **Syntax Highlighting**: Code highlighting with highlight.js

## 📂 Project Structure

```
react-on-steroids/
├── app/
│   ├── page.tsx                 # Homepage with course overview
│   ├── layout.tsx               # Root layout with theme provider
│   ├── globals.css              # Global styles
│   └── course/
│       ├── layout.tsx           # Course layout with sidebar
│       ├── page.tsx             # Course overview page
│       └── [part]/[slug]/
│           └── page.tsx         # Dynamic chapter pages
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── course-header.tsx        # Header with theme toggle
│   ├── course-sidebar.tsx       # Sidebar with chapter navigation
│   ├── mobile-sidebar.tsx       # Mobile drawer sidebar
│   └── chapter-content.tsx      # Markdown renderer for chapters
├── lib/
│   ├── course-data.ts           # Course structure and data
│   └── utils.ts                 # Utility functions
└── public/
    └── course_data/             # Course markdown files
        ├── Part1-Foundations/
        ├── Part2-Core-Concepts/
        └── Part3-Advanced-Topics/
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ installed
- npm or yarn package manager

### Installation

1. **Install Dependencies**
   ```bash
   cd react-on-steroids
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

## 📖 How to Use

### Homepage
- View course statistics and overview
- Browse all 3 parts with chapter previews
- Quick navigation to start learning

### Course Navigation
- **Desktop**: Persistent sidebar showing all chapters
- **Mobile**: Tap menu icon to open sidebar drawer
- **Progress**: Checkmarks show completed chapters
- **Badges**: "NEW" badge for recently added chapters

### Reading Chapters
- **Mark Complete**: Click button to track progress
- **Navigation**: Use Previous/Next buttons at bottom
- **Code Examples**: Properly highlighted with copy functionality
- **Responsive**: Optimized reading experience on all devices

### Theme Toggle
- Click sun/moon icon in header to switch themes
- Automatically saves preference
- Follows system theme by default

## 🎨 Design Features

### Color Scheme
- **Light Mode**: Clean, bright interface
- **Dark Mode**: Easy on the eyes for long reading sessions
- **Accent Color**: Primary color highlights important elements

### Typography
- **Geist Sans**: Clean, modern sans-serif for UI
- **Geist Mono**: Monospace for code examples
- **Responsive Sizing**: Scales appropriately on all devices

### Components
- **Cards**: Content organization
- **Badges**: Status and labels
- **Buttons**: Consistent interactive elements
- **Accordion**: Collapsible sections in sidebar
- **Scroll Areas**: Smooth scrolling containers
- **Sheet/Drawer**: Mobile navigation

## 🔧 Configuration

### Course Data
Course structure is defined in `lib/course-data.ts`:
- Add/modify chapters
- Update statistics
- Change navigation structure

### Styling
- **Tailwind Config**: Customize colors, fonts, spacing
- **Global CSS**: `app/globals.css` for app-wide styles
- **Component Styles**: Inline with Tailwind classes

## 📊 Course Statistics

- **18 Chapters** across 3 parts
- **95+ Code Examples** with syntax highlighting
- **26,000+ Lines** of documentation
- **42-52 Hours** of learning content

## 🌟 Key Features Explained

### Progress Tracking
- Uses localStorage to persist completion status
- Updates across tabs (storage event listener)
- Visual indicators in sidebar (checkmarks)
- Completion count display

### Smart Navigation
- Auto-opens current part in sidebar
- Highlights active chapter
- Previous/Next navigation with chapter titles
- Proper routing with dynamic segments

### Markdown Rendering
- GitHub Flavored Markdown support
- Syntax highlighting for code blocks
- Custom components for better styling
- Support for tables, lists, blockquotes
- External links open in new tabs

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Adaptive layouts
- Touch-friendly navigation

## 🔨 Development

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

### Tech Details
- **Framework**: Next.js 15 App Router
- **Rendering**: Static Site Generation (SSG)
- **Styling**: Tailwind CSS with custom theme
- **Components**: shadcn/ui + custom components
- **Icons**: Lucide React
- **Markdown**: react-markdown + plugins

## 📱 Mobile Experience

- **Slide-out Menu**: Easy access to all chapters
- **Optimized Reading**: Proper text sizing and spacing
- **Touch Navigation**: Smooth scrolling and interactions
- **Progressive Loading**: Fast initial load times

## 🎯 Best Practices

### Performance
- Static generation for all pages
- Optimized bundle sizes
- Code splitting
- Image optimization (if images added)

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support

### SEO
- Meta tags configured
- Open Graph tags
- Proper heading hierarchy
- Descriptive titles

## 🚧 Future Enhancements

Potential additions:
- [ ] Search functionality
- [ ] Bookmarking chapters
- [ ] Notes/annotations
- [ ] Progress export/import
- [ ] Print-friendly styles
- [ ] Offline support (PWA)
- [ ] Interactive code playground
- [ ] Video integration

## 📄 License

This course content is for educational purposes.

## 🤝 Contributing

This is a course material repository. Feel free to:
- Report issues
- Suggest improvements
- Share feedback

---

**Built with ❤️ using React Native Course content**

*Enjoy learning React Native! 🚀*
