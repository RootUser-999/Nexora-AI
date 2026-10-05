import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiMiddleware } from './src/server/apiMiddleware.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// API routes middleware
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    apiMiddleware(req, res, next);
  } else {
    next();
  }
});

// Static assets from Vite build
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Nexora AI SaaS Platform listening on port ${PORT}`);
});
