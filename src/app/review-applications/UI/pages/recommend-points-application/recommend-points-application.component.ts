import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ReviewApplicationsManagementUseCase } from '../../../domain/usecase/review-applications-management-usecase';
import { Application, TeacherApplication } from '../../../../shared/utils/models/applications-common.model';
import { ApplicationStatuses } from '../../../../shared/utils/enums/review-applications.enum';
import { ApplicationManagementUseCase } from '../../../../applications-recognition/domain/usecase/application-management-usecase';
import { KeyValueOption } from '../../../../shared/utils/models/form-builder.model';
import { ArticleType, PERCENTAGE, PublindexCategory } from '../../../domain/enums/calculate-points.enum';
import { PointsMap } from '../../../domain/models/calculate-points.model';
import { MarkdownComponent } from 'ngx-markdown';
import { AuthService } from '../../../../auth/auth.service';
import { RoleNames } from '../../../../auth/enums/roles.enum';
import { PointsCalculatorStrategy } from '../../../domain/usecase/poinst-calculator-strategy';

@Component({
  selector: 'app-recommend-points-application',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, RouterModule, ToastModule, ConfirmDialogModule, RadioButtonModule, TextareaModule,
    InputNumberModule, TableModule, IconFieldModule, InputIconModule, DialogModule, MarkdownComponent],
  providers: [ConfirmationService, MessageService,],
  templateUrl: './recommend-points-application.component.html',
  styleUrl: './recommend-points-application.component.css'
})
export class RecommendPointsApplicationComponent implements OnInit {

  role = '';
  isValidForm: boolean = false;

  formGroupPoints!: FormGroup;

  applicationId: number = 0;
  teacherApplicationId: number = 0;

  articleTypeDataList: KeyValueOption[] = [
    { key: 1, value: 'Artículo tradicional "Full paper", completo y autónomo en su temática' },
    { key: 2, value: 'Comunicación corta "artículo corto"' },
    { key: 3, value: 'Reporte de caso' },
    { key: 4, value: 'Revisiones de tema' },
    { key: 5, value: 'Cartas Editor' },
    { key: 6, value: 'Editoriales' },
  ];

  magazineTypeDataList: KeyValueOption[] = [
    { key: 1, value: 'Internacional' },
    { key: 2, value: 'Nacional' },
  ];

  publindexCategoryDataList: KeyValueOption[] = [
    { key: 1, value: 'A1' },
    { key: 2, value: 'A2' },
    { key: 3, value: 'B' },
    { key: 4, value: 'C' },
  ];

  responseBodyApplication: Partial<Application> = {};

  automaticPointsData: any = null;
  isProccessCalculatePoints = false;

  calculationProcessText = '';
  basePointsMessage = '';
  articleTypeMessage = '';

  isViewDetail: boolean = false;

  private pointsCalculator: PointsCalculatorStrategy;

  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly activedRoute = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly reviewApplicationsManagementUseCase = inject(ReviewApplicationsManagementUseCase)
  private readonly applicationManagementUseCase = inject(ApplicationManagementUseCase);
  private readonly authService = inject(AuthService);

  constructor() {
    this.pointsCalculator = new PointsCalculatorStrategy('');
  }

  async ngOnInit() {

    this.activedRoute.params.subscribe(async params => {
      this.applicationId = params['applicationId'] ?? 0;
      this.teacherApplicationId = params['teacherApplicationId'] ?? 0;
      this.isViewDetail = params['isViewDetail'] === 'true' ? true : false;
    });

    this.formGroupPoints = this.formBuilder.group({
      points: [undefined, [Validators.required, Validators.min(1), Validators.max(100)]],
    });

    this.authService.getUserDataSession().subscribe((data: any) => {
      const roles = data.userRoles;
      this.role = roles[0].role.name;
    })

    await this.getApplicationReviewById(this.applicationId);

    //si es ver detalle se muestra el calculo automatico
    if (this.isViewDetail) {
      this.automaticCalculationPoints();
    }

  }

  async getApplicationReviewById(applicationId: number) {

    return new Promise<void>((resolve, reject) => {
      this.applicationManagementUseCase.getApplicationById(applicationId).subscribe({
        next: (response: any) => {
          this.responseBodyApplication = response;
          console.log("this.responseBodyApplication", this.responseBodyApplication);
          resolve();
        },
        error: (error) => {
          console.error("error", error);
          reject();
        }
      });
    });

  }

