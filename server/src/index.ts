import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serveStatic } from 'hono/serve-static';
import uploadRoute from './routes/upload';
import downloadRoute from './routes/download';
import type { Bindings } from './utils/types';

// Load environment variables
import 'dotenv/config';

const app = new Hono<{ Bindings: Bindings }>();

// Middleware
app.use('*', logger());
app.use('*', cors());

// Health check endpoint
app.get('/', (c) => {
  return c.text('Groupee Server is running!');
});

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.route('/api/v1/upload', uploadRoute);
app.route('/api/v1/download', downloadRoute);

export default app;