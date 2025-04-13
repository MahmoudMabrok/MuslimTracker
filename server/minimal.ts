import express from 'express';
import { setupVite, log } from './vite';
import http from 'http';

// Create Express app
const app = express();
const server = http.createServer(app);

async function init() {
  // Set up Vite for development
  await setupVite(app, server);
  
  // Start server
  const port = process.env.PORT || 5000;
  server.listen(port, '0.0.0.0', () => {
    log(`serving on port ${port}`);
  });
}

init().catch(console.error);