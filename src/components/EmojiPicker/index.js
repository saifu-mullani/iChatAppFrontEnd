import React, { useState } from 'react';
// import 'emoji-mart/css/emoji-mart.css';
import  Picker  from 'emoji-picker-react';


const EmojiPicker = ({ onSelect }) => {
  const [emoji, setEmoji] = useState(null);

  const handleSelect = (chosenEmoji) => {
    setEmoji(chosenEmoji);
    onSelect(chosenEmoji.emoji);
  };

  return (
    <div>
      <Picker onEmojiClick={handleSelect} />
      {emoji && <p>You selected: {emoji.emoji}</p>}
    </div>
  );
};

export default EmojiPicker;
