import React, { useState } from 'react';
import './Notification.css'; // Import your CSS file

const Notification = ({ message, visible = false,typ = 'alert-success' }) => {



  return (
    visible && (
      <div className="notification">
        <div className={`alert ${typ}`}>{message}</div>
      </div>
    )
  );
};

export default Notification;
