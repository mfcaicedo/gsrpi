export enum ArticleType {
    FULL_PAPER = 1,
    SHORT_COMMUNICATION = 2,
    CASE_REPORT = 3,
    TOPIC_REVIEW = 4,
    LETTER_TO_EDITOR = 5,
    EDITORIAL = 6
}

export enum ProductionType {
    ARTICLE = 1,
    BOOK = 2,
    OTHER = 3
}

export enum PublindexCategory {
    A1 = 1,
    A2 = 2,
    B = 3,
    C = 4
}

// Constantes para los factores de multiplicación
export const PERCENTAGE = {
    FULL: 1.0,
    SHORT: 0.6,
    OTHER: 0.3
};
