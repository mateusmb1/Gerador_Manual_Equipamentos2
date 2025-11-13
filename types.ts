
export interface Step {
    id: number;
    description: string;
    imageUrl: string | null;
}

export interface FaqItem {
    question: string;
    answer: string;
}

export interface EditableItem {
    id: number;
    text: string;
    imageUrl: string | null;
}

export interface Tutorial {
    equipment: {
        name: string;
        model: string;
        application: string;
    };
    toolsAndItems: {
        tools: EditableItem[];
        items: EditableItem[];
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