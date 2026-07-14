import express from 'express';
import routes from '../routes/index.js';

const app = express();
app.use(express.json());
app.use('/', routes());
app.use((req, res) => res.status(404).json({ error: 'Route not found', url: req.url }));

const s = app.listen(3098, async () => {
  const checks = [
    ['GET', '/health'],
    ['GET', '/auth/providers'],
    ['POST', '/auth/signup', { email: `t${Date.now()}@t.com`, password: 'password123', name: 'T' }],
  ];
  for (const [method, path, body] of checks) {
    const r = await fetch(`http://127.0.0.1:3098${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    console.log(method, path, r.status, await r.text());
  }
  s.close();
  process.exit(0);
});
