const https = require('https');

module.exports = async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const userMessage = payload.message;
    const history = payload.history || [];

    // Format history for Gemini API model role mapping
    const contents = history.map(item => ({
      role: item.role === 'bot' ? 'model' : 'user',
      parts: [{ text: item.text }]
    }));

    // Append current message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const geminiPayload = JSON.stringify({
      contents: contents,
      systemInstruction: {
        parts: [{ text: `You are AdotCyber AI, an assistant on Ali Mahmood's portfolio website.

CRITICAL RULE – STRICT NO-SCROLL LENGTH LIMIT:
- The user is using a compact floating chat widget. They DISLIKE long messages and scrolling.
- Keep EVERY answer strictly within 1 to 3 short sentences (maximum 30 to 40 words total).
- NEVER output status headers like "// SYSTEM: CONNECTING...", "// STATUS: ONLINE", or ASCII art.
- NEVER write long paragraphs or long lists. Get straight to the point.

Ali Mahmood's Quick Bio:
- Ali Mahmood (AdotCyber, Cyber Boy): Python Developer, Web Developer, App Developer, Penetration Tester & Ethical Hacker (3+ years experience, 15+ projects).
- Top Projects: VulnAI (AI-powered vulnerability scanner), Pathora (pakistani entry-test portal with 14 tools at pathoras.vercel.app), and Medical Website Security Audit.
- Core Skills: Python, JavaScript, C++, Pentesting, Nmap, OWASP ZAP, Metasploit, CTFs.
- Contact: WhatsApp (+92 309 7413187), Email (zalizone@gmail.com), Fiverr (http://www.fiverr.com/s/NNX7g1R).
- Certs: CEH, CompTIA Security+, EJPT, Medix Prep Point Appreciation.

Tone: Tech-savvy, elite cyber hacker, direct, polite, punchy.` }]
      },
      generationConfig: {
        maxOutputTokens: 90,
        temperature: 0.5
      }
    });

    const DEFAULT_KEY = Buffer.from('QVEuQWI4Uk42S0FXTEhxbTBLcG5RZVhYZnpaSlZ4OVJybV9rR1ZfeWJQMFVITlBma2M1Z1E=', 'base64').toString('utf-8');
    const API_KEY = process.env.GEMINI_API_KEY || DEFAULT_KEY;
    const MODELS = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.8-flash'];

    const callModel = (model) => new Promise((resolve, reject) => {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
      const geminiReq = https.request(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }, (geminiRes) => {
        let geminiData = '';
        geminiRes.on('data', chunk => geminiData += chunk);
        geminiRes.on('end', () => {
          try {
            const geminiParsed = JSON.parse(geminiData);
            if (geminiParsed.candidates && geminiParsed.candidates[0] && geminiParsed.candidates[0].content) {
              resolve(geminiParsed.candidates[0].content.parts[0].text);
            } else if (geminiParsed.error) {
              reject(new Error(geminiParsed.error.message || `Error from ${model}`));
            } else {
              reject(new Error(`Failed to retrieve text from ${model}`));
            }
          } catch (err) {
            reject(err);
          }
        });
      });

      geminiReq.on('error', reject);
      geminiReq.write(geminiPayload);
      geminiReq.end();
    });

    let text = null;
    let lastError = null;
    for (const model of MODELS) {
      try {
        text = await callModel(model);
        if (text) break;
      } catch (err) {
        lastError = err;
      }
    }

    if (!text) {
      throw lastError || new Error('All AI service models are currently unreachable.');
    }

    return res.status(200).json({ text });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
