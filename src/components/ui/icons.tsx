import type { SVGAttributes } from 'react';
import { memo } from 'react';

interface IconProps extends SVGAttributes<SVGSVGElement> {
  size?: number | string;
}

// GitHub Icon
export const GitHubIcon = memo(({ size = 16, className = '', ...props }: IconProps) => (
  <svg 
    className={`w-${size} h-${size} ${className}`} 
    fill="currentColor" 
    viewBox="0 0 24 24" 
    aria-hidden="true"
    {...props}
  >
    <path 
      fillRule="evenodd" 
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" 
      clipRule="evenodd" 
    />
  </svg>
));
GitHubIcon.displayName = 'GitHubIcon';

// Search Icon
export const SearchIcon = memo(({ size = 20, className = '', ...props }: IconProps) => (
  <svg 
    className={`w-${size} h-${size} ${className}`} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
    />
  </svg>
));
SearchIcon.displayName = 'SearchIcon';

// Exchange/Swap Icon
export const ExchangeIcon = memo(({ size = 20, className = '', ...props }: IconProps) => (
  <svg 
    className={`w-${size} h-${size} ${className}`} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" 
    />
  </svg>
));
ExchangeIcon.displayName = 'ExchangeIcon';

// Calculator Icon
export const CalculatorIcon = memo(({ size = 20, className = '', ...props }: IconProps) => (
  <svg 
    className={`w-${size} h-${size} ${className}`} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M9 7h6m0 3.666V14h-6v-3.334H9V14h6V7H9v3.666" 
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" 
    />
  </svg>
));
CalculatorIcon.displayName = 'CalculatorIcon';

// Dollar/Currency Icon
export const CurrencyIcon = memo(({ size = 16, className = '', ...props }: IconProps) => (
  <svg 
    className={`w-${size} h-${size} ${className}`} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
    />
  </svg>
));
CurrencyIcon.displayName = 'CurrencyIcon';

// Check Icon
export const CheckIcon = memo(({ size = 16, className = '', ...props }: IconProps) => (
  <svg 
    className={`w-${size} h-${size} ${className}`} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M5 13l4 4L19 7" 
    />
  </svg>
));
CheckIcon.displayName = 'CheckIcon';

// Copy Icon
export const CopyIcon = memo(({ size = 16, className = '', ...props }: IconProps) => (
  <svg 
    className={`w-${size} h-${size} ${className}`} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
    />
  </svg>
));
CopyIcon.displayName = 'CopyIcon';

// Chevron Down Icon
export const ChevronDownIcon = memo(({ size = 16, className = '', ...props }: IconProps) => (
  <svg 
    className={`w-${size} h-${size} ${className}`} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M19 9l-7 7-7-7" 
    />
  </svg>
));
ChevronDownIcon.displayName = 'ChevronDownIcon';

// Chevron Up Icon
export const ChevronUpIcon = memo(({ size = 16, className = '', ...props }: IconProps) => (
  <svg 
    className={`w-${size} h-${size} ${className}`} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M5 15l7-7 7 7" 
    />
  </svg>
));
ChevronUpIcon.displayName = 'ChevronUpIcon';

// Empty State Icon
export const EmptyIcon = memo(({ size = 48, className = '', ...props }: IconProps) => (
  <svg 
    className={`w-${size} h-${size} ${className}`} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={1.5} 
      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
    />
  </svg>
));
EmptyIcon.displayName = 'EmptyIcon';
