import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../auth/auth.service';
import { RoleNames } from '../../../auth/enums/roles.enum';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  imports: [ButtonModule, RouterModule, CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent implements OnInit {

  role = '';

  private readonly authService = inject(AuthService);

  get RoleNames() {
    return RoleNames;
  }

  ngOnInit(): void {

    this.authService.getUserDataSession().subscribe((data: any) => {
      const roles = data.userRoles;
      this.role = roles[0].role.name;
    });

  }

}
