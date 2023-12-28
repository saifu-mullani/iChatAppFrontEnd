import React, { useState } from 'react';
import EmojiPicker from './index';

const MyComponent = () => {
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji);
  };

  return (
    <div>
      <h1>My React App</h1>
      <EmojiPicker onSelect={handleEmojiSelect} />
      {selectedEmoji && <p>Selected Emoji: {selectedEmoji}</p>}
    </div>
  );
};

export default MyComponent;
