import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'dark' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles = {
  default: 'bg-white border-gray-200 shadow-sm',
  dark: 'bg-slate-900 border-slate-800 shadow-xl',
  gradient: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-sm',
};

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', padding = 'md', className = '', ...props }, ref) => {
    const cardClasses = `rounded-xl border ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`;

    return (
      <div ref={ref} className={cardClasses} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
  variant?: 'default' | 'dark';
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, icon, action, variant = 'default', className = '', ...props }, ref) => {
    const titleColor = variant === 'dark' ? 'text-indigo-300' : 'text-slate-800';
    
    return (
      <div ref={ref} className={`flex justify-between items-center mb-6 ${className}`} {...props}>
        <h3 className={`text-lg font-semibold ${titleColor} flex items-center gap-2`}>
          {icon}
          {title}
        </h3>
        {action}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export default Card;
