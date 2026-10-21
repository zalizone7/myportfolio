const http = require('http');
const https = require('https');
const fs   = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

http.createServer((req, res) => {
  // Chat API Proxy Endpoint
  if (req.method === 'POST' && req.url === '/api/chat') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
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
- Contact & Resume: WhatsApp (+92 309 7413187), Email (zalizone@gmail.com), Fiverr. Official CV (PDF) is downloadable directly via the "DOWNLOAD CV" button on the page.
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

        (async () => {
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

          if (text) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ text }));
          } else {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: lastError ? lastError.message : 'All AI models unreachable' }));
          }
        })();

      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON request' }));
      }
    });
    return;
  }

  // Static File Serving
  let parsedUrl = req.url.split('?')[0];
  let url = parsedUrl === '/' ? '/index.html' : parsedUrl;
  const filePath = path.join(ROOT, url);
  const ext      = path.extname(filePath);
  const mime     = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('404 – File not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`\n  ✅  ADOT Portfolio running at:\n`);
  console.log(`     http://localhost:${PORT}\n`);
});
