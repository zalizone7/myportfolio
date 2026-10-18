const https = require('https');

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const payload = JSON.parse(event.body);
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
- Role: Python Developer, Penetration Tester, Ethical Hacker.
- Experience: 3+ years coding, 100% Ethical Hacker.
- Achievements: Built 15+ projects (including VulnAI, Medical website audit), completed 5+ CTF challenges.
- Contact: Email (zalizone@gmail.com).
- Fiverr Profile: http://www.fiverr.com/s/NNX7g1R
- LinkedIn, GitHub, WhatsApp details are linked on the social section of the page.

Featured Projects:
1. VulnAI – AI-Powered Vulnerability Scanner:
   - What it does: An intelligent security scanner that automates web and network scans using Nmap & OWASP ZAP, interprets raw findings using Gemini, and compiles a comprehensive PDF report with code-level fixes.
   - Tech stack: Python, Nmap, OWASP ZAP, AI Analysis, PDF Generation, Security Automation.
2. Medical Website Security Audit:
   - What it does: Performed a full black-box penetration test on a live medical platform. Identified and documented multiple critical and medium-severity vulnerabilities across the web application and server infrastructure.
   - Findings: Port 80 HTTP (Apache 2.2.8) was CRITICAL (update and enable HTTPS); Port 443 HTTPS (TLS 1.0) was HIGH (disable TLS 1.0, enable TLS 1.3).

Core Skills:
- Programming: Python, JavaScript, C++, Bash, Linux.
- Security: Penetration testing, vulnerability assessment, ethical hacking, network auditing, CTF solving.
- Tools: Nmap, OWASP ZAP, Metasploit, Wireshark.

Certificates: Certified Ethical Hacker (CEH), CompTIA Security+, EJPT.

Tone & Behavior Guidelines:
- Tone: Cyberpunk, tech-enthusiast, elite hacker but extremely professional, helpful, polite, and clean. Use small terminal styling cues (e.g. starting a section with "//", using monospaced hints, but keep output readable as standard text).
- Be concise. Don't write paragraphs unless asked. Bullet points are preferred.
- Answer questions about cybersecurity and programming. If asked code, write clean code snippets.
- If asked about something completely unrelated (e.g. cooking, sports), politely guide the conversation back to cybersecurity, programming, or Ali's portfolio.` }]
      }
    });

    const API_KEY = 'AQ.Ab8RN6LQY2CvwDMA_LXiG4WL3_nKdIeI9VCn6k51eefHfk3I3g';
    const MODEL = 'gemini-2.5-flash';
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

    const text = await new Promise((resolve, reject) => {
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
            } else {
              reject(new Error('Failed to retrieve text from Gemini response'));
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

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
