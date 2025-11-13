
import React, { useCallback } from 'react';

interface FileUploadProps {
    onFileChange: (content: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
    const handleFile = (file: File | null) => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            onFileChange(content);
        };
        reader.onerror = () => {
            console.error("Erro ao ler o arquivo.");
            onFileChange("");
        };
        reader.readAsText(file);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleFile(event.target.files?.[0] || null);
    };

    const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/50');
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            handleFile(event.dataTransfer.files[0]);
        }
    }, [onFileChange]);

    const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.add('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/50');
    };
    
    const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/50');
    };

    return (
        <div 
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => document.getElementById('file-upload-input')?.click()}
            aria-label="Área para upload de arquivo"
        >
            <input
                id="file-upload-input"
                type="file"
                className="hidden"
                onChange={handleInputChange}
                accept=".txt,.md,text/plain"
            />
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Carregue um arquivo</span> ou arraste e solte aqui
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Apenas arquivos .txt ou .md</p>
        </div>
    );
};
