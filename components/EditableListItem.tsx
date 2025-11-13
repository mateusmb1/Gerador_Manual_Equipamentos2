
import React, { useState, useRef } from 'react';
import type { EditableItem } from '../types';

interface EditableListItemProps {
    item: EditableItem;
    listType: 'tools' | 'items';
    onUpdateText: (listType: 'tools' | 'items', id: number, newText: string) => void;
    onRemove: (listType: 'tools' | 'items', id: number) => void;
    onUpdateImage: (listType: 'tools' | 'items', id: number, imageUrl: string) => void;
}

export const EditableListItem: React.FC<EditableListItemProps> = ({ item, listType, onUpdateText, onRemove, onUpdateImage }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(item.text);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        onUpdateText(listType, item.id, editText.trim());
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditText(item.text);
        setIsEditing(false);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    onUpdateImage(listType, item.id, e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    return (
        <li className="group flex items-start py-1 relative">
            <svg className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            
            <div className="flex-grow">
                {isEditing ? (
                    <div className="no-print">
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            rows={2}
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <button onClick={handleCancel} className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                                Cancelar
                            </button>
                            <button onClick={handleSave} className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                Salvar
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="no-print">{item.text}</p>
                )}
                <p className="print-only">{item.text}</p>

                {item.imageUrl && (
                    <img 
                        src={item.imageUrl} 
                        alt={`Imagem para ${item.text}`} 
                        className="mt-2 rounded-lg shadow-sm w-full max-w-xs"
                    />
                )}

                <div className="no-print absolute top-0 -right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
                    <button onClick={() => fileInputRef.current?.click()} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full" aria-label="Adicionar imagem">
                        <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </button>
                    <button onClick={() => setIsEditing(true)} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full" aria-label="Editar item">
                         <svg className="h-4 w-4 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                    </button>
                    <button onClick={() => onRemove(listType, item.id)} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full" aria-label="Remover item">
                        <svg className="h-4 w-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
                 <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                />
            </div>
        </li>
    );
};