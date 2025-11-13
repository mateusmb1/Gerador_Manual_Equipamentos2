
import React from 'react';
import type { Tutorial } from '../types';
import { StepItem } from './StepItem';
import { EditableListItem } from './EditableListItem';

interface TutorialDisplayProps {
    tutorial: Tutorial;
    onUpdateStepImage: (stepId: number, imageUrl: string) => void;
    onUpdateStepDescription: (stepId: number, newDescription: string) => void;
    onAddStep: (afterStepId: number) => void;
    onRemoveStep: (stepId: number) => void;
    onExport: () => void;
    onAddItem: (listType: 'tools' | 'items') => void;
    onRemoveItem: (listType: 'tools' | 'items', id: number) => void;
    onUpdateItemText: (listType: 'tools' | 'items', id: number, newText: string) => void;
    onUpdateItemImage: (listType: 'tools' | 'items', id: number, imageUrl: string) => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-10 page-break">
        <h2 className="section-title text-3xl font-bold text-gray-800 dark:text-white border-b-2 border-blue-500 pb-2 mb-6">{title}</h2>
        <div className="text-gray-700 dark:text-gray-300 space-y-4 text-lg">
            {children}
        </div>
    </section>
);

const ListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start">
        <svg className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>{children}</span>
    </li>
);

export const TutorialDisplay: React.FC<TutorialDisplayProps> = ({ 
    tutorial, 
    onUpdateStepImage, 
    onUpdateStepDescription, 
    onAddStep, 
    onRemoveStep, 
    onExport,
    onAddItem,
    onRemoveItem,
    onUpdateItemText,
    onUpdateItemImage 
}) => {
    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="text-center my-8 no-print">
                <button
                    onClick={onExport}
                    className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors shadow-lg"
                >
                    Baixar Tutorial como PDF
                </button>
            </div>
            
            <div id="pdf-content" className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 md:p-12">
                <header className="text-center border-b-2 border-gray-200 dark:border-gray-700 pb-8 mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">{tutorial.equipment?.name || 'Tutorial'}</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mt-2">{tutorial.equipment?.model || 'Modelo'}</p>
                    <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold mt-1">{tutorial.equipment?.application || 'Aplicação'}</p>
                </header>

                <Section title="Itens e Ferramentas Necessárias">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Ferramentas</h3>
                            <ul className="space-y-3">
                                {(tutorial.toolsAndItems?.tools || []).map((tool) => (
                                    <EditableListItem
                                        key={tool.id}
                                        item={tool}
                                        listType="tools"
                                        onRemove={onRemoveItem}
                                        onUpdateText={onUpdateItemText}
                                        onUpdateImage={onUpdateItemImage}
                                    />
                                ))}
                                <li className="no-print mt-2">
                                    <button onClick={() => onAddItem('tools')} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold text-sm flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                        Adicionar Ferramenta
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Outros Itens</h3>
                            <ul className="space-y-3">
                                {(tutorial.toolsAndItems?.items || []).map((item) => (
                                     <EditableListItem
                                        key={item.id}
                                        item={item}
                                        listType="items"
                                        onRemove={onRemoveItem}
                                        onUpdateText={onUpdateItemText}
                                        onUpdateImage={onUpdateItemImage}
                                    />
                                ))}
                                <li className="no-print mt-2">
                                    <button onClick={() => onAddItem('items')} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold text-sm flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                        Adicionar Item
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Section>

                <Section title="Passos de Instalação">
                    <div className="space-y-12">
                        {(tutorial.installationSteps || []).map((step, index) => (
                            <StepItem 
                                key={step.id} 
                                step={step} 
                                stepNumber={index + 1}
                                onUpdateImage={onUpdateStepImage} 
                                onUpdateDescription={onUpdateStepDescription}
                                onAddStep={onAddStep}
                                onRemoveStep={onRemoveStep}
                            />
                        ))}
                    </div>
                </Section>

                <Section title="Precauções de Segurança">
                    <ul className="space-y-3">
                        {(tutorial.safetyPrecautions || []).map((precaution, index) => (
                             <li key={index} className="flex items-start bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-lg">
                                <svg className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                <span>{precaution}</span>
                            </li>
                        ))}
                    </ul>
                </Section>

                <Section title={tutorial.testingProcedures?.title || "Procedimentos de Teste"}>
                     <ul className="space-y-3 list-decimal list-inside">
                        {(tutorial.testingProcedures?.steps || []).map((step, index) => <ListItem key={index}>{step}</ListItem>)}
                    </ul>
                </Section>
                
                <Section title="Interpretação dos Resultados">
                    <ul className="space-y-3">
                        {(tutorial.resultsInterpretation || []).map((result, index) => <ListItem key={index}>{result}</ListItem>)}
                    </ul>
                </Section>

                <Section title="Recomendações Finais">
                    <ul className="space-y-3">
                        {(tutorial.finalRecommendations || []).map((rec, index) => <ListItem key={index}>{rec}</ListItem>)}
                    </ul>
                </Section>
                
                <Section title="Perguntas Frequentes (FAQ)">
                    <div className="space-y-6">
                        {(tutorial.faq || []).map((item, index) => (
                             <div key={index} className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
                                <h4 className="font-bold text-xl text-gray-800 dark:text-white">{item.question}</h4>
                                <p className="mt-2">{item.answer}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            </div>
        </div>
    );
};