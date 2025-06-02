import { Injectable } from '@angular/core';
import { CalculationPointsApplicationGateway } from '../../domain/models/gateway/calculation-points-application-gateway';

@Injectable({
  providedIn: 'root'
})
export class CalculationPointsApplicationBookService extends CalculationPointsApplicationGateway {

  constructor() {
    super();
  }
  
  override calculatePoints(data: any): number {
    
    // Implementación futura para cálculo de puntos de libros
    return 0;
  }
  
  override generateCalculationExplanation(data: any): string {
    
    return `
    ### El cálculo de puntos para libros de investigación está pendiente de implementación.

    ### ✅ Puntaje asignado: **0**
    `.trim();

  }

}
