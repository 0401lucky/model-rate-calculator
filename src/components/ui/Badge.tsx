import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'openai' | 'anthropic' | 'google' | 'deepseek' | 'mistral';
  size?: 'sm' | 'md';
}

const variantStyles = {
  default: 'bg-gray-100 text-slate-700 border-gray-200',
  openai: 'bg-green-50 text-green-700 border-green-200',
  anthropic: 'bg-purple-50 text-purple-700 border-purple-200',
  google: 'bg-blue-50 text-blue-700 border-blue-200',
  deepseek: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  mistral: 'bg-orange-50 text-orange-700 border-orange-200',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs leading-5',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'default', size = 'md', className = '', ...props }, ref) => {
    const badgeClasses = `inline-flex font-medium rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    return (
      <span ref={ref} className={badgeClasses} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// 根据 provider 名称自动选择变体的辅助函数
export function getProviderVariant(provider: string): BadgeProps['variant'] {
  const providerMap: Record<string, BadgeProps['variant']> = {
    'OpenAI': 'openai',
    'Anthropic': 'anthropic',
    'Google': 'google',
    'DeepSeek': 'deepseek',
    'Mistral': 'mistral',
  };
  return providerMap[provider] || 'default';
}

export default Badge;
