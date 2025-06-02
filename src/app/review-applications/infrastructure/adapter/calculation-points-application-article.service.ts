import { Injectable } from '@angular/core';
import { CalculationPointsApplicationGateway } from '../../domain/models/gateway/calculation-points-application-gateway';
import { ArticleType, PERCENTAGE, PublindexCategory } from '../../domain/enums/calculate-points.enum';
import { PointsMap } from '../../domain/models/calculate-points.model';

@Injectable({
  providedIn: 'root'
})
export class CalculationPointsApplicationArticleService extends CalculationPointsApplicationGateway {

  private basePointsMessage: string = '';
  private articleTypeMessage: string = '';

  constructor() {
    super();
  }

  override calculatePoints(data: any): number {

    const { articleTypeId, publindexCategoryId, numberOfAuthors } = data;

    // Obtener puntos base según tipo de artículo y categoría
    const basePoints = this.getBasePoints(articleTypeId, publindexCategoryId);

    // Aplicar factor de ajuste por número de autores
    const adjustedPoints = this.applyAuthorFactor(basePoints, numberOfAuthors);

    // Truncar a dos decimales sin aproximación
    return this.truncateToTwoDecimals(adjustedPoints);

  }
  override generateCalculationExplanation(data: any): string {

    const { articleTypeId, publindexCategoryId, numberOfAuthors } = data;

    // Obtener puntos base según tipo de artículo y categoría
    const basePoints = this.getBasePoints(articleTypeId, publindexCategoryId);

    // Aplicar factor de ajuste por número de autores
    const adjustedPoints = this.applyAuthorFactor(basePoints, numberOfAuthors);

    // Truncar a dos decimales sin aproximación
    const finalPoints = this.truncateToTwoDecimals(adjustedPoints);

    const articlePercentage = this.getArticlePercentage(articleTypeId);
    const articlePercentageValue = articlePercentage * 100;
    const authorFactor = this.getAuthorNumericFactor(numberOfAuthors);

    // Mensaje sobre número de autores
    const authorMessage = (() => {
      if (numberOfAuthors <= 3) {
        return `Como hay **${numberOfAuthors} autores**, por lo tanto **no se aplica ajuste** al puntaje.`;
      } else if (numberOfAuthors <= 5) {
        return `Como hay **${numberOfAuthors} autores**, lo que implica un **ajuste al 50%** del puntaje.`;
      } else {
        return `Como hay **${numberOfAuthors} autores**, por lo tanto el puntaje se **divide por ${numberOfAuthors / 2}**.`;
      }
    })();

    return `
  1. **Puntos base**: ${this.basePointsMessage}
  2. ${this.articleTypeMessage}
  3. ${authorMessage}
  4. **Resultado final**:
     - ${basePoints / articlePercentage} × ${articlePercentageValue}% = **${basePoints}**
     - ${basePoints} × ${authorFactor} = **${adjustedPoints}**
     - Truncado sin redondeo: **${finalPoints} puntos**
  
  ### ✅ Puntaje asignado: **${finalPoints}**
  `.trim();

  }

  private getBasePoints(articleType: ArticleType, publindexCategory: PublindexCategory): number {
    const BASE_POINTS: PointsMap = {
      [PublindexCategory.A1]: 15,
      [PublindexCategory.A2]: 12,
      [PublindexCategory.B]: 8,
      [PublindexCategory.C]: 3
    };

    const basePoints = BASE_POINTS[publindexCategory] || 0;

    // Guardar el mensaje sobre el puntaje base
    this.basePointsMessage = `Según la categoría Publindex **${PublindexCategory[publindexCategory]}**, se parte de un puntaje base de **${basePoints} puntos**.`;

    // Definir mensaje por tipo de artículo
    if (articleType === ArticleType.FULL_PAPER) {
      this.articleTypeMessage = `Como se trata de un artículo tipo **"Artículo completo (Full paper)"**, se mantiene el **100%** del puntaje base.`;
      return basePoints * PERCENTAGE.FULL;
    } else if (articleType === ArticleType.SHORT_COMMUNICATION) {
      this.articleTypeMessage = `Como se trata de un artículo tipo **"Comunicación corta"**, se aplica el **60%** del puntaje base.`;
      return basePoints * PERCENTAGE.SHORT;
    } else if (
      articleType === ArticleType.CASE_REPORT ||
      articleType === ArticleType.TOPIC_REVIEW ||
      articleType === ArticleType.LETTER_TO_EDITOR ||
      articleType === ArticleType.EDITORIAL
    ) {
      this.articleTypeMessage = `Como se trata de un artículo tipo **"${ArticleType[articleType]}"**, se aplica el **30%** del puntaje base.`;
      return basePoints * PERCENTAGE.OTHER;
    }

    this.articleTypeMessage = `Tipo de artículo no reconocido.`;
    return 0;
  }

  private applyAuthorFactor(basePoints: number, numberOfAuthors: number): number {
    // Hasta 3 autores: 100% de los puntos
    if (numberOfAuthors <= 3) {
      return basePoints;
    }

    // De 4 a 5 autores: 50% de los puntos
    if (numberOfAuthors >= 4 && numberOfAuthors <= 5) {
      return basePoints * 0.5;
    }

    // 6 o más autores: puntos divididos por la mitad del número de autores
    if (numberOfAuthors >= 6) {
      return basePoints / (numberOfAuthors / 2);
    }

    return basePoints; // Por defecto, retorna los puntos base sin ajustar
  }

  private getArticlePercentage(articleType: ArticleType): number {
    switch (articleType) {
      case ArticleType.FULL_PAPER:
        return PERCENTAGE.FULL;
      case ArticleType.SHORT_COMMUNICATION:
        return PERCENTAGE.SHORT;
      default:
        return PERCENTAGE.OTHER;
    }
  }

  private getAuthorNumericFactor(numberOfAuthors: number): number {
    if (numberOfAuthors <= 3) return 1;
    if (numberOfAuthors <= 5) return 0.5;
    return 1 / (numberOfAuthors / 2);
  }

  private truncateToTwoDecimals(value: number): number {
    const valueString = value.toString();
    const decimalPosition = valueString.indexOf('.');

    if (decimalPosition === -1) {
      // No tiene decimales
      return value;
    }

    // Truncar a dos decimales sin redondeo
    const truncated = parseFloat(valueString.substring(0, Math.min(decimalPosition + 3, valueString.length)));
    return truncated;
  }

}
