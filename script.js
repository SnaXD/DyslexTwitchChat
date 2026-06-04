// Twitch API configuration
let currentChannel = null;
let chatWebSocket = null;
let fontSize = 18;

// DOM Elements
const channelInput = document.getElementById('channelInput');
const connectBtn = document.getElementById('connectBtn');
const fontSizeSlider = document.getElementById('fontSizeSlider');
const fontSizeDisplay = document.getElementById('fontSizeDisplay');
const chatMessages = document.getElementById('chatMessages');
const statusText = document.getElementById('statusText');

// Font size control
fontSizeSlider.addEventListener('input', (e) => {
    fontSize = parseInt(e.target.value);
    fontSizeDisplay.textContent = fontSize + 'px';
    updateChatFontSize();
});

function updateChatFontSize() {
    const messages = document.querySelectorAll('.chat-message');
    messages.forEach(msg => {
        msg.style.fontSize = fontSize + 'px';
    });
}

// Connect to Twitch chat
connectBtn.addEventListener('click', () => {
    const channel = channelInput.value.trim();
    if (!channel) {
        setStatus('Please enter a channel name', 'error');
        return;
    }
    connectToChannel(channel);
});

function connectToChannel(channel) {
    currentChannel = channel.toLowerCase();
    setStatus(`Connecting to ${channel}...`, '');
    
    // Close existing connection
    if (chatWebSocket) {
        chatWebSocket.close();
    }
    
    // Clear chat
    chatMessages.innerHTML = '';
    
    // Connect to Twitch chat via IRC
    chatWebSocket = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
    
    chatWebSocket.onopen = () => {
        // Send connection commands
        chatWebSocket.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
        chatWebSocket.send('PASS SCHMOOPIIE');
        chatWebSocket.send('NICK justinfan12345');
        chatWebSocket.send(`JOIN #${currentChannel}`);
        setStatus(`Connected to #${currentChannel}`, 'connected');
    };
    
    chatWebSocket.onmessage = (event) => {
        handleChatMessage(event.data);
    };
    
    chatWebSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setStatus('Connection error', 'error');
    };
    
    chatWebSocket.onclose = () => {
        setStatus('Disconnected', 'error');
    };
}

function handleChatMessage(rawMessage) {
    // Parse IRC message
    const lines = rawMessage.split('\r\n');
    
    lines.forEach(line => {
        if (line.includes('PRIVMSG')) {
            const match = line.match(/:([^!]+)!.+PRIVMSG #\w+ :(.+)/);
            if (match) {
                const author = match[1];
                const message = match[2];
                displayMessage(author, message);
            }
        }
        
        // Respond to PING to keep connection alive
        if (line === 'PING :tmi.twitch.tv') {
            chatWebSocket.send('PONG :tmi.twitch.tv');
        }
    });
}

function displayMessage(author, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message';
    messageDiv.style.fontSize = fontSize + 'px';
    
    const authorSpan = document.createElement('div');
    authorSpan.className = 'message-author';
    authorSpan.textContent = author + ':';
    
    const textSpan = document.createElement('div');
    textSpan.className = 'message-text';
    textSpan.textContent = text;
    
    messageDiv.appendChild(authorSpan);
    messageDiv.appendChild(textSpan);
    
    chatMessages.appendChild(messageDiv);
    
    // Auto-scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Keep only last 100 messages for performance
    if (chatMessages.children.length > 100) {
        chatMessages.removeChild(chatMessages.firstChild);
    }
}

function setStatus(message, status) {
    statusText.textContent = message;
    statusText.className = status;
}

// Allow Enter key to connect
channelInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        connectBtn.click();
    }
});

// Initialize
setStatus('Ready to connect', '');
