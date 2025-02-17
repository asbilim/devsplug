# 🚀 Devsplug Frontend

A modern, multilingual developer community hub built with Next.js 13, featuring beautiful developer-focused themes and a responsive design.

## ✨ Features

- 🌐 **Internationalization**

  - Support for English 🇬🇧, French 🇫🇷, and German 🇩🇪
  - Easy language switching with country flags
  - SEO-friendly URL structure

- 🎨 **Developer-Focused Themes**

  - Matrix (Classic green terminal)
  - Synthwave (Retro neon aesthetic)
  - Terminal (Classic terminal look)
  - Dracula (Popular dark theme)
  - Light & Dark modes
  - System theme detection

- 🎯 **Technical Stack**

  - Next.js 15 with App Router
  - TypeScript for type safety
  - Tailwind CSS for styling
  - Shadcn/ui for components
  - next-intl for internationalization

- 🔥 **Developer Experience**
  - Custom monospace fonts (JetBrains Mono, Fira Code)
  - Handwriting accents with Caveat font
  - Modern sans-serif with Space Grotesk
  - Responsive design
  - Beautiful gradient effects

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/asbilim/devsplug.git
   cd devsplug
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌍 Internationalization

The project supports multiple languages through URL-based routing:

- 🇬🇧 English: `/en`
- 🇫🇷 French: `/fr`
- 🇩🇪 German: `/de`

Translation files are located in the `messages` directory.

## 🎨 Theme System

Themes can be switched using the theme selector in the header. Available themes:

- System (follows system preference)
- Light
- Dark
- Matrix
- Synthwave
- Terminal
- Dracula

## 📁 Project Structure

```
devsplug/
├── app/
│   └── [locale]/        # Internationalized routes
├── components/          # React components
├── messages/           # Translation files
├── lib/               # Utility functions
└── public/            # Static assets
```

## 🛠️ Development

- **Adding a new language**

  1. Add the locale to `src/i18n.ts`
  2. Create a new translation file in `messages/`
  3. Add the language to the header component

- **Creating a new theme**
  1. Add theme colors to `app/globals.css`
  2. Add theme to `components/theme-provider.tsx`
  3. Update theme icons in the header

## 📝 License

MIT License - see the [LICENSE](LICENSE) file for details

## 👤 Author

**Asbilim**

- GitHub: [@asbilim](https://github.com/asbilim)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/asbilim/devsplug/issues).

## ⭐️ Show your support

Give a ⭐️ if this project helped you!
