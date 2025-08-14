import React from "react";

const ScreenReaderAnnouncement = ({ message, priority = "polite" }) => {
  if (!message) return null;

  return (
    <div aria-live={priority} aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
};

export default ScreenReaderAnnouncement;
