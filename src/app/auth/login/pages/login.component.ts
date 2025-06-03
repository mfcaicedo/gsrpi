import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Login, LoginSuccess } from '../types/login-response.type';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { UserManagementUseCase } from '../../../user-management/domain/usecase/user-management-usecase';
import { UserDataSession } from '../interfaces/models/user-data-session.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CheckboxModule, InputTextModule, ButtonModule, FormsModule,
    PasswordModule, RouterModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  userDataSession: Partial<UserDataSession> = {};

  isLoadingLogin = false;

  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly userManagementUseCase = inject(UserManagementUseCase);


  constructor() { }

  ngOnInit(): void {

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

  }

  onLoginFormSubmitted() {

    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoadingLogin = true;
    this.authService.login(this.loginForm.value as Login).subscribe({
      next: async (response) => {
        // const loginSuccessData: LoginSuccess = {
        //   accessToken: response.data.session.access_token,
        //   refreshToken: response.data.session.refresh_token,
        //   expiresIn: response.data.session.expires_in,
        //   expiresAt: response.data.session.expires_at,
        //   tokenType: response.data.session.token_type,
        //   notBeforePolicy: 0,
        //   sessionState: response.data.user.aud
        // };
        if (response.data.session !== null) {

          // Actualiza el estado de autenticación
          this.authService.updateAuthStatus();

          //Consulto datos del usuario 
          await this.getUserByUid(response.data.user.id);
          await this.getPersonByUserId();
          await this.getTeacherByPersonId();
          this.authService.setUserDataSession(this.userDataSession);

          this.authService.getSession().pipe(take(1)).subscribe(() => {
            this.router.navigate(['/']);
            this.isLoadingLogin = false;
          });

        } else if (response.error.status === 400) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'El correo o la contraseña ingresados son incorrectos.'
          });
          this.isLoadingLogin = false;
        } else {
          console.log("Error desconocido, intente nuevamente");
          this.isLoadingLogin = false;
        }
      },
      error: (error) => {
        console.log('Login error ', error);
        this.isLoadingLogin = false;
      }
    });

  }

  async getUserByUid(uid: string) {
    return new Promise((resolve) => {
      this.userManagementUseCase.getUserByUid(uid).subscribe({
        next: (response: any) => {
          this.userDataSession.userId = response.userId;
          this.userDataSession.email = response.email;
          this.userDataSession.userRoles = response.userRoles;
          resolve(true);
        },
        error: (error) => {
          resolve(false);
          console.log("error", error);
        }
      });
    });
  }

  async getPersonByUserId() {
    return new Promise((resolve) => {
      this.userManagementUseCase.getPersonByUserId(this.userDataSession.userId ?? 0).subscribe({
        next: (response: any) => {
          this.userDataSession.personId = response.personId;
          this.userDataSession.nombres = `${response.firstName ?? ''} ${response.secondName ?? ''}`.trim();
          this.userDataSession.apellidos = `${response.firstLastName ?? ''} ${response.secondLastName ?? ''}`.trim();
          this.userDataSession.configurationId = response.configurationId;
          resolve(true);
        },
        error: (error) => {
          resolve(false);
          console.log("error", error);
        }
      });
    });
  }

  async getTeacherByPersonId() {

    return new Promise((resolve) => {
      this.userManagementUseCase.getTeacherByPersonId(this.userDataSession.personId ?? 0).subscribe({
        next: (response: any) => {
          if (response !== null) {
            this.userDataSession.teacherId = response.teacherId;
          }
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
