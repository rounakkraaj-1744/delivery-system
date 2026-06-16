import React from 'react';

export const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-neutral-300 shadow-sm w-full min-h-[300px]">
      {Icon && (
        <div className="h-16 w-16 bg-primary-surface text-primary rounded-full flex items-center justify-center mb-4">
          <Icon size={32} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-neutral-900 mb-2">{title}</h3>
      {description && <p className="text-neutral-600 mb-6 max-w-md">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};
