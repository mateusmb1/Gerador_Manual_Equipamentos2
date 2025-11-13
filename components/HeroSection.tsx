
import React from 'react';

export const HeroSection: React.FC = () => {
    return (
        <header className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Gerador de Tutorial a Partir de Manuais
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                Transforme manuais técnicos complexos em guias passo a passo fáceis de entender. Carregue um manual, e nossa IA criará um tutorial claro e conciso, pronto para ser personalizado com suas próprias imagens e exportado para PDF.
            </p>
        </header>
    );
};
