import React, { useState, forwardRef, useImperativeHandle } from 'react';
import '../../styles/Toast.css';

const Toast = forwardRef((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  useImperativeHandle(ref, () => ({
    showToast: (msg) => {
      setMessage(msg);
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
      }, 3000);  // Hide after 3 seconds
    }
  }));

  return (
    <div className={`toast ${visible ? 'show' : ''}`}>
      {message}
    </div>
  );
});

export default Toast;
