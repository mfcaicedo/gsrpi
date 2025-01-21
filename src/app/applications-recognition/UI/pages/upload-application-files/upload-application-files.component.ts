import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUpload } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';

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

  isDisabledNextStep = true;

  private readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  ngOnInit() {

  }

  modalNewApplicantOrNextStep(event: Event) {
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
        console.log("acept button modal");
        //TODO: Llamar al servicio para guardar la solicitud 

        //2. Guardar los archivos en el servidor

        //3. Mostrar mensaje de confirmación
        this.messageService.add(
          {
            severity: 'success',
            summary: 'Solicitud enviada',
            detail: 'La solicitud de reconocimiento de producción intelectual se ha enviado correctamente'
          });

          setTimeout(() => {
            //3. Redireccionar a la lista de solicitudes
            this.router.navigate(['solicitudes-reconocimiento/listar-solicitudes']);
          }, 3000);
      },
      reject: () => {
        console.log("reject button modal");
      },
    });
  }

  onSelectFiles(event: any) {

    console.log("ver el event: ", event);

    for (let file of event.files) {
      this.selectedFiles.push(file);
    }

    console.log("loso archivos seleccionados: ", this.selectedFiles);

    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }

  onUpload() {
    console.log("subir archivos");
    //TODO: Enviar los archivos al servicio
    console.log("Estos son los archivos", this.selectedFiles);

    //2. Activo el boton enviar solicitud
    this.isDisabledNextStep = false;

  }

}
