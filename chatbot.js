document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('chatbot-toggle');
  const chatWindow = document.getElementById('chat-window');
  const closeBtn = document.getElementById('chat-close');
  const messagesBox = document.getElementById('chat-messages');
  const inputForm = document.getElementById('chat-input-form');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');
  const suggestions = document.querySelectorAll('.suggestion-chip');

  let history = [];

  // Toggle chat window
  toggleBtn.addEventListener('click', () => {
    chatWindow.classList.add('active');
    toggleBtn.classList.add('inactive');
    chatInput.focus();
    // Scroll to bottom on open
    messagesBox.scrollTop = messagesBox.scrollHeight;
  });

  closeBtn.addEventListener('click', () => {
    chatWindow.classList.remove('active');
    toggleBtn.classList.remove('inactive');
  });

  // Handle outside click to close
  document.addEventListener('click', (e) => {
    if (!chatWindow.contains(e.target) && !toggleBtn.contains(e.target) && chatWindow.classList.contains('active')) {
      chatWindow.classList.remove('active');
      toggleBtn.classList.remove('inactive');
    }
  });

  // Add initial welcome message if empty
  if (messagesBox.children.length === 0) {
    appendMessage('bot', 'AdotCyber AI online. Ask me anything about Ali, his projects, or tech skills!');
  }

  // Handle Form Submission
  inputForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const messageText = chatInput.value.trim();
    if (!messageText) return;

    // Append user message
    appendMessage('user', messageText);
    chatInput.value = '';
    chatInput.focus();

    // Show bot typing indicator
    const typingIndicator = appendTypingIndicator();

    // Disable input while loading
    chatInput.disabled = true;
    sendBtn.disabled = true;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: messageText,
          history: history
        })
      });

      const data = await response.json();
      removeTypingIndicator(typingIndicator);

      if (response.ok && data.text) {
        appendMessage('bot', data.text);
        // Save to history
        history.push({ role: 'user', text: messageText });
        history.push({ role: 'bot', text: data.text });
      } else {
        const errorMsg = data && data.error ? data.error : 'Could not parse response from central terminal.';
        appendMessage('bot', `System Alert: Secure channel failure. [${errorMsg}]`);
      }
    } catch (err) {
      removeTypingIndicator(typingIndicator);
      appendMessage('bot', 'System Alert: Connection timeout. Ensure local network route is active.');
      console.error(err);
    } finally {
      chatInput.disabled = false;
      sendBtn.disabled = false;
      chatInput.focus();
    }
  });

  // Handle Suggestion Chips click
  suggestions.forEach(chip => {
    chip.addEventListener('click', () => {
      chatInput.value = chip.getAttribute('data-msg');
      inputForm.dispatchEvent(new Event('submit'));
    });
  });

  // Helper: Append Message DOM
  function appendMessage(sender, text) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('msg-wrapper', sender);

    const label = document.createElement('span');
    label.classList.add('msg-sender');
    label.textContent = sender === 'bot' ? 'adotcyber_ai:~$' : 'visitor:~$';

    const textEl = document.createElement('div');
    textEl.classList.add('msg-text');
    
    // Replace newlines with <br> and format markdown bullet points simple replacements
    let formattedText = escapeHtml(text)
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^\* (.*?)$/gm, '• $1')
      .replace(/^- (.*?)$/gm, '• $1');

    textEl.innerHTML = formattedText;

    wrapper.appendChild(label);
    wrapper.appendChild(textEl);
    messagesBox.appendChild(wrapper);

    // Scroll to bottom smoothly
    messagesBox.scrollTo({ top: messagesBox.scrollHeight, behavior: 'smooth' });
  }

  // Helper: Show Typing Animation
  function appendTypingIndicator() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('msg-wrapper', 'bot', 'typing-wrapper');

    const label = document.createElement('span');
    label.classList.add('msg-sender');
    label.textContent = 'adotcyber_ai:~$';

    const textEl = document.createElement('div');
    textEl.classList.add('msg-text');

    const dots = document.createElement('div');
    dots.classList.add('typing-dots');
    dots.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;

    textEl.appendChild(dots);
    wrapper.appendChild(label);
    wrapper.appendChild(textEl);
    messagesBox.appendChild(wrapper);
    messagesBox.scrollTop = messagesBox.scrollHeight;

    return wrapper;
  }

  function removeTypingIndicator(element) {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }

  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Register chatbot toggle and elements to cursor hover
  if (window.ring) {
    document.querySelectorAll('.chatbot-toggle, .chat-close, .suggestion-chip, .chat-send-btn').forEach(el => {
      el.addEventListener('mouseenter', () => window.ring.classList.add('hovering'));
      el.addEventListener('mouseleave', () => window.ring.classList.remove('hovering'));
    });
  }
});
