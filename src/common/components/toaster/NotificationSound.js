import React from 'react';

const NotificationSound = () => {
  return (
    <audio id="notificationSound" preload="auto">
      <source src="/sound/hike_messenger.mp3" type="audio/mp3" />
      {/* Add additional source elements for different audio formats */}
      Your browser does not support the audio element.
    </audio>
  );
};

export default NotificationSound;
