import { inject, Injectable } from "@angular/core";
import { CalculationPointsApplicationGateway } from "../models/gateway/calculation-points-application-gateway";

@Injectable({
    providedIn: 'root'
})
export class CalculationPointsApplicationUseCase {

    private readonly calculationPointsApplicationGateway = inject(CalculationPointsApplicationGateway);

    calculatePoints(data: any): number {
        return this.calculationPointsApplicationGateway.calculatePoints(data);
    }
    
    generateCalculationExplanation(data: any): string {
        return this.calculationPointsApplicationGateway.generateCalculationExplanation(data);
    }

}