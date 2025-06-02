import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { IconProps } from '../../types';

const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const LucideIcon = LucideIcons[name as keyof typeof LucideIcons] as React.FC<React.SVGProps<SVGSVGElement>>;
  
  if (!LucideIcon) {
    console.error(`Icon "${name}" not found`);
    return null;
  }
  
  return <LucideIcon {...props} />;
};

export default Icon;