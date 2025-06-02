import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { IconProps } from '../../types';

const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const LucideIcon = LucideIcons[name as keyof typeof LucideIcons] as React.FC<React.SVGProps<SVGSVGElement>>;
  
  if (!LucideIcon) {
    return (
      <>
    <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea"/>
          <stop offset="100%" stopColor="#764ba2"/>
        </linearGradient>
      </defs>
      
      <rect x="3" y="2" width="22" height="16" rx="2" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="0.5"/>
      
      <rect x="5" y="4" width="8" height="1.5" rx="0.5" fill="#e2e8f0"/>
      <rect x="5" y="7" width="6" height="1" rx="0.5" fill="#e2e8f0"/>
      
      <circle cx="14" cy="12" r="1.5" fill="url(#gradient)" opacity="0.8"/>
      <circle cx="19" cy="9" r="1" fill="#764ba2" opacity="0.6"/>
      
      <ellipse cx="14" cy="22" rx="3" ry="4" fill="url(#gradient)" opacity="0.9"/>
      <ellipse cx="14" cy="18" rx="1" ry="3" fill="url(#gradient)" opacity="0.9"/>
      
      <circle cx="14" cy="12" r="3" fill="none" stroke="#667eea" stroke-width="0.5" opacity="0.4">
        <animate attributeName="r" values="1.5;4;1.5" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite"/>
      </circle>
    </svg>
      </>
    );
  }
  
  return <LucideIcon {...props} />;
};

export default Icon;