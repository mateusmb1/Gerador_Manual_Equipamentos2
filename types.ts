
export interface Step {
    id: number;
    description: string;
    imageUrl: string | null;
}

export interface FaqItem {
    question: string;
    answer: string;
}

export interface Tutorial {
    equipment: {
        name: string;
        model: string;
        application: string;
    };
    toolsAndItems: {
        tools: string[];
        items: string[];
    };
    installationSteps: Step[];
    safetyPrecautions: string[];
    testingProcedures: {
        title: string;
        steps: string[];
    };
    resultsInterpretation: string[];
    finalRecommendations: string[];
    faq: FaqItem[];
}
