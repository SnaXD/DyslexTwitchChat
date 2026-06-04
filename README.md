# Dyslexic Twitch Chat

A simple, dyslexic-friendly Twitch chat viewer with adjustable font sizes and a clean interface.

## Features

- 📖 **Dyslexic-Friendly Font**: Uses OpenDyslexic font for better readability
- 🔤 **Adjustable Font Size**: Slider to adjust text size from 12px to 40px
- 💙 **Clean UI**: High contrast, easy-to-read interface
- ⚡ **Live Chat**: Real-time Twitch chat streaming
- 📱 **Responsive**: Works on desktop and mobile devices

## How to Use

1. Open `index.html` in your web browser
2. Enter a Twitch channel name (e.g., "channels" without the #)
3. Click "Connect" to start viewing the live chat
4. Use the font size slider to adjust text size to your preference

## Files

- `index.html` - Main HTML file with chat interface
- `styles.css` - Styling with OpenDyslexic font integration
- `script.js` - JavaScript for Twitch IRC chat connection and message handling

## Requirements

- Modern web browser with WebSocket support
- Internet connection
- Twitch channel name

## Technical Details

The app connects to Twitch chat via their IRC WebSocket interface. It displays messages in a scrolling chat window with dyslexic-friendly formatting.

### Font Size

Use the slider at the top to adjust font size between 12px and 40px. Changes apply immediately to all displayed messages.

## Browser Support

- Chrome/Chromium
- Firefox
- Safari
- Edge

## Notes

- The app uses anonymous Twitch chat (no authentication required)
- Only displays new messages after connection
- Keeps the last 100 messages for performance
