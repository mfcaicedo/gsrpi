import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Application } from '../../../domain/models/applications.model';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-list-applications',
  imports: [CommonModule, ButtonModule, RouterModule, IconFieldModule, InputIconModule, InputTextModule,
    ToastModule, ConfirmDialogModule, TableModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './list-applications.component.html',
  styleUrl: './list-applications.component.css'
})
export class ListApplicationsComponent {

  @ViewChild('dt1') dt1!: Table;

  first = 0;
  rows = 10;

  applications: Partial<Application>[] = [];

  private readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  ngOnInit() {
    this.applications = [
      {
        applicationId: 1,
        description: 'description',
        numberOfAuthors: 1,
        termsAndConditions: true,
        applicationTypeCatId: 1,
        createAt: '2021-01-01',
        production: {
          productionType: {
            typeProductionId: 1,
            name: 'Revista',
            alias: 'alias',
          }
        },
        applicationStatus: {
          statusApplicationId: 1,
          name: 'statusName',
        }
      },
      {
        applicationId: 2,
        description: 'description',
        numberOfAuthors: 1,
        termsAndConditions: true,
        applicationTypeCatId: 1,
        createAt: '2021-01-02',
        production: {
          productionType: {
            typeProductionId: 1,
            name: 'dRevista2',
            alias: 'alias',
          }
        },
        applicationStatus: {
          statusApplicationId: 1,
          name: 'statusName',
          description: 'statusDescription'
        }
      },
      {
        applicationId: 3,
        description: 'description',
        numberOfAuthors: 1,
        termsAndConditions: true,
        applicationTypeCatId: 1,
        createAt: '2021-01-02',
        production: {
          productionType: {
            typeProductionId: 1,
            name: 'dRevista2',
            alias: 'alias',
          }
        },
        applicationStatus: {
          statusApplicationId: 1,
          name: 'statusName',
          description: 'statusDescription'
        }
      },
      {
        applicationId: 4,
        description: 'description',
        numberOfAuthors: 1,
        termsAndConditions: true,
        applicationTypeCatId: 1,
        createAt: '2021-01-02',
        production: {
          productionType: {
            typeProductionId: 1,
            name: 'dRevista2',
            alias: 'alias',
          }
        },
        applicationStatus: {
          statusApplicationId: 1,
          name: 'statusName',
          description: 'statusDescription'
        }
      },
      {
        applicationId: 5,
        description: 'description',
        numberOfAuthors: 1,
        termsAndConditions: true,
        applicationTypeCatId: 1,
        createAt: '2021-01-02',
        production: {
          productionType: {
            typeProductionId: 1,
            name: 'dRevista2',
            alias: 'alias',
          }
        },
        applicationStatus: {
          statusApplicationId: 1,
          name: 'statusName',
          description: 'statusDescription'
        }
      },
      {
        applicationId: 6,
        description: 'description',
        numberOfAuthors: 1,
        termsAndConditions: true,
        applicationTypeCatId: 1,
        createAt: '2021-01-02',
        production: {
          productionType: {
            typeProductionId: 1,
            name: 'dRevista2',
            alias: 'alias',
          }
        },
        applicationStatus: {
          statusApplicationId: 1,
          name: 'statusName',
          description: 'statusDescription'
        }
      },
      {
        applicationId: 7,
        description: 'description',
        numberOfAuthors: 1,
        termsAndConditions: true,
        applicationTypeCatId: 1,
        createAt: '2021-01-02',
        production: {
          productionType: {
            typeProductionId: 1,
            name: 'dRevista2',
            alias: 'alias',
          }
        },
        applicationStatus: {
          statusApplicationId: 1,
          name: 'statusName',
          description: 'statusDescription'
        }
      },
      {
        applicationId: 8,
        description: 'description',
        numberOfAuthors: 1,
        termsAndConditions: true,
        applicationTypeCatId: 1,
        createAt: '2021-01-02',
        production: {
          productionType: {
            typeProductionId: 1,
            name: 'dRevista2',
            alias: 'alias',
          }
        },
        applicationStatus: {
          statusApplicationId: 1,
          name: 'statusName',
          description: 'statusDescription'
        }
      },
      {
        applicationId: 9,
        description: 'description',
        numberOfAuthors: 1,
        termsAndConditions: true,
        applicationTypeCatId: 1,
        createAt: '2021-01-02',
        production: {
          productionType: {
            typeProductionId: 1,
            name: 'dRevista2',
            alias: 'alias',
          }
        },
        applicationStatus: {
          statusApplicationId: 1,
          name: 'statusName',
          description: 'statusDescription'
        }
      },
      {
        applicationId: 10,
        description: 'description',
        numberOfAuthors: 1,
        termsAndConditions: true,
        applicationTypeCatId: 1,
        createAt: '2021-01-02',
        production: {
          productionType: {
            typeProductionId: 1,
            name: 'dRevista2',
            alias: 'alias',
          }
        },
        applicationStatus: {
          statusApplicationId: 1,
          name: 'statusName',
          description: 'statusDescription'
        }
      },
      {
        applicationId: 11,
        description: 'description',
        numberOfAuthors: 1,
        termsAndConditions: true,
        applicationTypeCatId: 1,
        createAt: '2021-01-02',
        production: {
          productionType: {
            typeProductionId: 1,
            name: 'dRevista2',
            alias: 'alias',
          }
        },
        applicationStatus: {
          statusApplicationId: 1,
          name: 'statusName',
          description: 'statusDescription'
        }
      },
      {
        applicationId: 12,
        description: 'description',
        numberOfAuthors: 1,
        termsAndConditions: true,
        applicationTypeCatId: 1,
        createAt: '2021-01-02',
        production: {
          productionType: {
            typeProductionId: 1,
            name: 'dRevista2',
            alias: 'alias',
          }
        },
        applicationStatus: {
          statusApplicationId: 1,
          name: 'statusName',
          description: 'statusDescription'
        }
      },
      {
        applicationId: 13,
        description: 'description',
        numberOfAuthors: 1,
        termsAndConditions: true,
        applicationTypeCatId: 1,
        createAt: '2021-01-02',
        production: {
          productionType: {
            typeProductionId: 1,
            name: 'dRevista2',
            alias: 'alias',
          }
        },
        applicationStatus: {
          statusApplicationId: 1,
          name: 'statusName',
          description: 'statusDescription'
        }
      },
      {
        applicationId: 14,
        description: 'description',
        numberOfAuthors: 1,
        termsAndConditions: true,
        applicationTypeCatId: 1,
        createAt: '2021-01-02',
        production: {
          productionType: {
            typeProductionId: 1,
            name: 'dRevista2',
            alias: 'alias',
          }
        },
        applicationStatus: {
          statusApplicationId: 1,
          name: 'statusName',
          description: 'statusDescription'
        }
      },
      {
        applicationId: 15,
        description: 'description',
        numberOfAuthors: 1,
        termsAndConditions: true,
        applicationTypeCatId: 1,
        createAt: '2021-01-02',
        production: {
          productionType: {
            typeProductionId: 1,
            name: 'dRevista2',
            alias: 'alias',
          }
        },
        applicationStatus: {
          statusApplicationId: 1,
          name: 'statusName',
          description: 'statusDescription'
        }
      }
    ];
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  pageChange(event: { first: number; rows: number; }) {
    this.first = event.first;
    this.rows = event.rows;
  }

  isLastPage(): boolean {
    return this.applications ? this.first + this.rows >= this.applications.length : true;
  }

  isFirstPage(): boolean {
    return this.applications ? this.first === 0 : true;
  }

  search(event: Event) {
    // console.log("event: ", event.target.value);
    const target = event.target as HTMLInputElement | null;
    if (target) {
      this.dt1.filterGlobal(target.value, 'contains');
    }
  }

  viewApplication(applicationId: number) {

    this.messageService.add(
      {
        severity: 'success',
        summary: 'Muy pronto estará disponible',
        detail: 'Esta funcionalidad estará disponible en la siguiente versión.'
      });

  }

  editApplication(applicationId: number) {

    this.messageService.add(
      {
        severity: 'success',
        summary: 'Muy pronto estará disponible',
        detail: 'Esta funcionalidad estará disponible en la siguiente versión.'
      });

  }

  deleteApplication(applicationId: number) {

    this.confirmationService.confirm({
      target: 'body' as unknown as EventTarget,
      message: '¿Está seguro(a) de eliminar la solicitud?',
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
        //Llamar al servicio para eliminar la solicitud
      },
    });

  }

}
