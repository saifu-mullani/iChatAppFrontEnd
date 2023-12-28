import React from 'react';

const StickerPicker = ({ onSelect }) => {
  const stickers = [
    'sticker1.png',
    'sticker2.png',
    'sticker3.png',
    // Add more sticker images as needed
  ];

  return (
    <div className="sticker-picker">
      {stickers.map((sticker, index) => (
        <img
          key={index}
          src={`/path/to/stickers/${sticker}`}
          alt={`Sticker ${index + 1}`}
          onClick={() => onSelect(sticker)}
        />
      ))}
    </div>
  );
};

export default StickerPicker;
