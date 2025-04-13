import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import Material Icons from Google CDN via CSS
const materialIconsLink = document.createElement('link');
materialIconsLink.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
materialIconsLink.rel = 'stylesheet';
document.head.appendChild(materialIconsLink);

// Import Amiri font for Arabic text
const amiriFont = document.createElement('link');
amiriFont.href = 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap';
amiriFont.rel = 'stylesheet';
document.head.appendChild(amiriFont);

// Add title
const title = document.createElement('title');
title.textContent = 'Muslim Actions Tracker';
document.head.appendChild(title);

createRoot(document.getElementById("root")!).render(<App />);
