
import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { Tutorial } from './types';
import { FileUpload } from './components/FileUpload';
import { TutorialDisplay } from './components/TutorialDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { HeroSection } from './components/HeroSection';

// Declare global libraries loaded from CDN
declare var jspdf: any;
declare var html2canvas: any;

const App: React.FC = () => {
    const [manualContent, setManualContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [tutorial, setTutorial] = useState<Tutorial | null>(null);

    const handleFileChange = (content: string) => {
        setManualContent(content);
        setTutorial(null); 
        setError(null);
    };

    const generateTutorial = useCallback(async () => {
        if (!manualContent.trim()) {
            setError("Por favor, carregue ou cole o conteúdo do manual.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setTutorial(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    equipment: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING, description: "Nome completo do equipamento." },
                            model: { type: Type.STRING, description: "Código ou modelo do equipamento." },
                            application: { type: Type.STRING, description: "Aplicação principal do equipamento." },
                        },
                    },
                    toolsAndItems: {
                        type: Type.OBJECT,
                        properties: {
                            tools: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de ferramentas necessárias." },
                            items: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de outros itens ou materiais necessários." },
                        },
                    },
                    installationSteps: {
                        type: Type.ARRAY,
                        description: "Passos detalhados de instalação. Cada passo deve ser uma descrição clara e concisa.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.INTEGER, description: "Número sequencial do passo." },
                                description: { type: Type.STRING, description: "Descrição detalhada do passo de instalação." },
                            },
                        },
                    },
                    safetyPrecautions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Precauções de segurança essenciais." },
                    testingProcedures: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: "Título para a seção de testes/ensaios." },
                            steps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Passos para testar o equipamento." },
                        },
                    },
                    resultsInterpretation: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Orientações para interpretar os resultados dos testes." },
                    finalRecommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Recomendações finais de uso e manutenção." },
                    faq: {
                        type: Type.ARRAY,
                        description: "Perguntas e respostas frequentes para iniciantes.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                question: { type: Type.STRING },
                                answer: { type: Type.STRING },
                            },
                        },
                    },
                },
            };

            const prompt = `
                Analise o seguinte manual técnico e gere um tutorial completo e passo a passo em PORTUGUÊS, em linguagem clara e acessível para leigos.
                O resultado DEVE ser um objeto JSON válido que siga estritamente o schema fornecido.
                O tutorial deve incluir:
                1.  Identificação do equipamento (nome, modelo, aplicação).
                2.  Lista de ferramentas e itens necessários.
                3.  Passos de instalação simplificados e detalhados.
                4.  Precauções de segurança.
                5.  Procedimentos para testar/ensaiar o equipamento.
                6.  Orientações para interpretar os resultados.
                7.  Recomendações finais.
                8.  Uma seção de FAQ com perguntas e respostas para iniciantes.

                Manual:
                ---
                ${manualContent}
                ---
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema,
                },
            });

            const generatedJsonText = response.text;
            const parsedTutorial = JSON.parse(generatedJsonText) as Omit<Tutorial, 'installationSteps'> & { installationSteps: Array<Omit<Tutorial['installationSteps'][0], 'imageUrl'>> };
            
            const tutorialWithImagePlaceholders: Tutorial = {
                ...parsedTutorial,
                installationSteps: parsedTutorial.installationSteps.map(step => ({
                    ...step,
                    imageUrl: null,
                })),
            };

            setTutorial(tutorialWithImagePlaceholders);

        } catch (e: any) {
            console.error(e);
            setError(`Ocorreu um erro ao gerar o tutorial: ${e.message}. Tente novamente.`);
        } finally {
            setIsLoading(false);
        }
    }, [manualContent]);

    const handleUpdateStepImage = (stepId: number, imageUrl: string) => {
        setTutorial(prevTutorial => {
            if (!prevTutorial) return null;
            return {
                ...prevTutorial,
                installationSteps: prevTutorial.installationSteps.map(step =>
                    step.id === stepId ? { ...step, imageUrl } : step
                ),
            };
        });
    };
    
    const exportToPdf = useCallback(async () => {
        const content = document.getElementById('pdf-content');
        if (!content) {
            console.error("Elemento para exportar para PDF não encontrado.");
            return;
        }

        const originalBackgroundColor = content.style.backgroundColor;
        content.style.backgroundColor = 'white';
        
        try {
            const canvas = await html2canvas(content, {
                scale: 2, // Aumenta a resolução para melhor qualidade de impressão
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            content.style.backgroundColor = originalBackgroundColor;

            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = jspdf;
            
            // A4: 210mm x 297mm
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const canvasAspectRatio = canvasWidth / canvasHeight;

            const imgHeight = pdfWidth / canvasAspectRatio;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position -= pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }
            
            pdf.save('tutorial-gerado.pdf');

        } catch (e: any) {
            console.error("Erro ao exportar para PDF:", e);
            setError("Falha ao exportar o PDF. Por favor, tente novamente.");
        }
    }, [tutorial]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
            <main className="container mx-auto px-4 py-8">
                <HeroSection />
                <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 mt-8">
                    <FileUpload onFileChange={handleFileChange} />
                    <textarea
                        className="w-full h-40 p-3 mt-4 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={manualContent}
                        onChange={(e) => setManualContent(e.target.value)}
                        placeholder="...ou cole o conteúdo do manual aqui."
                    ></textarea>
                    <div className="mt-6 text-center">
                        <button
                            onClick={generateTutorial}
                            disabled={isLoading || !manualContent.trim()}
                            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-md"
                        >
                            {isLoading ? 'Gerando...' : 'Gerar Tutorial'}
                        </button>
                    </div>
                    {error && <p className="mt-4 text-center text-red-500">{error}</p>}
                </div>

                {isLoading && <LoadingSpinner />}
                
                {tutorial && (
                    <div className="mt-12">
                        <TutorialDisplay 
                            tutorial={tutorial} 
                            onUpdateStepImage={handleUpdateStepImage} 
                            onExport={exportToPdf} 
                        />
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
