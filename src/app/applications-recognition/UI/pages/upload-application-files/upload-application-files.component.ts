import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUpload } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../../auth/auth.service';
import { ApplicationRequest } from '../../../domain/models/applications.model';
import { UserManagementUseCase } from '../../../../user-management/domain/usecase/user-management-usecase';
import { ApplicationTempManagementUsecase } from '../../../domain/usecase/application-temp-management-usecase';
import { getCurrentDate } from '../../../../shared/utils/management-date';
import { ApplicationManagementUseCase } from '../../../domain/usecase/application-management-usecase';
import { FileMetadata } from '../../../../shared/utils/models/file-common.model';

@Component({
  selector: 'app-upload-application-files',
  imports: [CommonModule, ButtonModule, ProgressBarModule, RouterModule,
    ToastModule, ConfirmDialogModule, FileUpload],
  providers: [ConfirmationService, MessageService],
  templateUrl: './upload-application-files.component.html',
  styleUrl: './upload-application-files.component.css'
})
export class UploadApplicationFilesComponent {

  selectedFiles: File[] = [];
  filesIds: number[] = [];

  applicationRequest: ApplicationRequest = {} as ApplicationRequest;

  isDisabledSendApplication = true;
  isDisabledBtnUpload = false;

  teacherId = 0;
  role = '';

  private readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly authService = inject(AuthService);
  private readonly userManagementUseCase = inject(UserManagementUseCase);
  private readonly applicationTempManagementUsecase = inject(ApplicationTempManagementUsecase);
  private readonly applicationManagementUseCase = inject(ApplicationManagementUseCase);

  async ngOnInit() {

    this.authService.getUserDataSession().subscribe((data: any) => {
      this.teacherId = data.teacherId;
      const roles = data.userRoles;
      this.role = roles[0].role.name;
    });

    await this.getApplicationTempByTeacherId();

  }

  async getApplicationTempByTeacherId() {

    return new Promise((resolve) => {
      this.applicationTempManagementUsecase.getApplicationTempByTeacherId(this.teacherId).subscribe({
        next: (response: any) => {
          this.applicationRequest.applicationTempId = response.applicationTempId;
          resolve(true);
        },
        error: (error) => {
          this.messageService.add(
            {
              severity: 'error',
              summary: 'Ups, algo salió mal',
              detail: 'Tuvimos un problema al consultar la solicitud de reconocimiento. Inténtelo de nuevo en unos minutos.'
            });
          console.error("error", error);
          resolve(false);
        }
      });
    });
  }

  modalSendApplication(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Está seguro(a) de enviar la solicitud de reconocimiento de producción intelectual?',
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
      accept: () => {
        //TODO: Llamar al servicio para guardar la solicitud 
        this.saveApplication();
      },
      reject: () => {
        console.log("reject button modal");
      },
    });
  }

  saveApplication() {
    this.applicationManagementUseCase.createApplication(this.applicationRequest).subscribe({
      next: (response: any) => {
        this.messageService.add(
          {
            severity: 'success',
            summary: 'Solicitud enviada',
            detail: 'La solicitud de reconocimiento de producción intelectual se ha enviado correctamente'
          });
        //3. Redireccionar a la lista de solicitudes
        setTimeout(() => {
          this.router.navigate(['solicitudes-reconocimiento/listar-solicitudes']);
        }, 3000);
      },
      error: (error) => {
        console.log("error", error);
        this.messageService.add(
          {
            severity: 'error',
            summary: 'Error al enviar solicitud',
            detail: 'Ha ocurrido un error al enviar la solicitud de reconocimiento de producción intelectual'
          });
      }
    });
  }

  onSelectFiles(event: any, name: string) {

    for (let file of event.files) {
      this.selectedFiles.push(file);
    }

  }

  async onUpload() {

    if (!this.selectedFiles || this.selectedFiles.length < 2) {
      this.messageService.add(
        {
          severity: 'warn',
          summary: 'Archivos no seleccionados',
          detail: 'Debe seleccionar los archivos de producción intelectual y copia de clasificación'
        });
      return Promise.reject("Debe seleccionar al menos dos archivos");
    }

    const uploads = [
      this.authService.saveFile(this.selectedFiles[0], 'producto-de-solicitud', 'gsrpi-storage', 'solicitudes').toPromise(),
      this.authService.saveFile(this.selectedFiles[1], 'copia-clasificacion', 'gsrpi-storage', 'solicitudes').toPromise()
    ];

    try {
      const results = await Promise.all(uploads);
      if (results.every(result => result?.error === null)) {
        this.messageService.add(
          {
            severity: 'success',
            summary: 'Archivos guardados',
            detail: 'Los archivos han sido guardados exitosamente'
          });

        //Se guradan los archivos a la tabla File de la base de datos (metadata)
        //y se obtiene el id de cada archivo
        const metadataFiles: Partial<FileMetadata>[] = [
          {
            name: results[0].data.path.split('/')[1] ?? '',
            type: this.selectedFiles[0].type,
            extension: this.selectedFiles[0].type.split('/')[1],
            path: results[0].data.path,
            observations: '',
            size: this.selectedFiles[0].size,
            state: true,
            createAt: getCurrentDate()
          },
          {
            name: results[1].data.path.split('/')[1] ?? '',
            type: this.selectedFiles[1].type,
            extension: this.selectedFiles[1].type.split('/')[1],
            path: results[1].data.path,
            observations: '',
            size: this.selectedFiles[1].size,
            state: true,
            createAt: getCurrentDate()
          }
        ];
        await this.saveMetadataFile(metadataFiles[0]);
        await this.saveMetadataFile(metadataFiles[1]);

        //Agrego los archivos a la solicitud request
        this.applicationRequest.productionFiles = [
          { fileId: this.filesIds[0], name: metadataFiles[0].name ?? '' },
          { fileId: this.filesIds[1], name: metadataFiles[1].name ?? '' }
        ];

        //Activo el boton enviar solicitud
        this.isDisabledSendApplication = false;
        this.isDisabledBtnUpload = true;
      } else {
        this.messageService.add(
          {
            severity: 'error',
            summary: 'Error al guardar archivos',
            detail: 'Ha ocurrido un error al guardar los archivos'
          });
      }
    } catch (error) {
      console.error("Error desconocido", error);
    }

  }

  saveMetadataFile(metadataFile: Partial<FileMetadata>) {
    return new Promise((resolve) => {
      this.applicationManagementUseCase.saveMetadataFile(metadataFile).subscribe({
        next: (response: any) => {
          this.filesIds.push(response.fileId);
          resolve(true);
        },
        error: (error) => {
          resolve(false);
          console.log("error", error);
        }
      });
    });
  }

}
