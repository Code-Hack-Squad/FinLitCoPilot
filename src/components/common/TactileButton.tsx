import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { haptics } from '../../utils/haptics';

interface TactileButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  hapticIntensity?: 'light' | 'medium' | 'heavy';
}

export const TactileButton: React.FC<TactileButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  children,
  className = '',
  onClick,
  hapticIntensity = 'light',
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    haptics.tap(hapticIntensity);
    if (onClick) onClick(e);
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
    md: 'px-4 py-2 text-sm rounded-lg gap-2',
    lg: 'px-5 py-2.5 text-sm font-medium rounded-lg gap-2.5',
  }[size];

  const variantStyles = {
    primary:
      'bg-blue-600 hover:bg-blue-700 text-white font-medium border border-blue-500 shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500/50',
    secondary:
      'bg-white dark:bg-[#1A222E] hover:bg-slate-50 dark:hover:bg-[#202B3B] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-white/10 shadow-xs focus-visible:ring-2 focus-visible:ring-blue-500/50',
    outline:
      'bg-transparent hover:bg-slate-100/70 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10',
    danger:
      'bg-red-500 hover:bg-red-600 text-white font-medium border border-red-600 focus-visible:ring-2 focus-visible:ring-red-500/50',
    ghost:
      'bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
  }[variant];

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      onClick={handleClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center select-none font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap focus-visible:outline-none ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
