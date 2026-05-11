# ChaloBus Pakistan 🇵🇰

A modern, fast, and responsive bus transportation platform built for Pakistan. Users can search for AC and Non-AC bus timings, fares, and route details across 50+ cities.

## 🚀 Features

- **Real-time Search:** Find buses between any two major cities in Pakistan.
- **Verified Data:** Fares and timings sourced directly from terminal operators.
- **Mobile First:** Fully responsive design that works perfectly on all devices.
- **Modern UI:** Built with React, Tailwind CSS 4, and Motion for smooth animations.

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Animations:** Motion (formerly Framer Motion)
- **Icons:** Lucide React

## 📂 Project Structure

- `src/components/`: Reusable UI components (Navbar, Hero, etc.)
- `src/data/`: Mock data and constants (City lists, Bus records)
- `src/types.ts`: TypeScript interfaces for the application.
- `src/App.tsx`: Main application logic and layout.

## 🚦 Getting Started

1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Build for production: `npm run build`

---
Built with ❤️ for Pakistan.

## 🚀 Deployment to GitHub Pages

If your website is showing a blank page on GitHub Pages, follow these steps:

1. **Vite Base Path:** Ensure `base: '/Buses/'` is set in your `vite.config.ts`.
2. **GitHub Actions:** Ensure your repository setings are configured to deploy from GitHub Actions:
   - Go to your repo **Settings** -> **Pages**.
   - Under **Build and deployment**, set **Source** to `GitHub Actions`.
3. **Commit & Push:** Push all files, including the `.github/workflows/deploy.yml` file created by the assistant.
4. **Environment:** Make sure your repository name matches the base path (`/Buses/`). If your repo name isDifferent, update `base` in `vite.config.ts` accordingly.
