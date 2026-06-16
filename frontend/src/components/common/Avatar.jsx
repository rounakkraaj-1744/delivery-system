import React from 'react';
import { cn } from './Button';

export const Avatar = ({ name, url, className }) => {
  const initials = name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?';
  
  // Deterministic color based on name
  const colors = ['bg-primary', 'bg-accent', 'bg-danger', 'bg-success', 'bg-blue-500', 'bg-purple-500'];
  const hash = name ? name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
  const color = colors[hash % colors.length];

  return (
    <div className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}>
      {url ? (
        <img className="aspect-square h-full w-full object-cover" src={url} alt={name} />
      ) : (
        <div className={cn('flex h-full w-full items-center justify-center text-white font-medium text-sm', color)}>
          {initials}
        </div>
      )}
    </div>
  );
};