  onSubmit() {

    this.formGroupPoints.markAllAsTouched();
    if (this.formGroupPoints.invalid) {
      return;
    }

    //Modal de confirmación de guardar datos
    this.modalConfirmationSavePoints();

  }

  modalConfirmationSavePoints() {

    this.confirmationService.confirm({
      target: 'body' as unknown as EventTarget,
      message: '¿Está seguro(a) de guardar los puntos recomendados a la solicitud?',
      header: 'Confirmación',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,

      },
      acceptButtonProps: {
        label: 'Aceptar',
      },
      accept: async () => {

        await this.saveRecommendedPointsOfApplication();

      },
    });

  }

  async saveRecommendedPointsOfApplication() {

    const requestBody: Partial<TeacherApplication> = {
      teacherApplicationId: this.teacherApplicationId,
      recommendedPoints: this.formGroupPoints.value.points,
      assignedPoints: this.formGroupPoints.value.points
    }

    return new Promise<void>((resolve, reject) => {

      this.reviewApplicationsManagementUseCase.savePointsApplicationRecognition(requestBody).subscribe({
        next: async (response: any) => {
          //Mensaje de exito
          this.messageService.add({
            severity: 'success',
            summary: '¡Registro exitoso!',
            detail: 'La recomendación de puntos fue guardada exitosamente.'
          });
          resolve();

          //Se actualiza el estado de la solicitud a revisada por miembro del comité
          await this.updateApplicationState();

        },
        error: (error) => {
          console.error("error", error);
          //Mensaje de error
          this.messageService.add({
            severity: 'error',
            summary: 'Ups, algo salió mal',
            detail: 'Tuvimos un problema al guardar los puntos. Inténtelo de nuevo en unos minutos.'
          });
          resolve();
        }
      });

    });

  }

  async updateApplicationState() {
    return new Promise<void>((resolve, reject) => {
      this.reviewApplicationsManagementUseCase.updateApplicationState(
        this.applicationId,
        ApplicationStatuses.REVIEWED_BY_CPD_MEMBER
      ).subscribe({
        next: async (response: any) => {
          resolve();
          //Redireccionar a la lista de solicitudes
          setTimeout(() => {
            this.router.navigate(['revision-solicitudes/listar-solicitudes-revision-comite']);
          }, 3000);
        },
        error: (error) => {
          console.error("error", error);
          resolve();
        }
      });
    });
  }
  /**
   * ************PARA SOLICITUDES DE TIPO BASE SALARIAL************
   * Método para calcular los puntos automáticamente y asignarlos al campo de puntos
   * RECONOCIMIENTOS EN REVISTAS ESPECIALIZADAS.
   * A. Artículos.
   * Para los reconocimientos de los artículos tradicionales (“full paper”), completos y autónomos en su temática, se
   * adoptan las siguientes reglas para la asignación de los puntajes:
   * A. 1. Por trabajos, ensayos y artículos de carácter científico, técnico, artístico, humanístico o pedagógico
   * publicados en revistas del tipo A1, según el índice de COLCIENCIAS, quince (15) puntos por cada trabajo o
   * producción.
   * A. 2. Por trabajos, ensayos y artículos de carácter científico, técnico, artístico, humanístico o pedagógico
   * publicados en revistas del tipo A2, según el índice de COLCIENCIAS, doce (12) puntos por cada trabajo o
   * producción.
   * A. 3. Por trabajos, ensayos y artículos de carácter científico, técnico, artístico, humanístico o pedagógico
   * publicados en revistas del tipo B, según el índice de COLCIENCIAS, ocho (8) puntos por cada trabajo o
   * producción.
   * A. 4. Por trabajos, ensayos y artículos de carácter científico, técnico, artístico, humanístico o pedagógico
   * publicados en revistas del tipo C, según el índice de COLCIENCIAS, tres (3) puntos por cada trabajo o
   * producción.
   * B. Otras modalidades de publicaciones en revistas especializadas.
   * Para la denominada “Comunicación corta” (“short comunication”, “artículo corto”), según los parámetros de
   * COLCIENCIAS, publicada en revistas especializadas indexadas u
   * homologadas por COLCIENCIAS, se asigna el 60% del puntaje que le corresponde según su nivel y
   * clasificación.
   * Para los Reportes de caso o Revisiones de tema o Cartas al editor o Editoriales, publicados en revistas
   * especializadas indexadas u homologadas por COLCIENCIAS, se asigna el 30% del puntaje según su nivel y
   * clasificación.
   * 
   * *************Restricción de puntajes según el número de autores************
      Cuando una publicación o una obra o una actividad productiva tenga más de un autor se procede de la
      siguiente forma, en cada universidad:
      a) Hasta tres (3) autores, se otorga a cada uno el puntaje total liquidado a la publicación, obra o actividad
      productiva;
      b) De cuatro (4) a cinco (5) autores, se otorga a cada uno la mitad del puntaje determinado para la publicación,
      obra o actividad productiva;
      c) Si son seis (6) o más autores, se otorga a cada uno el puntaje determinado para la publicación, obra o
      actividad productiva, dividido por la mitad del número de autores.
      d) Cuando se trate de libros en los cuales la contribución de los autores se pueda separar según los capítulos
      o las partes de la obra, éstos se pueden tratar como coautores del libro, siguiendo los criterios de calidad
      para la modalidad de libros de este decreto.

    * Calcula automáticamente los puntos de reconocimiento para publicaciones académicas
    * según el tipo de publicación, categoría de la revista y número de autores.
    */
  automaticCalculationPoints() {
    this.isProccessCalculatePoints = true;

    // Obtener y parsear los datos de la producción
    const dataJson = this.responseBodyApplication?.production?.dataJson
      ? JSON.parse(this.responseBodyApplication.production.dataJson)
      : undefined;

    // Preparar los datos necesarios para el cálculo
    this.automaticPointsData = {
      productionType: this.responseBodyApplication?.production?.productionType,
      articleType: this.articleTypeDataList.find((item) => item.key === dataJson?.articleType)?.value,
      publindexCategory: this.publindexCategoryDataList.find((item) => item.key === dataJson?.publindexCategory)?.value,
      numberOfAuthors: this.responseBodyApplication?.numberOfAuthors ?? 0
    };

    // Calcular puntos según el tipo de producción
    let points = 0;
    const typeProductionId = this.automaticPointsData.productionType?.typeProductionId;
    const articleTypeId = dataJson?.articleType;
    const publindexCategoryId = dataJson?.publindexCategory;

    // const calculationData = {
    //   articleTypeId: dataJson?.articleType,
    //   publindexCategoryId: dataJson?.publindexCategory,
    //   numberOfAuthors: this.automaticPointsData.numberOfAuthors
    // };


    // // seteo la estrategia de calculo de puntos dependiendo del tipo de produccion
    // this.pointsCalculator.setStrategy(typeProductionId);

    // // Calculo los puntos automaticamente segun la estrategia
    // const points = this.pointsCalculator.calculatePoints(calculationData);
    
    // // Obtengo la explicacion del calculo
    // this.calculationProcessText = this.pointsCalculator.getCalculationExplanation(calculationData);
    
    // // Actualizo el formulario con los puntos calculados
    // this.formGroupPoints.patchValue({
    //   points: points
    // });
    
    // // Si es ver detalle se deshabilita el campo de puntos
    // if (this.isViewDetail) {
    //   this.formGroupPoints.disable();
    // }


    switch (typeProductionId) {
      case 1: // Trabajo, ensayo o artículo científico
        points = this.calculateArticlePoints(
          articleTypeId,
          publindexCategoryId,
          this.automaticPointsData.numberOfAuthors
        );
        break;

      case 2: // Libros que resulten de una labor de investigación
        // Para implementación futura
        points = this.calculateBookPoints();
        break;

      case 3: // Otros tipos de producción (por implementar)
        // Para implementación futura
        points = this.calculateOtherProductionPoints();
        break;

      default:
        // Si no coincide con ningún tipo conocido, no se asignan puntos
        this.messageService.add({
          severity: 'error',
          summary: 'Ups, algo salió mal',
          detail: 'Por el momento no se puede calcular los puntos automáticamente para este tipo de producción.'
        });
        console.warn(`Tipo de producción no reconocido: ${typeProductionId}`);
        points = 0;
    }

    // Actualizar el formulario con los puntos calculados
    this.formGroupPoints.patchValue({
      points: points
    });

    //Si es ver detalle se deshabilita el campo de puntos 
    if (this.isViewDetail) {
      this.formGroupPoints.disable();
    }
  }

  /**
   * Calcula los puntos para artículos científicos
   * @param articleType - Tipo de artículo
   * @param publindexCategory - Categoría de la revista
   * @param numberOfAuthors - Número de autores
   * @returns Puntos calculados truncados a dos decimales sin aproximación
   */
  private calculateArticlePoints(articleType: number, publindexCategory: number, numberOfAuthors: number): number {

    // Obtener puntos base según tipo de artículo y categoría
    const basePoints = this.getBasePoints(articleType, publindexCategory);
    // Aplicar factor de ajuste por número de autores
    const adjustedPoints = this.applyAuthorFactor(basePoints, numberOfAuthors);
    // Truncar a dos decimales sin aproximación
    const finalPoints = this.truncateToTwoDecimals(adjustedPoints);

    const articlePercentage = this.getArticlePercentage(articleType);
    const articlePercentageValue = articlePercentage * 100;
    const authorFactor = this.getAuthorNumericFactor(numberOfAuthors);

    // Mensaje 3: Número de autores
    const authorMessage = (() => {
      if (numberOfAuthors <= 3) {
        return `Como hay **${numberOfAuthors} autores**, por lo tanto **no se aplica ajuste** al puntaje.`;
      } else if (numberOfAuthors <= 5) {
        return `Como hay **${numberOfAuthors} autores**, lo que implica un **ajuste al 50%** del puntaje.`;
      } else {
        return `Como hay **${numberOfAuthors} autores**, por lo tanto el puntaje se **divide por ${numberOfAuthors / 2}**.`;
      }
    })();

    this.calculationProcessText = `
  1. **Puntos base**: ${this.basePointsMessage}
  2. ${this.articleTypeMessage}
  3. ${authorMessage}
  4. **Resultado final**:
     - ${basePoints / articlePercentage} × ${articlePercentageValue}% = **${basePoints}**
     - ${basePoints} × ${authorFactor} = **${adjustedPoints}**
     - Truncado sin redondeo: **${finalPoints} puntos**
  
  ### ✅ Puntaje asignado: **${finalPoints}**
  `.trim();

    return finalPoints;

  }

  /**
   * Método placeholder para calcular puntos de libros de investigación
   * Implementar según las reglas específicas para libros
   */
  private calculateBookPoints(): number {
    // Implementación futura para cálculo de puntos de libros
    // Por ahora retorna 0
    return 0;
  }

  /**
   * Método placeholder para calcular puntos de otros tipos de producción
   * Implementar según las reglas específicas para otros tipos
   */
  private calculateOtherProductionPoints(): number {
    // Implementación futura para cálculo de otros tipos de producción
    // Por ahora retorna 0
    return 0;
  }

  /**
   * Trunca un número a dos decimales sin aproximación
   * @param value - Valor numérico a truncar
   * @returns Valor truncado a dos decimales
   */
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

  /**
 * Calcula los puntos base según el tipo de artículo y categoría de la revista
 * @param articleType - Tipo de artículo (enum ArticleType)
 * @param publindexCategory - Categoría de la revista (enum PublindexCategory)
 * @returns Puntos base asignados
 */
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

  /**
   * Aplica el factor de ajuste según el número de autores
   * @param basePoints - Puntos base calculados
   * @param numberOfAuthors - Número de autores de la publicación
   * @returns Puntos ajustados según número de autores
   */
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

  private getAuthorFactorLabel(numberOfAuthors: number): string {
    if (numberOfAuthors <= 3) return '100% del puntaje';
    if (numberOfAuthors <= 5) return '50% del puntaje';
    return `el puntaje se divide entre la mitad del número de autores (${numberOfAuthors} / 2)`;
  }

  private getAuthorNumericFactor(numberOfAuthors: number): number {
    if (numberOfAuthors <= 3) return 1;
    if (numberOfAuthors <= 5) return 0.5;
    return 1 / (numberOfAuthors / 2);
  }

  get points() {
    return this.formGroupPoints.get('points');
  }

  returnViewApplicationList() {
    if (!this.isViewDetail) {
      if (this.role === RoleNames.CPD_MEMBER) {
        this.router.navigate(['revision-solicitudes/revisar-solicitud', this.applicationId]);
      }
      if (this.role === RoleNames.CPD_SECRETARY) {
        this.router.navigate(['revision-solicitudes/ver-detalle-solicitud', this.applicationId]);
      }
    } else {
      this.router.navigate(['revision-solicitudes/ver-detalle-solicitud', this.applicationId]);
    }
  }

}
