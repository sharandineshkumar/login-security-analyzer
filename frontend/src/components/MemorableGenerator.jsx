import { useState } from 'react';
import './MemorableGenerator.css';

// Word lists for generating memorable passwords
const ADJECTIVES = [
  'Happy', 'Swift', 'Brave', 'Clever', 'Mighty', 'Silent', 'Golden', 'Cosmic',
  'Wild', 'Fierce', 'Noble', 'Mystic', 'Royal', 'Shadow', 'Thunder', 'Crystal'
];

const NOUNS = [
  'Tiger', 'Eagle', 'Dragon', 'Phoenix', 'Wolf', 'Falcon', 'Lion', 'Panther',
  'Hawk', 'Cobra', 'Shark', 'Raven', 'Fox', 'Bear', 'Owl', 'Jaguar'
];

const VERBS = [
  'Runs', 'Flies', 'Jumps', 'Dances', 'Rides', 'Swims', 'Climbs', 'Soars'
];

const PLACES = [
  'Moon', 'Mars', 'Ocean', 'Mountain', 'Forest', 'Desert', 'Galaxy', 'Island'
];

const SYMBOLS = ['!', '@', '#', '$', '%', '&', '*', '?'];

function MemorableGenerator({ onGenerate }) {
  const [password, setPassword] = useState('');
  const [story, setStory] = useState('');
  const [emojis, setEmojis] = useState('');
  const [copied, setCopied] = useState(false);
  const [style, setStyle] = useState('phrase'); // phrase, story, pattern

  const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const getRandomNumber = () => Math.floor(Math.random() * 90) + 10;

  const generatePassword = () => {
    let newPassword = '';
    let newStory = '';
    let newEmojis = '';

    if (style === 'phrase') {
      // Format: Adjective-Noun-Number-Symbol
      const adj = getRandomItem(ADJECTIVES);
      const noun = getRandomItem(NOUNS);
      const num = getRandomNumber();
      const symbol = getRandomItem(SYMBOLS);
      
      newPassword = `${adj}-${noun}-${num}${symbol}`;
      newStory = `A ${adj.toLowerCase()} ${noun.toLowerCase()} appeared in the year '${num}!`;
      newEmojis = getEmojiForWord(adj) + ' ' + getEmojiForWord(noun) + ' 🔢';
    } 
    else if (style === 'story') {
      // Format: Noun-Verb-Place-Number-Symbol
      const noun = getRandomItem(NOUNS);
      const verb = getRandomItem(VERBS);
      const place = getRandomItem(PLACES);
      const num = getRandomNumber();
      const symbol = getRandomItem(SYMBOLS);
      
      newPassword = `${noun}${verb}To${place}${num}${symbol}`;
      newStory = `The ${noun.toLowerCase()} ${verb.toLowerCase()} to the ${place.toLowerCase()} in ${num}!`;
      newEmojis = getEmojiForWord(noun) + ' ➡️ ' + getEmojiForWord(place);
    }
    else if (style === 'pattern') {
      // Format: Word-Word-Word-Number
      const words = [getRandomItem(ADJECTIVES), getRandomItem(NOUNS), getRandomItem(PLACES)];
      const num = getRandomNumber();
      
      newPassword = words.join('-') + num + getRandomItem(SYMBOLS);
      newStory = `${words[0]} ${words[1].toLowerCase()} on ${words[2].toLowerCase()}, chapter ${num}`;
      newEmojis = words.map(w => getEmojiForWord(w)).join(' ');
    }

    setPassword(newPassword);
    setStory(newStory);
    setEmojis(newEmojis);
    
    if (onGenerate) {
      onGenerate(newPassword);
    }
  };

  const getEmojiForWord = (word) => {
    const emojiMap = {
      // Adjectives
      'Happy': '😊', 'Swift': '⚡', 'Brave': '💪', 'Clever': '🧠', 'Mighty': '🦸',
      'Silent': '🤫', 'Golden': '✨', 'Cosmic': '🌌', 'Wild': '🌿', 'Fierce': '🔥',
      'Noble': '👑', 'Mystic': '🔮', 'Royal': '🏰', 'Shadow': '👤', 'Thunder': '⛈️',
      'Crystal': '💎',
      // Nouns
      'Tiger': '🐅', 'Eagle': '🦅', 'Dragon': '🐉', 'Phoenix': '🔥', 'Wolf': '🐺',
      'Falcon': '🦅', 'Lion': '🦁', 'Panther': '🐆', 'Hawk': '🦅', 'Cobra': '🐍',
      'Shark': '🦈', 'Raven': '🐦‍⬛', 'Fox': '🦊', 'Bear': '🐻', 'Owl': '🦉', 'Jaguar': '🐆',
      // Places
      'Moon': '🌙', 'Mars': '🔴', 'Ocean': '🌊', 'Mountain': '🏔️', 'Forest': '🌲',
      'Desert': '🏜️', 'Galaxy': '🌌', 'Island': '🏝️'
    };
    return emojiMap[word] || '✨';
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUse = () => {
    if (onGenerate && password) {
      onGenerate(password);
    }
  };

  return (
    <div className="memorable-generator">
      <div className="memorable-header">
        <div className="header-icon">🧠</div>
        <div className="header-text">
          <h3>AI Memorable Password</h3>
          <p>Easy to remember, hard to crack</p>
        </div>
      </div>

      <div className="style-selector">
        <button 
          className={`style-btn ${style === 'phrase' ? 'active' : ''}`}
          onClick={() => setStyle('phrase')}
        >
          📝 Phrase
        </button>
        <button 
          className={`style-btn ${style === 'story' ? 'active' : ''}`}
          onClick={() => setStyle('story')}
        >
          📖 Story
        </button>
        <button 
          className={`style-btn ${style === 'pattern' ? 'active' : ''}`}
          onClick={() => setStyle('pattern')}
        >
          🎯 Pattern
        </button>
      </div>

      <button className="generate-memorable-btn" onClick={generatePassword}>
        <span className="btn-sparkle">✨</span>
        Generate Memorable Password
        <span className="btn-sparkle">✨</span>
      </button>

      {password && (
        <div className="memorable-result">
          <div className="result-password-display">
            <code>{password}</code>
            <div className="password-strength">
              <span className="strength-badge">💪 STRONG</span>
            </div>
          </div>

          <div className="memory-trick">
            <div className="trick-header">
              <span className="trick-icon">🧠</span>
              <span className="trick-label">Memory Trick</span>
            </div>
            <p className="trick-story">{story}</p>
            <div className="trick-emojis">{emojis}</div>
          </div>

          <div className="memorable-actions">
            <button className="action-btn copy" onClick={handleCopy}>
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
            <button className="action-btn use" onClick={handleUse}>
              🔍 Analyze
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MemorableGenerator;
