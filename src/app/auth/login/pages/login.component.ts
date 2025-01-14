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

  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  loginForm!: FormGroup;

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

    this.authService.login(this.loginForm.value as Login).subscribe({
      next: (response) => {
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
          this.authService.getSession().pipe(take(1)).subscribe(() => {
            this.router.navigate(['/']);
          });

          // this.router.navigate(['/']);
        } else if (response.error.status === 400) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'El correo o la contraseña ingresados son incorrectos.'
          });
        } else {
          console.log("Error desconocido, intente nuevamente");
        }
      },
      error: (error) => {
        console.log('Login error ', error);
      }
    });

  }

}
