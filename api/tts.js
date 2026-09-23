// Vercel Serverless Function: POST /api/tts
// Proxies text-to-speech requests to Sarvam AI Bulbul v3 with zero client-side secret exposure

const SARVAM_API_KEY = process.env.SARVAM_API_KEY || 'sk_qkx76qdz_xn8XH22i1J27UMaQmEtN9zn4';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({
      status: 'active',
      provider: 'Sarvam AI Bulbul v3 Cloud TTS',
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
    return;
  }

  try {
    const { text, langCode = 'hi-IN', speaker = 'rupali' } = req.body || {};

    if (!text || !text.trim()) {
      res.status(400).json({ error: 'Text parameter is required.' });
      return;
    }

    const cleanText = text.trim();

    const sarvamRes = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': SARVAM_API_KEY,
      },
      body: JSON.stringify({
        inputs: [cleanText],
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
      const errorText = await sarvamRes.text();
      res.status(sarvamRes.status).json({
        error: `Sarvam API error (${sarvamRes.status})`,
        details: errorText,
      });
      return;
    }

    const data = await sarvamRes.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('TTS handler error:', error);
    res.status(500).json({ error: 'Internal Server Error during TTS synthesis', message: error.message });
  }
}
