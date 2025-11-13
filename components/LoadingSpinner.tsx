
import React from 'react';

export const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <p className="text-lg text-gray-700 dark:text-gray-300">Gerando seu tutorial... Isso pode levar alguns instantes.</p>
    </div>
);
