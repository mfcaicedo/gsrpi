export abstract class CalculationPointsApplicationGateway {
    abstract calculatePoints(data: any): number;
    abstract generateCalculationExplanation(data: any): string;
}