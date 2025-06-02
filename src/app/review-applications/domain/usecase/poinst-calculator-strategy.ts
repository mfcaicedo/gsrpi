import { CalculationPointsApplicationArticleService } from "../../infrastructure/adapter/calculation-points-application-article.service";
import { CalculationPointsApplicationBookService } from "../../infrastructure/adapter/calculation-points-application-book.service";
import { ProductionType } from "../enums/calculate-points.enum";
import { CalculationPointsApplicationGateway } from "../models/gateway/calculation-points-application-gateway";

export class PointsCalculatorStrategy {

    private strategy: CalculationPointsApplicationGateway | undefined;
    private messageService: any;

    constructor(messageService: any) {
        this.messageService = messageService;
    }

    setStrategy(typeProductionId: number): void {
        switch (typeProductionId) {
            case ProductionType.ARTICLE: // Trabajo, ensayo o artículo científico
                this.strategy = new CalculationPointsApplicationArticleService();
                break;
            case ProductionType.BOOK: // Libros que resulten de una labor de investigación
                this.strategy = new CalculationPointsApplicationBookService();
                break;
            case ProductionType.OTHER: // Otros tipos de producción
                // this.strategy = new OtherProductionPointsStrategy();
                break;
            default:
                this.messageService.add({
                    severity: 'error',
                    summary: 'Ups, algo salió mal',
                    detail: 'Por el momento no se puede calcular los puntos automáticamente para este tipo de producción.'
                });
                console.warn(`Tipo de producción no reconocido: ${typeProductionId}`);
        }
    }

    calculatePoints(data: any): number {
        if (!this.strategy) {
            return 0;
        }
        return this.strategy.calculatePoints(data);
    }

    getCalculationExplanation(data: any): string {
        if (!this.strategy) {
            return "No se ha definido una estrategia de cálculo.";
        }
        return this.strategy.generateCalculationExplanation(data);
    }
}