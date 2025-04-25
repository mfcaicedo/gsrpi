import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../auth/auth.service';
import { RoleNames } from '../../../auth/enums/roles.enum';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-welcome',
  imports: [ButtonModule, RouterModule, CommonModule, ToastModule, ConfirmDialogModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent implements OnInit {

  role = '';

  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);

  get RoleNames() {
    return RoleNames;
  }

  ngOnInit(): void {

    this.authService.getUserDataSession().subscribe((data: any) => {
      const roles = data.userRoles;
      this.role = roles[0].role.name;
    });

  }

  showModalFunctionalityNotAvailable() {
    this.messageService.add({
      severity: 'info',
      summary: 'Muy pronto estará disponible',
      detail: 'Esta funcionalidad estará disponible en futuras versiones.',
    });
  }

}
