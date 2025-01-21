import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-list-applications',
  imports: [CommonModule, ButtonModule, RouterModule,
    ToastModule, ConfirmDialogModule],
    providers: [ConfirmationService, MessageService],
  templateUrl: './list-applications.component.html',
  styleUrl: './list-applications.component.css'
})
export class ListApplicationsComponent {


  private readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);


}
