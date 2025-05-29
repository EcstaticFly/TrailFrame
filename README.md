# TrailFrame

A smooth mouse-following image trail effect built with Next.js and TypeScript. Features staggered reveal animations and automatic cleanup. Images appear along the mouse path with elegant clip-path transitions and fade-out effects.

## 🖥️ Desktop Only

This animation is **optimized for desktop devices only** (screen width > 1000px). On mobile devices, the effect is automatically disabled to ensure optimal performance.

## 🌐 Live Demo

**[View Live Demo →](https://trailframe.vercel.app/)**

## ✨ Features

- **Mouse tracking** - Images follow cursor movement
- **Animation interpolation** - Smooth, fluid motion transitions  
- **Staggered reveals** - Images appear with layered clip-path animations
- **Memory-efficient cleanup** - Automatic removal of old trail elements
- **Responsive behavior** - Desktop-only activation with resize detection
- **Performance optimized** - RequestAnimationFrame-based rendering

## 🛠️ Tech Stack

- **Next.js** - React framework
- **TypeScript** - Type-safe development
- **React Hooks** - Modern state management

## 🚀 Usage

```jsx
import TrailContainer from '@/components/TrailContainer';

export default function Home() {
  return (
    <div>
      <h1>Your Content Here</h1>
      <TrailContainer />
    </div>
  );
}
```

## 📁 Setup

1. Place your trail images in `/public/trail-images/` 
2. Name them `img1.jpeg` through `img20.jpeg`
3. Import and use the `TrailContainer` component

The component automatically handles desktop detection, mouse tracking, and cleanup without affecting your page layout.

## 🤝 Contributing  
Contributions, issues, and feature requests are welcome!  
Feel free to **fork** the repo and submit a **pull request**.  

## 📜 License  
This project is licensed under the **GNU GENERAL PUBLIC LICENSE v3.0**.

## 📬 Contact
For inquiries, reach out to me at [Suyash Pandey](mailto:suyash.2023ug1100@iiitranchi.ac.in).
