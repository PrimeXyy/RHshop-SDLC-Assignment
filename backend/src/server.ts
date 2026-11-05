import app from './app.js';
import { config } from './config/env.js';

const PORT = config.port;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[RHshop Backend] Running on http://0.0.0.0:${PORT}`);
  console.log(`[RHshop Backend] Environment: ${config.env}`);
  console.log(`[RHshop Backend] Health check: http://localhost:${PORT}/api/health`);
});
