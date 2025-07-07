# Quote Generator App

A beautiful web app that displays random quotes with text-to-speech functionality, dark mode, and social sharing.

## Features

- 🎙️ **Text-to-Speech**: UK English Male voice narration
- 🌓 **Dark/Light Mode**: Automatic system preference detection
- ❤️ **Favorites**: Save your favorite quotes locally
- 📤 **Sharing**: Share quotes via Twitter, Facebook, or WhatsApp
- 📋 **Copy**: One-click quote copying
- ✨ **Animations**: Smooth transitions between quotes

## 🚀 Live Demo

**Frontend:** https://quotee-app.netlify.app
**API Endpoint:** https://quote-backend-83nu.onrender.com

## Setup

1. Clone the repository:
   git clone https://github.com/fattgg/quote-app.git
   cd quote-app

2. Install backend dependencies:
   cd backend
   npm install

3. Start the backend server:
   node server.js

4. Open frontend/index.html in your browser

## Requirements

Node.js (for backend)
Modern web browser (Chrome, Firefox, Edge recommended)

## Backend API

The app uses a simple Express server that:

Serves random quotes from quotes.json
Falls back to ZenQuotes API if needed
Runs on http://localhost:3000

## Customization
Edit these files to customize:

quotes.json - Add your own quotes
frontend/style.css - Change colors and styling
frontend/script.js - Modify voice or behavior

## License
MIT License - Free for personal and commercial use
