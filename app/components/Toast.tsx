'use client';

import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, duration = 2000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade-out animation before calling onClose
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className={`
        bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg
        flex items-center justify-between
        transition-opacity duration-300 ease-in-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}>
        <span className="mr-4">{message}</span>
        <button title='submit'
          onClick={() => setIsVisible(false)}
          className="text-white focus:outline-none"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;