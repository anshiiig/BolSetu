import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const SARVAM_API_KEY = process.env.SARVAM_API_KEY || 'sk_qkx76qdz_xn8XH22i1J27UMaQmEtN9zn4';

// In-memory server-side audio cache
const ttsServerCache = new Map();
const ttsStats = {
  totalRequests: 0,
  cacheHits: 0,
  cacheMisses: 0,
  errors: 0,
};

// Custom Vite plugin providing backend /api/tts proxy endpoint
function ttsBackendPlugin() {
  return {
    name: 'indic-tts-backend-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';

        // Endpoint: GET /api/tts/stats (for Admin Dashboard)
        if (req.method === 'GET' && url === '/api/tts/stats') {
          res.setHeader('Content-Type', 'application/json');
          res.writeHead(200);
          res.end(
            JSON.stringify({
              ...ttsStats,
              cachedClipsCount: ttsServerCache.size,
              provider: 'Sarvam AI Bulbul v3',
              status: 'active',
            })
          );
          return;
        }

        // Endpoint: POST /api/tts (Proxy for Text-to-Speech)
        if (req.method === 'POST' && url === '/api/tts') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });

          req.on('end', async () => {
            try {
              ttsStats.totalRequests++;
              const parsed = JSON.parse(body || '{}');
              const text = (parsed.text || '').trim();
              const langCode = parsed.langCode || 'hi-IN';
              const speaker = parsed.speaker || 'rupali';

              if (!text) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Text parameter is required' }));
                return;
              }

              const cacheKey = `${langCode}_${speaker}_${text.toLowerCase()}`;

              // Check server-side cache
              if (ttsServerCache.has(cacheKey)) {
                ttsStats.cacheHits++;
                const cachedBase64 = ttsServerCache.get(cacheKey);
                res.writeHead(200, {
                  'Content-Type': 'application/json',
                  'X-TTS-Cache': 'HIT',
                });
                res.end(JSON.stringify({ audios: [cachedBase64], cached: true }));
                return;
              }

              ttsStats.cacheMisses++;

              // Call Sarvam AI Bulbul v3 API from backend
              const sarvamRes = await fetch('https://api.sarvam.ai/text-to-speech', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'api-subscription-key': SARVAM_API_KEY,
                },
                body: JSON.stringify({
                  inputs: [text],
                  target_language_code: langCode,
                  speaker: speaker,
                  pitch: 0,
                  pace: 0.92,
                  loudness: 1.4,
                  speech_sample_rate: 22050,
                  enable_preprocessing: true,
                  model: 'bulbul:v3',
                }),
              });

              if (!sarvamRes.ok) {
                ttsStats.errors++;
                const errBody = await sarvamRes.text();
                res.writeHead(sarvamRes.status, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: `Sarvam API error: ${sarvamRes.status}`, details: errBody }));
                return;
              }

              const data = await sarvamRes.json();
              if (data && data.audios && data.audios[0]) {
                const base64Wav = data.audios[0];
                ttsServerCache.set(cacheKey, base64Wav);
                res.writeHead(200, {
                  'Content-Type': 'application/json',
                  'X-TTS-Cache': 'MISS',
                });
                res.end(JSON.stringify({ audios: [base64Wav], cached: false }));
                return;
              }

              ttsStats.errors++;
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'No audio returned by Sarvam AI' }));
            } catch (err) {
              ttsStats.errors++;
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message || 'Internal TTS proxy error' }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), ttsBackendPlugin()],
  server: {
    port: 5173,
    host: '127.0.0.1',
  },
});
