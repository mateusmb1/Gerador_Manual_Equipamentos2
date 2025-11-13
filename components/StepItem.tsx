
import React, { useState, useRef } from 'react';
import type { Step } from '../types';

interface StepItemProps {
    step: Step;
    onUpdateImage: (stepId: number, imageUrl: string) => void;
    onUpdateDescription: (stepId: number, newDescription: string) => void;
}

export const StepItem: React.FC<StepItemProps> = ({ step, onUpdateImage, onUpdateDescription }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedDescription, setEditedDescription] = useState(step.description);


    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    onUpdateImage(step.id, e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePlaceholderClick = () => {
        fileInputRef.current?.click();
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setEditedDescription(step.description);
    };

    const handleSaveClick = () => {
        onUpdateDescription(step.id, editedDescription.trim());
        setIsEditing(false);
    };


    return (
        <div className="flex flex-col md:flex-row items-start gap-8 border-b border-gray-200 dark:border-gray-700 pb-8 last:border-b-0 last:pb-0">
            <div className="flex-shrink-0 font-bold text-4xl text-blue-500 bg-blue-100 dark:bg-blue-900/50 rounded-full w-16 h-16 flex items-center justify-center">
                {step.id}
            </div>
            <div className="flex-grow">
                {isEditing ? (
                    <div className="no-print">
                        <textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className="w-full h-32 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            aria-label={`Editar descrição do passo ${step.id}`}
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <button onClick={handleCancelClick} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors">
                                Cancelar
                            </button>
                            <button onClick={handleSaveClick} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                                Salvar
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="group relative">
                        <p className="text-lg leading-relaxed">{step.description}</p>
                        <button 
                            onClick={handleEditClick} 
                            className="no-print absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-700 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600"
                            aria-label={`Editar passo ${step.id}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}
                 <p className={`text-lg leading-relaxed print-only ${isEditing ? 'block' : 'hidden'}`}>{step.description}</p>
            </div>
            <div className="w-full md:w-64 flex-shrink-0">
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    aria-label={`Carregar imagem para o passo ${step.id}`}
                />
                {step.imageUrl ? (
                    <img
                        src={step.imageUrl}
                        alt={`Ilustração para o passo ${step.id}`}
                        className="w-full h-auto object-cover rounded-lg shadow-md cursor-pointer"
                        onClick={handlePlaceholderClick}
                    />
                ) : (
                    <div
                        onClick={handlePlaceholderClick}
                        className="no-print w-full h-48 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => e.key === 'Enter' && handlePlaceholderClick()}
                    >
                         <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <span className="text-center">Clique para adicionar uma foto ilustrativa</span>
                    </div>
                )}
                 <div className="print-only">
                    {step.imageUrl && <img src={step.imageUrl} alt={`Ilustração para o passo ${step.id}`} className="w-full h-auto object-cover rounded-lg shadow-md" />}
                 </div>
            </div>
        </div>
    );
};