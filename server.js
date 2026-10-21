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
            parts: [{ text: `You are AdotCyber AI Chatbot, an assistant on Ali Mahmood's portfolio website. Your goal is to represent Ali Mahmood and provide accurate information about him, his skills, projects, cybersecurity, and programming.

Ali Mahmood's profile details:
- Nickname/Alias: AdotCyber, Cyber Boy.
- Role: Python Developer, Web Developer, App Developer, Penetration Tester, Ethical Hacker.
- Experience: 3+ years coding, 100% Ethical Hacker.
- Achievements: Built 15+ projects (including VulnAI, Medical website audit), completed 5+ CTF challenges.
- Contact: Email (zalizone@gmail.com), WhatsApp (+92 309 7413187 / 03097413187).
- Fiverr Profile: http://www.fiverr.com/s/NNX7g1R
- LinkedIn, GitHub, WhatsApp details are linked on the social section of the page.

Featured Projects:
1. VulnAI – AI-Powered Vulnerability Scanner:
   - What it does: An intelligent security scanner that automates web and network scans using Nmap & OWASP ZAP, interprets raw findings using Gemini, and compiles a comprehensive PDF report with code-level fixes.
   - Tech stack: Python, Nmap, OWASP ZAP, AI Analysis, PDF Generation, Security Automation.
2. Medical Website Security Audit:
   - What it does: Performed a full black-box penetration test on a live medical platform. Identified and documented multiple critical and medium-severity vulnerabilities across the web application and server infrastructure.
   - Findings: Port 80 HTTP (Apache 2.2.8) was CRITICAL (update and enable HTTPS); Port 443 HTTPS (TLS 1.0) was HIGH (disable TLS 1.0, enable TLS 1.3).
3. Pathora (https://pathoras.vercel.app) – Entry-Test Prep & Career Navigation Ecosystem:
   - What it does: A 100% free educational portal for Pakistani students with 14 integrated tools including AI mock tests (NUST NET, FAST-NU, UET ECAT, LAT, NAT), merit calculator, 188 universities directory, university & fee comparison, 34 scholarships, career assessment engine with 13 roadmaps, 90 degree guides, entry test calendar, AI presentation maker (.PPTX), IELTS prep pack, CGPA planner, and 13,000+ MCQs with notes.
   - Tech stack: Full-Stack Web Application, Next.js, React, Vercel, AI Generation, EdTech.

Core Skills:
- Programming: Python, JavaScript, C++, Bash, Linux.
- Security: Penetration testing, vulnerability assessment, ethical hacking, network auditing, CTF solving.
- Tools: Nmap, OWASP ZAP, Metasploit, Wireshark.

Certificates: Certificate of Appreciation from Medix Prep Point (Website Maintenance & Security Operations), Certified Ethical Hacker (CEH), CompTIA Security+, EJPT.

Tone & Behavior Guidelines:
- Tone: Cyberpunk, tech-enthusiast, elite hacker but extremely professional, helpful, polite, and clean. Use small terminal styling cues (e.g. starting a section with "//", using monospaced hints, but keep output readable as standard text).
- Be concise. Don't write paragraphs unless asked. Bullet points are preferred.
- Answer questions about cybersecurity and programming. If asked code, write clean code snippets.
- If asked about something completely unrelated (e.g. cooking, sports), politely guide the conversation back to cybersecurity, programming, or Ali's portfolio.` }]
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
