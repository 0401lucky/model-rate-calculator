import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefix?: string;
  variant?: 'default' | 'indigo' | 'blue' | 'purple' | 'emerald';
}

const variantStyles = {
  default: 'focus:ring-indigo-500/20 focus:border-indigo-500',
  indigo: 'focus:ring-indigo-500/20 focus:border-indigo-500',
  blue: 'focus:ring-blue-500/20 focus:border-blue-500',
  purple: 'focus:ring-purple-500/20 focus:border-purple-500',
  emerald: 'focus:ring-emerald-500/20 focus:border-emerald-500 border-emerald-200',
};

const labelVariantStyles = {
  default: 'group-focus-within:text-indigo-600',
  indigo: 'group-focus-within:text-indigo-600',
  blue: 'group-focus-within:text-blue-600',
  purple: 'group-focus-within:text-purple-600',
  emerald: 'text-emerald-600',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, prefix, variant = 'default', className = '', ...props }, ref) => {
    const inputClasses = `w-full bg-white border border-gray-200 rounded-lg py-2.5 ${
      prefix ? 'pl-7' : 'px-3'
    } pr-3 text-slate-900 focus:outline-none focus:ring-2 transition-all font-mono shadow-sm ${
      variantStyles[variant]
    } ${className}`;

    return (
      <div className="group">
        {label && (
          <label className={`block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide transition-colors ${labelVariantStyles[variant]}`}>
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
              {prefix}
            </span>
          )}
          <input ref={ref} className={inputClasses} {...props} />
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
