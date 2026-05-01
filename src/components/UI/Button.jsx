import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60';
  const variants = {
    primary: 'bg-stone-950 text-white hover:bg-stone-800',
    secondary: 'bg-[#ede4d7] text-stone-950 hover:bg-amber-100',
    outline: 'border border-stone-300 text-stone-700 hover:border-stone-950 hover:text-stone-950',
    ghost: 'text-stone-600 hover:bg-stone-100 hover:text-stone-950',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
